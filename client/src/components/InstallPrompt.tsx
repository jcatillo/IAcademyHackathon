import { useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

export default function InstallPrompt() {
  const { isInstalled, isIOS, promptInstall } = usePwaInstall();
  const [showManualSteps, setShowManualSteps] = useState(false);

  if (isInstalled) return null;

  if (isIOS) {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-4 ring-1 ring-white/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📲</span>
          <div>
            <p className="text-sm font-semibold text-white">
              Install Tutor App
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              Tap{" "}
              <span className="inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 font-medium text-white">
                <ShareIcon /> Share
              </span>{" "}
              then select{" "}
              <span className="font-medium text-white">
                "Add to Home Screen"
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleClick = async () => {
    const accepted = await promptInstall();
    // If promptInstall returned false, the native event never fired
    // Show manual fallback instructions instead
    if (!accepted) {
      setShowManualSteps(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-500 active:scale-95"
      >
        <span className="text-lg">📥</span>
        Install Tutor App
      </button>

      {showManualSteps && (
        <div className="w-full max-w-sm rounded-2xl bg-amber-900/20 p-4 ring-1 ring-amber-500/20">
          <p className="text-sm font-semibold text-amber-300">
            Install Manually
          </p>
          <ol className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            <li>
              1. Tap the <span className="font-medium text-white">⋮ menu</span>{" "}
              (top-right in Chrome)
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
