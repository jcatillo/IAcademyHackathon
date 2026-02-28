import { useState } from "react";
import { PlusSquare, Download, Info } from "lucide-react";
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
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-primary px-6 text-center animate-in fade-in duration-700">
      {/* Success badge */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-500/10">
        <span className="text-4xl">✅</span>
      </div>

      <div className="max-w-sm space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Tutor Ready</h1>
        <p className="text-sm leading-relaxed text-text-subtle font-medium">
          The models are synced. Install the app to access your lessons{" "}
          <span className="font-bold text-accent">anytime, anywhere</span>, even
          without a network connection.
        </p>
      </div>

      {/* iOS instructions */}
      {isIOS && (
        <div className="w-full max-w-sm card bg-surface p-6 text-left border-dashed">
          <p className="text-sm font-bold flex items-center gap-2 mb-2">
            <PlusSquare size={18} className="text-accent" />
            Add to Home Screen
          </p>
          <p className="text-xs leading-relaxed text-text-subtle font-medium">
            Tap the{" "}
            <span className="bg-white px-2 py-0.5 rounded border border-border inline-flex items-center gap-1 font-bold text-accent">
              <ShareIcon /> share button
            </span>{" "}
            then select{" "}
            <span className="font-bold text-text">"Add to Home Screen"</span>.
          </p>
        </div>
      )}

      {/* Install button */}
      {!isIOS && (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={handleInstall}
            disabled={installing}
            className="btn-accent w-full py-4 text-base flex items-center justify-center gap-3 shadow-lg shadow-accent/20 disabled:shadow-none disabled:bg-border"
          >
            <Download size={20} />
            {installing ? "Installing…" : "Install Native App"}
          </button>
        </div>
      )}

      {/* Manual fallback instructions */}
      {showManual && (
        <div className="w-full max-w-sm card bg-amber-50 border-amber-100 p-6 text-left">
          <p className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <Info size={16} />
            Manual Installation
          </p>
          <ol className="space-y-3 text-xs text-amber-900/70 font-medium">
            <li className="flex gap-2">
              <span className="font-bold text-amber-700">1.</span>
              <span>
                Open the <span className="font-bold">browser menu</span> (the
                three dots ⋮ in the top corner)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-amber-700">2.</span>
              <span>
                Select{" "}
                <span className="font-bold text-text">"Install app"</span> or{" "}
                <span className="font-bold text-text">
                  "Add to Home Screen"
                </span>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-amber-700">3.</span>
              <span>Confirm the installation dialog</span>
            </li>
          </ol>
        </div>
      )}

      {/* Skip / Continue */}
      <button
        onClick={handleSkip}
        className="text-xs font-bold text-text-subtle hover:text-accent transition-colors uppercase tracking-[0.2em] pt-4"
      >
        {showManual || isIOS ? "Continue to Hub →" : "Skip for now"}
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
