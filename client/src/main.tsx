import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Only register the Service Worker on localhost.
// Self-signed HTTPS certs (used for LAN WebGPU) cause SW registration to fail.
// WebLLM's IndexedDB caching works independently — SW is only for PWA install.
if (
  "serviceWorker" in navigator &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
