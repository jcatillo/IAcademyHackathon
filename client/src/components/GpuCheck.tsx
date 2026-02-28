import { Unlock } from "lucide-react";

interface GpuCheckProps {
  error: string;
}

export default function GpuCheck({ error }: GpuCheckProps) {
  const isInsecureContext = window.location.protocol === "http:";

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6">
      <div className="max-w-md w-full card border-red-100 bg-red-50/30 p-10 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-3 text-2xl font-bold text-red-700">
          GPU Not Available
        </h1>
        <p className="mb-8 text-sm text-red-900/70 leading-relaxed">{error}</p>

        {isInsecureContext && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-100 p-5 text-left text-xs text-amber-900">
            <p className="mb-2 font-bold text-amber-800 flex items-center gap-2">
              <Unlock size={14} />
              Insecure Connection
            </p>
            <p className="opacity-80">
              WebGPU requires a secure context (HTTPS). Please ensure you are using{" "}
              <code className="bg-white px-1 rounded font-bold text-amber-700">https://</code>.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-border p-6 text-left text-xs space-y-4 shadow-sm">
          <p className="font-bold text-text uppercase tracking-widest text-[10px]">
            Troubleshooting Guide
          </p>
          <ol className="list-decimal list-inside space-y-2 text-text-subtle font-medium">
            <li>Check your <code className="text-accent font-bold">https://</code> connection</li>
            <li>Proceed through any security warnings</li>
            <li>Enable <code className="text-accent font-bold">WebGPU</code> in <code className="bg-surface px-1 rounded">chrome://flags</code></li>
            <li>Restart your browser entirely</li>
          </ol>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="btn-accent w-full mt-8 py-4 shadow-lg shadow-accent/10"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
