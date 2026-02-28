import { useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

const INSTALLED_KEY = "invisible-schoolhouse-installed";

interface InstallPromptProps {
  /** Called when user finishes the install flow (native install, or skip) */
  onDone: () => void;
}

export default function InstallPrompt({ onDone }: InstallPromptProps) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const [showManual, setShowManual] = useState(false);
  const [installing, setInstalling] = useState(false);

  // Already installed (e.g. running as standalone PWA)
  // or user previously completed this screen
  if (isInstalled || localStorage.getItem(INSTALLED_KEY) === "true") {
    // auto-advance
    onDone();
    return null;
  }

  const handleInstall = async () => {
    setInstalling(true);

    if (isInstallable) {
      // Native Chrome install prompt available
      const accepted = await promptInstall();
      if (accepted) {
        localStorage.setItem(INSTALLED_KEY, "true");
        onDone();
        return;
      }
    }

    // Native prompt not available or was dismissed — show manual steps
    setShowManual(true);
    setInstalling(false);
  };

  const handleSkip = () => {
    localStorage.setItem(INSTALLED_KEY, "true");
    onDone();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-950 px-6 text-center">
      {/* Success badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
        <span className="text-3xl">✅</span>
      </div>

      <div className="max-w-sm">
        <h1 className="text-xl font-bold text-white">AI Tutor Ready</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          The AI model and app are saved to your device. Install it so you can
          open it anytime —{" "}
          <span className="font-medium text-white">
            even without Wi-Fi or the teacher's server
          </span>
          .
        </p>
      </div>

      {/* iOS instructions */}
      {isIOS && (
        <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-4 ring-1 ring-white/10 text-left">
          <p className="text-sm font-semibold text-white">
            📲 Add to Home Screen
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            Tap{" "}
            <span className="inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 font-medium text-white">
              <ShareIcon /> Share
            </span>{" "}
            then select{" "}
            <span className="font-medium text-white">"Add to Home Screen"</span>
          </p>
        </div>
      )}

      {/* Install button */}
      {!isIOS && (
        <button
          onClick={handleInstall}
          disabled={installing}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-500 active:scale-95 disabled:opacity-50"
        >
          <span className="text-lg">📥</span>
          {installing ? "Installing…" : "Install App"}
        </button>
      )}

      {/* Manual fallback instructions */}
      {showManual && (
        <div className="w-full max-w-sm rounded-2xl bg-amber-900/20 p-4 ring-1 ring-amber-500/20 text-left">
          <p className="text-sm font-semibold text-amber-300">
            Add to Home Screen manually
          </p>
          <ol className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            <li>
              1. Tap the <span className="font-medium text-white">⋮ menu</span>{" "}
              (top-right corner in Chrome)
            </li>
            <li>
              2. Select{" "}
              <span className="font-medium text-white">"Install app"</span> or{" "}
              <span className="font-medium text-white">
                "Add to Home Screen"
              </span>
            </li>
            <li>
              3. Tap <span className="font-medium text-white">"Install"</span>
            </li>
          </ol>
        </div>
      )}

      {/* Skip / Continue */}
      <button
        onClick={handleSkip}
        className="text-xs text-gray-500 underline decoration-gray-700 underline-offset-2 transition hover:text-gray-300"
      >
        {showManual || isIOS ? "Continue to Chat →" : "Skip for now"}
      </button>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v12M8 7l4-4 4 4"
      />
    </svg>
  );
}
