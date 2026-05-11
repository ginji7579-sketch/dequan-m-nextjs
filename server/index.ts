import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createEcpayCheckout, verifyCheckMacValue } from "./payments/ecpay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createGoogleOAuthClient(redirectUri: string): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }
  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cookieParser(process.env.OAUTH_SESSION_SECRET || "dev-secret-change-me")
  );

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // =====================
  // OAuth Routes
  // =====================

  // GET /api/oauth/authorize - Initiate Google OAuth flow
  app.get("/api/oauth/authorize", (req, res) => {
    const protocol = req.protocol === "https" || req.secure ? "https" : "http";
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    const state = crypto.randomBytes(16).toString("hex");
    const nonce = crypto.randomBytes(16).toString("hex");

    // Store state & nonce in signed cookies (5 min expiry)
    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
      signed: true,
    });
    res.cookie("oauth_nonce", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
      signed: true,
    });

    try {
      const oauthClient = createGoogleOAuthClient(redirectUri);
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

  // GET /api/oauth/callback - Google redirects here after auth
  app.get("/api/oauth/callback", async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).send("Missing code or state");
    }

    // Verify state from signed cookie
    const stateCookie = req.signedCookies?.oauth_state;
    if (!stateCookie || stateCookie !== state) {
      return res.status(400).send("Invalid state");
    }

    const protocol = req.protocol === "https" || req.secure ? "https" : "http";
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    try {
      const oauthClient = createGoogleOAuthClient(redirectUri);
      const { tokens } = await oauthClient.getToken({
        code: code as string,
        redirectUri,
      });

      const idToken = tokens.id_token;
      if (!idToken) throw new Error("No ID token returned");

      const ticket = await oauthClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) throw new Error("Invalid ID token payload");

      // Verify nonce
      const nonceCookie = req.signedCookies?.oauth_nonce;
      if (!nonceCookie || nonceCookie !== payload.nonce) {
        return res.status(400).send("Invalid nonce");
      }

      // Create a session JWT (7 days)
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

      // Clear OAuth state cookies
      res.clearCookie("oauth_state");
      res.clearCookie("oauth_nonce");

      // Set session cookie
      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      // Respond with HTML that notifies opener and closes itself (popup flow)
      // If not a popup (window.opener absent), it redirects to homepage
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

  // GET /api/auth/me - Return current session user
  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies?.session;
    if (!token) {
      return res.status(401).json({ authenticated: false, user: null });
    }

    try {
      const payload = jwt.verify(token, process.env.OAUTH_SESSION_SECRET || "dev-secret") as any;
      const { uid, email, displayName, photoURL } = payload;
      return res.json({
        authenticated: true,
        user: { uid, email, displayName, photoURL },
      });
    } catch (err) {
      res.clearCookie("session");
      return res.status(401).json({ authenticated: false, user: null });
    }
  });

  // POST /api/auth/logout - Clear session
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("session");
    res.json({ success: true });
  });

  // =====================
  // Payment Routes
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
