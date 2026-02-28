/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";
import InstallPrompt from "../components/InstallPrompt";

export default function StudentApp() {
  const { isInstalled } = usePwaInstall();
  const [swStatus, setSwStatus] = useState("Checking...");
  const [manifestStatus, setManifestStatus] = useState("Checking...");
  const [httpsStatus] = useState(window.location.protocol);

  useEffect(() => {
    // Check SW registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          if (registrations.length > 0) {
            const sw = registrations[0];
            setSwStatus(
              `✅ Registered (scope: ${sw.scope}, state: ${
                sw.active?.state ?? sw.installing?.state ?? "unknown"
              })`,
            );
          } else {
            setSwStatus("❌ No service worker registered");
          }
        })
        .catch((err) => setSwStatus(`❌ Error: ${err.message}`));
    } else {
      setSwStatus("❌ Service Workers not supported");
    }

    // Check manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const href = manifestLink.getAttribute("href");
      fetch(href!)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(`HTTP ${res.status}`);
        })
        .then((json) => {
          const hasIcons = json.icons && json.icons.length > 0;
          const hasName = !!json.name;
          const hasStartUrl = !!json.start_url;
          const hasDisplay = json.display === "standalone";
          setManifestStatus(
            [
              hasName ? "✅ name" : "❌ name",
              hasStartUrl ? "✅ start_url" : "❌ start_url",
              hasDisplay ? "✅ standalone" : "❌ display",
              hasIcons ? `✅ ${json.icons.length} icons` : "❌ no icons",
            ].join(" · "),
          );
        })
        .catch((err) =>
          setManifestStatus(`❌ Failed to fetch: ${err.message}`),
        );
    } else {
      setManifestStatus("❌ No <link rel='manifest'> found in DOM");
    }
  }, []);

  // Check if icons actually load
  const [iconStatus, setIconStatus] = useState("Checking...");
  useEffect(() => {
    const img = new Image();
    img.onload = () =>
      setIconStatus(`✅ 192px icon loads (${img.width}x${img.height})`);
    img.onerror = () => setIconStatus("❌ 192px icon FAILED to load");
    img.src = "/icons/icon-192x192.png";
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-950 px-6 text-center text-gray-100">
      {/* ── Debug Panel ──────────────────────────────────────────── */}
      <div className="mb-6 w-full max-w-sm space-y-2 rounded-xl bg-gray-900 p-4 text-left font-mono text-xs ring-1 ring-white/10">
        <p className="text-sm font-bold text-yellow-300">PWA Debug Panel</p>
        <p>
          <span className="text-gray-500">Protocol:</span>{" "}
          {httpsStatus === "https:" ? "✅ HTTPS" : "❌ " + httpsStatus}
        </p>
        <p>
          <span className="text-gray-500">SW:</span> {swStatus}
        </p>
        <p>
          <span className="text-gray-500">Manifest:</span> {manifestStatus}
        </p>
        <p>
          <span className="text-gray-500">Icon:</span> {iconStatus}
        </p>
        <p>
          <span className="text-gray-500">Standalone:</span>{" "}
          {isInstalled ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      {/* ── Status indicator ─────────────────────────────────────── */}
      <div className="mb-6 flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs ring-1 ring-white/10">
        <span
          className={`h-2 w-2 rounded-full ${
            isInstalled ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
          }`}
        />
        {isInstalled ? "Installed & Offline-Ready" : "Connected to Teacher Hub"}
      </div>

      <p className="text-5xl">📚</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        The Invisible Schoolhouse
      </h1>

      {isInstalled ? (
        <div className="mt-6 max-w-xs space-y-4">
          <div className="rounded-2xl bg-emerald-500/10 p-5 ring-1 ring-emerald-500/20">
            <p className="text-lg font-semibold text-emerald-400">
              ✓ App Installed Successfully
            </p>
            <p className="mt-2 text-sm text-gray-400">
              You can now turn on Airplane Mode. Your tutor lives on this device
              — no internet needed.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-xs space-y-5">
          <p className="text-sm text-gray-400">
            You're connected to your teacher's local network. Install the app to
            take your tutor offline.
          </p>
          <InstallPrompt />
        </div>
      )}
    </div>
  );
}
