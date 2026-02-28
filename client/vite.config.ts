import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false, // We register manually in main.tsx (skip on LAN IPs)
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB — WebLLM bundle is large
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
