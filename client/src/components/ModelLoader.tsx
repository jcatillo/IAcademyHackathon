import { RefreshCw } from "lucide-react";
import type { ProgressInfo } from "../hooks/useWebLLM";

interface ModelLoaderProps {
  progress: ProgressInfo;
  isModelCached: boolean;
}

export default function ModelLoader({
  progress,
  isModelCached,
}: ModelLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6">
      <div className="w-full max-w-sm space-y-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="text-6xl drop-shadow-sm">🏫</div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">
            The Invisible Schoolhouse
          </h1>
          <p className="text-sm text-text-subtle font-medium leading-relaxed">
            {isModelCached
              ? "Preparing your offline learning experience..."
              : "Syncing the AI model for your first-time use."}
          </p>
        </div>

        {/* Progress System */}
        <div className="space-y-4">
           <div className="relative h-2.5 w-full bg-surface rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(79,70,229,0.3)]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-text-subtle uppercase tracking-widest px-1">
             <span className="flex items-center gap-1.5">
                <RefreshCw size={14} className="animate-spin" />
                {progress.text.split(']')[1] || progress.text}
             </span>
             <span className="text-accent font-mono text-xs">{progress.percent}%</span>
          </div>
        </div>

        {!isModelCached && (
          <div className="card bg-amber-50 border-amber-100 p-4 text-xs text-amber-900/70 font-medium leading-relaxed">
            <span className="text-amber-700 font-bold block mb-1 uppercase tracking-widest text-[9px]">Offline Optimization</span>
            This one-time download (~350MB) enables full AI guidance without internet.
          </div>
        )}

        <footer className="text-[10px] text-border uppercase tracking-[0.3em] pt-8">
           Secure Edge Architecture
        </footer>
      </div>
    </div>
  );
}
