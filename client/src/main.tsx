import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register Service Worker on ALL origins (not just localhost).
// On LAN with self-signed HTTPS:
//   1st visit: cert warning → accept → SW may fail
//   2nd visit (reload): cert accepted → SW registers → caches app shell
//   3rd+ visit: app opens fully offline, no server needed
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({
      immediate: true,
      onRegisteredSW(_swUrl: string) {
        console.log("[SW] Registered — app will work offline after this.");
      },
      onRegisterError(error: Error) {
        console.warn(
          "[SW] Registration failed (self-signed cert?).",
          "Reload the page after accepting the security warning.",
          error,
        );
      },
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
