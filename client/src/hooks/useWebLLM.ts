import { useState, useEffect, useRef, useCallback } from "react";
import {
  CreateWebWorkerMLCEngine,
  hasModelInCache,
  type WebWorkerMLCEngine,
  type InitProgressReport,
} from "@mlc-ai/web-llm";
import { appConfig, MODEL_ID } from "../lib/engine-config";

export interface ProgressInfo {
  percent: number;
  text: string;
}

export interface UseWebLLMReturn {
  engine: WebWorkerMLCEngine | null;
  isLoading: boolean;
  progress: ProgressInfo;
  error: string | null;
  isModelCached: boolean;
}

export function useWebLLM(): UseWebLLMReturn {
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressInfo>({
    percent: 0,
    text: "Initializing...",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModelCached, setIsModelCached] = useState(false);
  const initRef = useRef(false);

  const initProgressCallback = useCallback((report: InitProgressReport) => {
    setProgress({
      percent: Math.round(report.progress * 100),
      text: report.text,
    });
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function init() {
      try {
        // 1. Check WebGPU support
        if (!navigator.gpu) {
          setError(
            "WebGPU is not supported on this device/browser. " +
              "On Android Chrome, try enabling chrome://flags/#enable-unsafe-webgpu",
          );
          setIsLoading(false);
          return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          setError(
            "No WebGPU adapter found. Your device GPU may not be compatible.",
          );
          setIsLoading(false);
          return;
        }

        // 2. Request persistent storage so Android doesn't evict our cache
        if (navigator.storage?.persist) {
          await navigator.storage.persist();
        }

        // 3. Check if model is already cached
        const cached = await hasModelInCache(MODEL_ID, appConfig);
        setIsModelCached(cached);

        if (cached) {
          setProgress({ percent: 0, text: "Loading model from cache..." });
        } else {
          setProgress({
            percent: 0,
            text: "Downloading model from Teacher's Hub...",
          });
        }

        // 4. Create the engine in a Web Worker
        const worker = new Worker(
          new URL("../lib/worker.ts", import.meta.url),
          { type: "module" },
        );

        const mlcEngine = await CreateWebWorkerMLCEngine(worker, MODEL_ID, {
          appConfig,
          initProgressCallback,
        });

        setEngine(mlcEngine);
        setIsModelCached(true);
        setProgress({ percent: 100, text: "Model ready!" });
      } catch (err: any) {
        console.error("WebLLM init failed:", err);
        const msg = err?.message ?? "Failed to initialize the AI model.";

        // If offline and model was supposed to be cached, give a clearer message
        if (!navigator.onLine) {
          setError(
            "You're offline and the AI model isn't fully cached yet. " +
              "Connect to the Teacher's Hub once to download everything, " +
              "then it will work offline.",
          );
        } else {
          setError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [initProgressCallback]);

  return { engine, isLoading, progress, error, isModelCached };
}
