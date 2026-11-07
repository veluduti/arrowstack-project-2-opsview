import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOTS_DIR = path.resolve("./screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function waitForServer(url, timeoutMs = 25000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            setTimeout(check, 500);
          }
        })
        .on("error", () => {
          if (Date.now() - startTime > timeoutMs) {
            reject(new Error("Server timeout"));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

const targets = [
  { name: "overview-dashboard.png", path: "/", width: 1440, height: 900 },
  { name: "analytics-page.png", path: "/analytics", width: 1440, height: 900 },
  { name: "orders-page.png", path: "/orders", width: 1440, height: 900 },
  { name: "customers-page.png", path: "/customers", width: 1440, height: 900 },
  { name: "alerts-page.png", path: "/alerts", width: 1440, height: 900 },
  { name: "reports-page.png", path: "/reports", width: 1440, height: 900 },
  { name: "mobile-dashboard.png", path: "/", width: 375, height: 812 },
  { name: "mobile-orders.png", path: "/orders", width: 375, height: 812 },
];

async function main() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  server.stdout.on("data", (d) => console.log(`[Next.js stdout]: ${d}`));
  server.stderr.on("data", (d) => console.error(`[Next.js stderr]: ${d}`));

  try {
    console.log(`Waiting for ${BASE_URL} to be ready...`);
    await waitForServer(BASE_URL);
    console.log("Server is live! Capturing genuine screenshots...");

    // Wait 2 extra seconds for full hydration
    await new Promise((r) => setTimeout(r, 2000));

    for (const target of targets) {
      const outputPath = path.join(SCREENSHOTS_DIR, target.name);
      const url = `${BASE_URL}${target.path}`;
      console.log(`Capturing ${target.name} (${target.width}x${target.height}) from ${url}...`);

      const cmd = `"${BROWSER_PATH}" --headless=new --disable-gpu --hide-scrollbars --window-size=${target.width},${target.height} --screenshot="${outputPath}" "${url}"`;
      execSync(cmd, { stdio: "ignore" });

      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`✓ Saved ${target.name} (${(stats.size / 1024).toFixed(1)} KB)`);
      } else {
        console.warn(`⚠ Failed to save ${target.name}`);
      }
    }
    console.log("All screenshots successfully captured!");
  } finally {
    console.log("Terminating server...");
    // Kill the server process tree on Windows
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
    } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

