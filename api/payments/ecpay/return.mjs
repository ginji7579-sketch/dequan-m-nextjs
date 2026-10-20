import { createHash } from 'node:crypto';

function verifyCheckMacValue(fields) {
  const hashKey = process.env.ECPAY_HASH_KEY || '';
  const hashIv = process.env.ECPAY_HASH_IV || '';
  if (!hashKey || !hashIv || !fields?.CheckMacValue) return false;

  const raw = [
    `HashKey=${hashKey}`,
    ...Object.entries(fields)
      .filter(([key]) => key !== 'CheckMacValue')
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, 'en'))
      .map(([key, value]) => `${key}=${value}`),
    `HashIV=${hashIv}`,
  ].join('&');
  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');
  const calculated = createHash('sha256').update(encoded).digest('hex').toUpperCase();

  return calculated === fields.CheckMacValue;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }
  if (!verifyCheckMacValue(req.body)) {
    res.status(400).send('Verification failed');
    return;
  }

  res.status(200).send('1|OK');
}
