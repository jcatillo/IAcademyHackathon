import { useWebLLM } from "./hooks/useWebLLM";
import GpuCheck from "./components/GpuCheck";
import ModelLoader from "./components/ModelLoader";
import ChatPage from "./components/ChatPage";

function App() {
  const { engine, isLoading, progress, error, isModelCached } = useWebLLM();

  // WebGPU or adapter error
  if (error) {
    return <GpuCheck error={error} />;
  }

  // Model is still downloading / loading
  if (isLoading || !engine) {
    return <ModelLoader progress={progress} isModelCached={isModelCached} />;
  }

  // Ready — show chat
  return <ChatPage engine={engine} />;
}

export default App;
