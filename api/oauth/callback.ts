import { OAuth2Client } from 'google-auth-library';
// @ts-ignore
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const OAUTH_SESSION_SECRET = process.env.OAUTH_SESSION_SECRET || 'dev-secret';

type VercelRequest = {
  method: string;
  query: Record<string, string | string[]>;
  headers: {
    cookie?: string;
    host?: string;
    'x-forwarded-proto'?: string;
    'x-forwarded-host'?: string;
    [key: string]: string | string[] | undefined;
  };
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  send: (body: string) => void;
  redirect: (status: number, url: string) => void;
  setHeader: (key: string, value: string | string[]) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  if (!code || !state) {
    return res.status(400).send('Missing code or state');
  }

  // Read oauth_state from cookie
  const cookies = parseCookies(req.headers.cookie || '');
  const stateCookie = cookies.oauth_state;
  if (!stateCookie || stateCookie !== state) {
    return res.status(400).send('Invalid state parameter');
  }

  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Missing OAuth credentials');
    }

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    const oauthClient = new OAuth2Client({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri,
    });

    const { tokens } = await oauthClient.getToken(code);

    const idToken = tokens.id_token;
    if (!idToken) throw new Error('No ID token returned');

    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid ID token payload');

    // Verify nonce
    const nonceCookie = cookies.oauth_nonce;
    if (!nonceCookie || nonceCookie !== payload.nonce) {
      return res.status(400).send('Invalid nonce');
    }

    // Create session JWT
    const sessionToken = jwt.sign(
      {
        uid: payload.sub,
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
      },
      OAUTH_SESSION_SECRET,
      { expiresIn: '7d' }
    );

    // Clear OAuth cookies and set session cookie
    const setCookieHeaders = [
      'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
      'oauth_nonce=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
      `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    ];
    res.setHeader('Set-Cookie', setCookieHeaders);

    // Send success HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>登入成功</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #FAFAFA; color: #2C3E50; }
    .card { text-align: center; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .spinner { width: 40px; height: 40px; border: 3px solid #E8E6E1; border-top-color: #2B8A8A; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { margin: 0; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <p>登入成功，正在跳轉...</p>
  </div>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'oauth-success' }, '*');
        setTimeout(function() { window.close(); }, 300);
      } else {
        window.location.href = '/';
      }
    } catch(e) {
      window.location.href = '/';
    }
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err: any) {
    console.error('OAuth callback error:', err.message || err);
    const errorHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>登入失敗</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #FAFAFA; color: #2C3E50; }
    .card { text-align: center; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h2 { margin: 0 0 8px; font-size: 18px; color: #E74C3C; }
    p { margin: 0 0 16px; font-size: 14px; color: #666; }
    a { display: inline-block; padding: 10px 24px; background: #2B8A8A; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>😞 登入失敗</h2>
    <p>請關閉此視窗後重試</p>
    <a href="/login">回到登入頁</a>
  </div>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'oauth-error', error: '${(err.message || 'Unknown error').replace(/'/g, "\\'").replace(/</g, '<')}' }, '*');
      }
    } catch(e) {}
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(errorHtml);
  }
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  cookieHeader.split(';').forEach((pair) => {
    const parts = pair.trim().split('=');
    if (parts.length >= 2) {
      result[parts[0]] = parts.slice(1).join('=');
    }
  });
  return result;
}