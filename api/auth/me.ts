// @ts-ignore
import jwt from 'jsonwebtoken';

const OAUTH_SESSION_SECRET = process.env.OAUTH_SESSION_SECRET || 'dev-secret';

type VercelRequest = {
  method: string;
  headers: {
    cookie?: string;
    [key: string]: string | string[] | undefined;
  };
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: any) => void;
  send: (body: string) => void;
  setHeader: (key: string, value: string | string[]) => VercelResponse;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies.session;

  if (!sessionToken) {
    return res.status(200).json({ authenticated: false, user: null });
  }

  try {
    const payload = jwt.verify(sessionToken, OAUTH_SESSION_SECRET) as any;
    const { uid, email, displayName, photoURL } = payload;
    return res.status(200).json({
      authenticated: true,
      user: { uid, email, displayName, photoURL },
    });
  } catch (err) {
    return res.status(200).json({ authenticated: false, user: null });
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