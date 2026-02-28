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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-6 text-center text-text animate-in fade-in duration-700">
      {/* ── Debug Panel ──────────────────────────────────────────── */}
      <div className="mb-8 w-full max-w-sm space-y-4 rounded-3xl bg-surface p-6 text-left font-mono text-[11px] border border-border shadow-sm">
        <p className="text-sm font-bold text-accent uppercase tracking-widest">PWA Debug Panel</p>
        <div className="space-y-2 opacity-80">
          <p>
            <span className="font-bold">Protocol:</span>{" "}
            {httpsStatus === "https:" ? "✅ HTTPS" : "❌ " + httpsStatus}
          </p>
          <p>
            <span className="font-bold">SW:</span> {swStatus}
          </p>
          <p>
            <span className="font-bold">Manifest:</span> {manifestStatus}
          </p>
          <p>
            <span className="font-bold">Icon:</span> {iconStatus}
          </p>
          <p>
            <span className="font-bold">Standalone:</span>{" "}
            {isInstalled ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2 rounded-full bg-surface px-5 py-2 text-[10px] font-bold uppercase tracking-widest border border-border shadow-sm">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isInstalled ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 animate-pulse"
          }`}
        />
        {isInstalled ? "Ready for Offline Use" : "Syncing with Hub"}
      </div>

      <p className="text-6xl drop-shadow-sm">📚</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        The Invisible Schoolhouse
      </h1>

      {isInstalled ? (
        <div className="mt-8 max-w-xs space-y-6">
          <div className="card bg-emerald-50 border-emerald-100 p-6">
            <p className="text-lg font-bold text-emerald-800 mb-2">
              Installation Verified
            </p>
            <p className="text-sm text-emerald-900/60 leading-relaxed font-medium">
              Offline mode is now active. You can access your Socratic tutor anytime, even without internet.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-xs space-y-6">
          <p className="text-sm text-text-subtle font-medium leading-relaxed">
            Connected to the local hub. Install the app to unlock your personal offline tutor.
          </p>
          <InstallPrompt onDone={() => {}} />
        </div>
      )}
    </div>
  );
}
