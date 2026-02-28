import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false, // We register manually in main.tsx with error handling
      workbox: {
        maximumFileSizeToCacheInBytes: 300 * 1024 * 1024, // Allow large model files
        // Serve cached index.html for all navigation requests when offline
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/models/, /^\/wasm/],
        runtimeCaching: [
          {
            // Cache page assets (JS, CSS, images) on first load
            urlPattern: /\.(?:js|css|png|svg|ico|woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "app-assets",
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // Cache the WebGPU WASM binary so engine can init offline
            urlPattern: /\/wasm\/.+\.wasm$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "wasm-cache",
              expiration: { maxEntries: 5, maxAgeSeconds: 90 * 24 * 60 * 60 },
            },
          },
          {
            // Cache model config JSONs (mlc-chat-config.json, ndarray-cache.json)
            urlPattern: /\/models\/.+\.json$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "model-config-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 90 * 24 * 60 * 60 },
            },
          },
          {
            // Cache model weight shards (.bin) as fallback to WebLLM's IndexedDB
            urlPattern: /\/models\/.+\.bin$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "model-weights-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 90 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: "The Invisible Schoolhouse",
        short_name: "Tutor",
        description: "Offline AI Tutor — runs on your device",
        theme_color: "#030712",
        background_color: "#030712",
        display: "standalone",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/models": {
        target: "https://localhost:8080",
        secure: false, // accept self-signed cert
      },
      "/wasm": {
        target: "https://localhost:8080",
        secure: false,
      },
    },
  },
});
