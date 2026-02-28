import { usePwaInstall } from "../hooks/usePwaInstall";

export default function ProfilePage() {
  const { isInstalled } = usePwaInstall();
  const isOnline = navigator.onLine;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Profile
        </h1>
      </header>

      <div className="px-5 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
          S
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Student
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The Invisible Schoolhouse
          </p>
        </div>
      </div>

      {/* Status cards */}
      <div className="px-5 mt-6 space-y-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span
            className={`material-symbols-outlined text-2xl ${isOnline ? "text-blue-500" : "text-emerald-500"}`}
          >
            {isOnline ? "wifi" : "wifi_off"}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isOnline ? "Connected to Teacher Hub" : "Offline Mode"}
            </p>
            <p className="text-xs text-slate-500">
              {isOnline
                ? "Syncing available"
                : "Running entirely on your device"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span
            className={`material-symbols-outlined text-2xl ${isInstalled ? "text-emerald-500" : "text-amber-500"}`}
          >
            {isInstalled ? "install_mobile" : "download"}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isInstalled ? "App Installed" : "Not Installed"}
            </p>
            <p className="text-xs text-slate-500">
              {isInstalled
                ? "You can access this offline anytime"
                : "Install for the best offline experience"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-purple-500">
            memory
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              AI Model: Qwen2-0.5B
            </p>
            <p className="text-xs text-slate-500">Running locally via WebGPU</p>
          </div>
        </div>
      </div>

      {/* Version */}
      <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest">
        v2.4.0 · Secure Local Environment
      </p>
    </div>
  );
}
