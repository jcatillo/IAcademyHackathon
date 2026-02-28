import type { AppConfig } from "@mlc-ai/web-llm";

// Dynamically resolve to whichever server we loaded the page from.
// On the hotspot this will be http://192.168.x.x:8080.
// During dev it will be http://localhost:5173 (proxied by Vite).
const ORIGIN = window.location.origin;

export const MODEL_ID = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

export const appConfig: AppConfig = {
  useIndexedDBCache: true, // Persist in IndexedDB for full offline use
  model_list: [
    {
      model: `${ORIGIN}/models/Qwen2-0.5B-Instruct-q4f16_1-MLC/resolve/main/`,
      model_id: MODEL_ID,
      model_lib: `${ORIGIN}/wasm/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm`,
      vram_required_MB: 944.62,
      low_resource_required: true,
      overrides: {
        context_window_size: 4096,
      },
    },
  ],
};

export const SYSTEM_PROMPT = `You are an Offline SLM Tutor running entirely on this student's device.
You were synced from the Teacher's Hub via a Local Wi-Fi network.
There is no internet connection.

Your teaching method is SOCRATIC:
- Never give the answer directly.
- Ask guiding questions and give small hints.
- Celebrate correct steps and gently redirect mistakes.
- Stay concise (2-3 sentences per reply).
- Focus on math and reading comprehension.`;
