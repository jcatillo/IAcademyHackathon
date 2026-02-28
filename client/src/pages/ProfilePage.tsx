import { Wifi, WifiOff, Smartphone, Download, Cpu } from "lucide-react";
import { usePwaInstall } from "../hooks/usePwaInstall";

export default function ProfilePage() {
  const { isInstalled } = usePwaInstall();
  const isOnline = navigator.onLine;

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </header>

      <section className="flex flex-col items-center gap-6 py-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-bold shadow-md">
          S
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Student Account</h2>
          <p className="text-sm text-text-subtle font-medium">The Invisible Schoolhouse</p>
        </div>
      </section>

      {/* Status cards */}
      <section className="grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
        <div className="card flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isOnline ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
            {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
          </div>
          <div>
            <p className="text-sm font-bold">{isOnline ? "Cloud Connected" : "Local Mode"}</p>
            <p className="text-xs text-text-subtle">
              {isOnline
                ? "Automatic syncing enabled"
                : "Working entirely offline"}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isInstalled ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
            {isInstalled ? <Smartphone size={24} /> : <Download size={24} />}
          </div>
          <div>
            <p className="text-sm font-bold">{isInstalled ? "App Installed" : "Native Web App"}</p>
            <p className="text-xs text-text-subtle">
              {isInstalled
                ? "Accessible via home screen"
                : "Install for the full experience"}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Cpu size={24} />
          </div>
          <div>
            <p className="text-sm font-bold">AI: Qwen2-0.5B</p>
            <p className="text-xs text-text-subtle">0.5 Billion Parameters · WebGPU</p>
          </div>
        </div>
      </section>

      {/* Version */}
      <footer className="pt-8 text-center border-t border-border">
         <p className="text-[10px] font-bold text-text-subtle uppercase tracking-[0.2em]">
           Secure Edge Architecture · v2.4.0
         </p>
      </footer>
    </div>
  );
}
