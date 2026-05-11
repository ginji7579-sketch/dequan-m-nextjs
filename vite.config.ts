import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import type { IncomingMessage } from "node:http";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { createEcpayCheckout } from "./server/payments/ecpay";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

function readJsonBody(req: IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function vitePluginPaymentApi(): Plugin {
  return {
    name: "payment-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/payments/ecpay/checkout", async (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const payload = createEcpayCheckout(body, req.headers);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(payload));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: error instanceof Error ? error.message : "建立付款單失敗",
            })
          );
        }
      });
    },
  };
}

function vitePluginOAuthApi(): Plugin {
  return {
    name: "oauth-api",
    configureServer(server: ViteDevServer) {
      // Cookie parser for signed cookies
      server.middlewares.use(
        cookieParser(process.env.OAUTH_SESSION_SECRET || "dev-secret-change-me")
      );

      // GET /api/oauth/authorize - initiate OAuth
      server.middlewares.use("/api/oauth/authorize", (req, res, next) => {
        if (req.method !== "GET") return next();

        const protocol = (req as any).protocol === "https" || (req as any).secure ? "https" : "http";
        const host = (req as any).headers.host;
        const redirectUri = `${protocol}://${host}/api/oauth/callback`;

        const state = crypto.randomBytes(16).toString("hex");
        const nonce = crypto.randomBytes(16).toString("hex");

        // Set state and nonce in signed cookies
        res.cookie("oauth_state", state, {
          httpOnly: true,
          secure: false, // dev only
          sameSite: "lax" as const,
          maxAge: 5 * 60 * 1000,
          signed: true,
        });
        res.cookie("oauth_nonce", nonce, {
          httpOnly: true,
          secure: false,
          sameSite: "lax" as const,
          maxAge: 5 * 60 * 1000,
          signed: true,
        });

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
          console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
          res.status(500).send("Server misconfiguration: missing OAuth credentials");
          return;
        }

        try {
          const oauthClient = new OAuth2Client({
            clientId,
            clientSecret,
            redirectUri,
          });

          const authUrl = oauthClient.generateAuthUrl({
            scope: ["openid", "profile", "email"],
            access_type: "offline",
            state,
            nonce,
            prompt: "select_account",
          });

          res.redirect(authUrl);
        } catch (err) {
          console.error("OAuth authorize error:", err);
          res.status(500).send("Failed to initiate OAuth");
        }
      });

      // GET /api/oauth/callback - Google redirects here
      server.middlewares.use("/api/oauth/callback", async (req, res, next) => {
        if (req.method !== "GET") return next();

        const query = (req as any).query as any;
        const { code, state } = query;
        if (!code || !state) {
          return res.status(400).send("Missing code or state");
        }

        const signedCookies = (req as any).signedCookies as any;
        const stateCookie = signedCookies?.oauth_state;
        if (!stateCookie || stateCookie !== state) {
          return res.status(400).send("Invalid state");
        }

        const protocol = (req as any).protocol === "https" || (req as any).secure ? "https" : "http";
        const host = (req as any).headers.host;
        const redirectUri = `${protocol}://${host}/api/oauth/callback`;

        try {
          const clientId = process.env.GOOGLE_CLIENT_ID;
          const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
          if (!clientId || !clientSecret) {
            throw new Error("Missing OAuth credentials");
          }
          const oauthClient = new OAuth2Client({
            clientId,
            clientSecret,
            redirectUri,
          });

          const { tokens } = await oauthClient.getToken({
            code,
            redirectUri,
          });

          const idToken = tokens.id_token;
          if (!idToken) throw new Error("No ID token returned");

          const ticket = await oauthClient.verifyIdToken({
            idToken,
            audience: clientId,
          });
          const payload = ticket.getPayload();

          if (!payload) throw new Error("Invalid ID token payload");

          const nonceCookie = signedCookies?.oauth_nonce;
          if (!nonceCookie || nonceCookie !== payload.nonce) {
            return res.status(400).send("Invalid nonce");
          }

          // Create session JWT
          const sessionToken = jwt.sign(
            {
              uid: payload.sub,
              email: payload.email,
              displayName: payload.name,
              photoURL: payload.picture,
            },
            process.env.OAUTH_SESSION_SECRET || "dev-secret",
            { expiresIn: "7d" }
          );

          // Clear OAuth cookies
          res.clearCookie("oauth_state");
          res.clearCookie("oauth_nonce");

          // Set session cookie
          res.cookie("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // Success response
          const html = `<!DOCTYPE html>
<html><head><title>登入</title></head>
<body>
<p>登入處理中...</p>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'oauth-success' }, '*');
    setTimeout(() => window.close(), 300);
  } else {
    window.location.href = '/?oauth=success';
  }
</script>
</body></html>`;
          res.type("html").send(html);
        } catch (err) {
          console.error("OAuth callback error:", err);
          const html = `<!DOCTYPE html>
<html><head><title>登入失敗</title></head>
<body>
<p>登入失敗，請關閉視窗後再試。</p>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'oauth-error', error: '${err}' }, '*');
  }
  setTimeout(() => window.close(), 2000);
</script>
</body></html>`;
          res.type("html").send(html);
        }
      });

      // GET /api/auth/me
      server.middlewares.use("/api/auth/me", (req: any, res: any) => {
        if (req.method !== "GET") {
          res.status(405).send("Method Not Allowed");
          return;
        }

        const token = req.cookies?.session;
        if (!token) {
          return res.status(401).json({ authenticated: false, user: null });
        }

        try {
          const payload = jwt.verify(token, process.env.OAUTH_SESSION_SECRET || "dev-secret") as any;
          const { uid, email, displayName, photoURL } = payload;
          res.json({
            authenticated: true,
            user: { uid, email, displayName, photoURL },
          });
        } catch (err) {
          res.clearCookie("session");
          return res.status(401).json({ authenticated: false, user: null });
        }
      });

      // POST /api/auth/logout
      server.middlewares.use("/api/auth/logout", (req: any, res: any) => {
        if (req.method !== "POST") {
          res.status(405).send("Method Not Allowed");
          return;
        }
        res.clearCookie("session");
        res.json({ success: true });
      });
    },
  };
}

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
  vitePluginPaymentApi(),
  vitePluginOAuthApi(),
  vitePluginManusDebugCollector(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // UI 組件庫分割
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
          lucide: ["lucide-react"],
          // 頁面組件分割
          admin: ["@/pages/Admin"],
          auth: ["@/pages/Login", "@/pages/Register"],
          // 第三方庫分割
          firebase: ["firebase/app", "firebase/auth"],
        },
      },
    },
    // 增加 chunk 大小限制警告
    chunkSizeWarningLimit: 1000,
    // 產生 source map 用於調試
    sourcemap: false,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
