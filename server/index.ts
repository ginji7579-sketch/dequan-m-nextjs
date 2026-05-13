import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createEcpayCheckout, verifyCheckMacValue } from "./payments/ecpay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Content Security Policy (CSP)
   *
   * Strict policy tuned for the app's actual external resources:
   *
   *  default-src 'self'                    – base fallback
   *  script-src 'self' 'unsafe-inline'     – React DevTools, runtime chunks,
   *                                          Analytics inline script
   *  style-src 'self' 'unsafe-inline'      – Tailwind, shadcn/ui inline styles,
   *                                          Google Fonts stylesheet
   *  img-src 'self' data: blob:            – same-origin + inline images +
   *    https://d2xsxph8kpxj0f.cloudfront.net  – CDN product images / hero
   *    https://*.googleapis.com               – Google Maps marker icons
   *    https://*.gstatic.com                  – Google-hosted static assets
   *    https://forge.butterfly-effect.dev     – Maps proxy for tiles
   *  font-src 'self' https://fonts.gstatic.com – Google Fonts WOFF2 files
   *  connect-src 'self'                       – API calls (payments, auth)
   *    https://dequan-m.firebaseapp.com       – Firebase Auth endpoints
   *    https://identitytoolkit.googleapis.com  – Firebase Auth REST helpers
   *    https://securetoken.googleapis.com      – Firebase token refresh
   *    https://firestore.googleapis.com        – Firestore (if used later)
   *    https://www.googleapis.com              – Google OAuth token exchange
   *    https://forge.butterfly-effect.dev      – Maps proxy / tiles proxy
   *    https://*.ecpay.com.tw                  – Ecpay payment callback
   *    wss://localhost:3000                    – Vite HMR (dev only; harmless in prod)
   *  frame-src 'self'                         – allow same-origin popups
   *    https://dequan-m.firebaseapp.com       – Firebase Auth popup
   *  manifest-src 'self'
   *  base-uri 'self'
   *  form-action 'self' https://*.ecpay.com.tw – Ecpay payment form POST
   *  object-src 'none'
   */
  const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://d2xsxph8kpxj0f.cloudfront.net https://*.googleapis.com https://*.gstatic.com https://forge.butterfly-effect.dev",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://dequan-m.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://forge.butterfly-effect.dev https://*.ecpay.com.tw wss://localhost:3000",
    "frame-src 'self' https://dequan-m.firebaseapp.com",
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://*.ecpay.com.tw",
    "object-src 'none'",
  ].join("; ");

  // Security headers (including CSP)
  app.use((_req, res, next) => {
    res.setHeader("Content-Security-Policy", CSP);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // =====================
  // Payment Routes (Ecpay)
  // =====================

  app.post("/api/payments/ecpay/checkout", (req, res) => {
    try {
      res.json(createEcpayCheckout(req.body, req.headers));
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "建立付款單失敗",
      });
    }
  });

  app.post("/api/payments/ecpay/return", (req, res) => {
    if (!verifyCheckMacValue(req.body)) {
      console.error("Ecpay return verification failed");
      return res.status(400).send("Verification failed");
    }
    res.type("text/plain").send("1|OK");
  });

  app.post("/api/payments/ecpay/result", (req, res) => {
    const isValid = verifyCheckMacValue(req.body);
    const rtnCode = String(req.body?.RtnCode || "");
    const isPaid = isValid && rtnCode === "1";

    res.type("html").send(`<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${isPaid ? "付款完成" : "付款結果"}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #F5F1E8; color: #2C3E50; }
    main { width: min(92vw, 440px); border: 1px solid #E8E6E1; border-radius: 12px; background: white; padding: 32px; box-shadow: 0 12px 36px rgba(44, 62, 80, 0.12); }
    h1 { margin: 0 0 12px; font-size: 28px; }
    p { line-height: 1.7; color: rgba(44, 62, 80, 0.72); }
    a { display: inline-flex; margin-top: 16px; border-radius: 8px; background: #2B8A8A; color: white; padding: 12px 18px; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>${isPaid ? "付款完成" : "已收到付款結果"}</h1>
    <p>${isPaid ? "感謝您的付款，我們將盡快與您確認服務細節。" : "付款結果已回傳，若尚未完成付款可返回網站重新操作。"}</p>
    <a href="/">回到首頁</a>
  </main>
</body>
</html>`);
  });

  // =====================
  // Static Files & SPA Fallback
  // =====================

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // All other routes serve index.html (SPA)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);