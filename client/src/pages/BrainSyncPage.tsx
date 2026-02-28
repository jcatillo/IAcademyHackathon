import { useNavigate } from "react-router-dom";
import { hasModelInCache } from "@mlc-ai/web-llm";
import { ArrowLeft, CheckCircle2, RefreshCw, Zap, ArrowRight } from "lucide-react";
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-surface transition-colors"
        >
          <ArrowLeft size={20} className="text-text" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Brain Sync</h1>
      </header>

      <div className="flex flex-col items-center gap-8 py-4">
        {/* Status card */}
        <div className="w-full max-w-sm card bg-white text-center p-10">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 relative group">
            {isReady ? (
              <CheckCircle2 size={48} className="text-emerald-600" />
            ) : (
              <RefreshCw size={48} className="text-emerald-600 animate-spin" />
            )}
            {isReady && (
              <span className="absolute -top-1 -right-1 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-sm">
                <Zap size={16} fill="currentColor" />
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isReady ? "Offline Ready" : "Syncing Knowledge"}
          </h2>
          <p className="text-sm text-text-subtle leading-relaxed mb-6">
            {isReady
              ? "Your personal tutor is fully synced and ready for offline use. No internet required."
              : "We're downloading the AI models and lesson materials. This may take a minute."}
          </p>

          <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
             <div className={`h-full bg-accent transition-all duration-1000 ${isReady ? "w-full" : "w-[40%] animate-pulse"}`} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          <div className="card p-5 text-center">
            <p className="text-[10px] font-bold text-text-subtle uppercase tracking-widest mb-1">AI Models</p>
            <p className="text-3xl font-bold text-text mb-2">{modelPercent}</p>
            <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full border ${
              modelCached ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
            }`}>
              {modelCached ? "SYNCED" : "PENDING"}
            </span>
          </div>

          <div className="card p-5 text-center">
            <p className="text-[10px] font-bold text-text-subtle uppercase tracking-widest mb-1">Latency</p>
            <p className="text-3xl font-bold text-text mb-2">0ms</p>
            <span className="inline-block px-3 py-1 text-[10px] font-bold rounded-full bg-surface text-text-subtle border border-border">
              LOCAL
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => navigate("/tutor")}
          disabled={!isReady}
          className="btn-accent w-full max-w-sm py-4 text-base flex items-center justify-center gap-3 shadow-lg shadow-accent/20 disabled:shadow-none disabled:bg-border"
        >
          <span>Start Learning</span>
          <ArrowRight size={20} />
        </button>

        <footer className="text-center space-y-2">
           <p className="text-[10px] font-bold text-text-subtle uppercase tracking-[0.2em]">
             Environment Secure · Local Processing
           </p>
           <p className="text-[10px] text-border">Build v2.4.0</p>
        </footer>
      </div>
    </div>
  );
}
