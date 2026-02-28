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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="text-5xl">🏫</div>
        <h1 className="text-2xl font-bold text-white">
          The Invisible Schoolhouse
        </h1>
        <p className="text-sm text-gray-400">
          {isModelCached
            ? "Loading AI model from device cache..."
            : "Downloading AI model from Teacher's Hub..."}
        </p>

        {/* Progress bar */}
        <div className="overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-3 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 font-mono">
          {progress.percent}% — {progress.text}
        </p>

        {!isModelCached && (
          <p className="text-xs text-yellow-500/70">
            First-time download (~350 MB). After this, the model works fully
            offline.
          </p>
        )}
      </div>
    </div>
  );
}
