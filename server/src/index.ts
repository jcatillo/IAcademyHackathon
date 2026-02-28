import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import selfsigned from "selfsigned";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Enable CORS for all origins (needed for Vite dev server on different port)
app.use(cors());

// Serve model weights — WebLLM appends /resolve/main/ to model URLs,
// so we mount the static files at that full path.
app.use(
  "/models/Qwen2-0.5B-Instruct-q4f16_1-MLC/resolve/main",
  express.static(
    path.join(__dirname, "..", "models", "Qwen2-0.5B-Instruct-q4f16_1-MLC"),
    {
      acceptRanges: true,
      maxAge: "7d",
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Expose-Headers",
          "Content-Length, Content-Range",
        );
      },
    },
  ),
);

// Serve WASM model library
app.use(
  "/wasm",
  express.static(path.join(__dirname, "..", "wasm"), {
    acceptRanges: true,
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/wasm");
    },
  }),
);

// Serve the built React client (production)
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

// SPA fallback — serve index.html for any non-API route
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Get the LAN IP address to display for students
function getLanIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (!iface.internal && iface.family === "IPv4") {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Generate a self-signed certificate for HTTPS.
// WebGPU requires a "secure context" — plain HTTP on a LAN IP won't expose
// navigator.gpu. HTTPS (even self-signed) solves this. Students just click
// through the one-time browser warning.
async function startServer() {
  const lanIP = getLanIP();
  const attrs = [{ name: "commonName", value: "InvisibleSchoolhouse" }];
  const pems = await selfsigned.generate(attrs, {
    keySize: 2048,
    algorithm: "sha256",
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
          { type: 7, ip: lanIP },
        ],
      },
    ],
  });

  const httpsServer = https.createServer(
    { key: pems.private, cert: pems.cert },
    app,
  );

  httpsServer.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("===========================================");
    console.log("  The Invisible Schoolhouse — Teacher Hub");
    console.log("===========================================");
    console.log(`  Local:   https://localhost:${PORT}`);
    console.log(`  Network: https://${lanIP}:${PORT}`);
    console.log("");
    console.log("  Share the Network URL with your students!");
    console.log("  (They will see a security warning once —");
    console.log("   tap 'Advanced' → 'Proceed' to continue)");
    console.log("===========================================");
    console.log("");
  });

  // Also listen on HTTP port 80 and redirect to HTTPS.
  // This way students can just type the IP in the browser bar
  // without needing to remember "https://".
  const httpRedirect = http.createServer((req, res) => {
    const host = req.headers.host?.replace(/:.*/, "") ?? lanIP;
    res.writeHead(301, { Location: `https://${host}:${PORT}${req.url}` });
    res.end();
  });

  httpRedirect.listen(80, "0.0.0.0", () => {
    console.log("  HTTP → HTTPS redirect active on port 80");
    console.log(`  Students can simply visit: http://${lanIP}`);
    console.log("");
  });
}

startServer();
