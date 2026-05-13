import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const OAUTH_SESSION_SECRET = process.env.OAUTH_SESSION_SECRET || 'dev-secret';

type VercelRequest = {
  method: string;
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
  send: (body: string) => VercelResponse;
  redirect: (status: number, url: string) => void;
  setHeader: (key: string, value: string | string[]) => VercelResponse;
  end: () => VercelResponse;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return res.status(500).send('Server misconfiguration: missing OAuth credentials');
  }

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    const state = crypto.randomBytes(16).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    // Set state and nonce in cookies
    res.setHeader('Set-Cookie', [
      `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`,
      `oauth_nonce=${nonce}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`,
    ]);

    const oauthClient = new OAuth2Client({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri,
    });

    const authUrl = oauthClient.generateAuthUrl({
      scope: ['openid', 'profile', 'email'],
      access_type: 'offline',
      state,
      nonce,
      prompt: 'select_account',
    });

    return res.redirect(302, authUrl);
  } catch (err) {
    console.error('OAuth authorize error:', err);
    return res.status(500).send('Failed to initiate OAuth');
  }
}