import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ── Force Service Worker Registration ───────────────────────
// We call this directly to ensure the SW controls the page immediately
import { registerSW } from "virtual:pwa-register";

// This immediately registers the service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // For a hackathon, keep it simple: if you push new code, force a reload
    if (confirm("New app update available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log(
      "✅ The Invisible Schoolhouse is now cached and ready for offline use!",
    );
  },
});
// ────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

