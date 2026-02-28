interface GpuCheckProps {
  error: string;
}

export default function GpuCheck({ error }: GpuCheckProps) {
  const isInsecureContext = window.location.protocol === "http:";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-6">
      <div className="max-w-md rounded-2xl bg-red-950/60 border border-red-800 p-8 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-3 text-xl font-bold text-red-300">
          GPU Not Available
        </h1>
        <p className="mb-6 text-sm text-red-200/80 leading-relaxed">{error}</p>

        {isInsecureContext && (
          <div className="mb-4 rounded-lg bg-yellow-950/60 border border-yellow-700 p-4 text-left text-xs text-yellow-200">
            <p className="mb-1 font-semibold text-yellow-300">
              ⚡ Connection is not secure
            </p>
            <p>
              WebGPU requires HTTPS. Make sure you're using{" "}
              <code className="text-yellow-400">https://</code> (not http://).
              Ask your teacher for the correct HTTPS link.
            </p>
          </div>
        )}

        <div className="rounded-lg bg-gray-900/80 p-4 text-left text-xs text-gray-300">
          <p className="mb-2 font-semibold text-gray-100">
            How to fix on Android Chrome:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Make sure you're using the{" "}
              <code className="text-yellow-400">https://</code> link
            </li>
            <li>
              If you see a security warning, tap{" "}
              <code className="text-yellow-400">Advanced → Proceed</code>
            </li>
            <li>
              If still not working, open{" "}
              <code className="text-yellow-400">chrome://flags</code>
            </li>
            <li>
              Search for <code className="text-yellow-400">WebGPU</code> and
              enable it
            </li>
            <li>Restart Chrome</li>
          </ol>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Check Again
        </button>
      </div>
    </div>
  );
}
