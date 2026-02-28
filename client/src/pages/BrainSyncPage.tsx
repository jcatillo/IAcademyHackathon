import { useNavigate } from "react-router-dom";
import { hasModelInCache } from "@mlc-ai/web-llm";
import { appConfig, MODEL_ID } from "../lib/engine-config";
import { useEffect, useState } from "react";

export default function BrainSyncPage() {
  const navigate = useNavigate();
  const [modelCached, setModelCached] = useState<boolean | null>(null);
  const [swActive, setSwActive] = useState(false);

  useEffect(() => {
    // Check model cache
    hasModelInCache(MODEL_ID, appConfig)
      .then(setModelCached)
      .catch(() => setModelCached(false));

    // Check SW
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setSwActive(!!reg?.active);
      });
    }
  }, []);

  const isReady = modelCached === true && swActive;
  const modelPercent =
    modelCached === null ? "..." : modelCached ? "100%" : "0%";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-5 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="material-symbols-outlined text-slate-900 dark:text-white text-2xl"
        >
          arrow_back
        </button>
        <h1 className="flex-1 text-center text-base font-bold uppercase tracking-widest text-slate-900 dark:text-white">
          Brain Sync
        </h1>
        <div className="w-6" /> {/* spacer */}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Status card */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 relative">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-4xl">
              {isReady ? "check_circle" : "sync"}
            </span>
            {isReady && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[14px]">
                  bolt
                </span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            {isReady ? "Offline Ready" : "Syncing..."}
          </h2>

          <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isReady ? "Local Tutor Optimized" : "Setting Up Local Tutor"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isReady
                ? "You can now access full AI guidance without an internet connection. Your brain sync is complete."
                : "Please wait while the AI model and app resources are cached to your device..."}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Models
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {modelPercent}
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                modelCached
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
              }`}
            >
              {modelCached ? "Optimized" : "Pending"}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Latency
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              0ms
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Local Mode
            </span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => navigate("/tutor")}
          disabled={!isReady}
          className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-600/20 disabled:shadow-none"
        >
          Start Learning
          <span className="material-symbols-outlined text-xl">
            arrow_forward
          </span>
        </button>

        {/* Version */}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          v2.4.0 · Secure Local Environment
        </p>
      </div>
    </div>
  );
}
