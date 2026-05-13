// @ts-ignore
import jwt from 'jsonwebtoken';

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
  setHeader: (key: string, value: string | string[]) => void;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Clear session cookie
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
  return res.status(200).json({ success: true });
}