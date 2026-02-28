import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useWebLLM } from "./hooks/useWebLLM";
import GpuCheck from "./components/GpuCheck";
import ModelLoader from "./components/ModelLoader";
import InstallPrompt from "./components/InstallPrompt";
import BottomNav from "./components/BottomNav";
import ChatPage from "./components/ChatPage";
import HomePage from "./pages/HomePage";
import LessonsPage from "./pages/LessonsPage";
import BrainSyncPage from "./pages/BrainSyncPage";
import ProfilePage from "./pages/ProfilePage";

function AppShell() {
  const { engine, isLoading, progress, error, isModelCached } = useWebLLM();
  const [installDone, setInstallDone] = useState(
    () => localStorage.getItem("invisible-schoolhouse-installed") === "true",
  );

  // WebGPU or adapter error
  if (error) {
    return <GpuCheck error={error} />;
  }

  // Model is still downloading / loading
  if (isLoading || !engine) {
    return <ModelLoader progress={progress} isModelCached={isModelCached} />;
  }

  // Model loaded — show install prompt (once)
  if (!installDone) {
    return <InstallPrompt onDone={() => setInstallDone(true)} />;
  }

  // Ready — full app with routing
  return (
    <div className="min-h-screen bg-primary text-text overflow-x-hidden">
      <div className="container-responsive pb-20 pt-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/tutor" element={<ChatPage engine={engine} />} />
          <Route path="/brain-sync" element={<BrainSyncPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
