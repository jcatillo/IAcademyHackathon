import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuration ──────────────────────────────────────────────
const HF_MODEL_REPO = "mlc-ai/Qwen2-0.5B-Instruct-q4f16_1-MLC";
const WASM_URL =
  "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm";

const MODELS_DIR = path.join(
  __dirname,
  "..",
  "models",
  "Qwen2-0.5B-Instruct-q4f16_1-MLC",
);
const WASM_DIR = path.join(__dirname, "..", "wasm");

// ── Helpers ────────────────────────────────────────────────────
async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadFile(url: string, dest: string, label: string) {
  if (fs.existsSync(dest)) {
    console.log(`  ✓ ${label} (already exists, skipping)`);
    return;
  }

  process.stdout.write(`  ↓ ${label} ... `);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const contentLength = Number(res.headers.get("content-length") ?? 0);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync(dest, buffer);

  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`${sizeMB} MB`);
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log("");
  console.log("=== Downloading Qwen2-0.5B model for offline serving ===");
  console.log("");

  // 1. Get the file list from the HuggingFace API
  console.log("Fetching file list from HuggingFace...");
  const apiUrl = `https://huggingface.co/api/models/${HF_MODEL_REPO}/tree/main`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch file list: HTTP ${res.status}`);
  }
  const files: Array<{ type: string; path: string; size: number }> =
    (await res.json()) as any;

  // Only download files needed by WebLLM (skip .gitattributes, README, logs)
  const NEEDED_EXTENSIONS = [".json", ".bin", ".txt"];
  const SKIP_FILES = new Set([".gitattributes", "README.md", "logs.txt"]);

  // 2. Download model files
  await ensureDir(MODELS_DIR);
  console.log(`\nDownloading model files to: ${MODELS_DIR}`);

  for (const file of files) {
    const name = file.path;
    if (file.type !== "file") continue;
    if (SKIP_FILES.has(name)) continue;
    if (!NEEDED_EXTENSIONS.some((ext) => name.endsWith(ext))) continue;

    const url = `https://huggingface.co/${HF_MODEL_REPO}/resolve/main/${name}`;
    const dest = path.join(MODELS_DIR, name);
    await downloadFile(url, dest, name);
  }

  // 3. Download WASM library
  await ensureDir(WASM_DIR);
  console.log(`\nDownloading WASM library to: ${WASM_DIR}`);

  const wasmFilename = "Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm";
  await downloadFile(WASM_URL, path.join(WASM_DIR, wasmFilename), wasmFilename);

  console.log("\n=== Download complete! ===");
  console.log("You can now run the server with: npm run start");
  console.log("");
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
