import { verifyCheckMacValue } from './ecpay-logic';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  if (!verifyCheckMacValue(req.body)) {
    return res.status(400).send('Verification failed');
  }

  // 綠界 Server-to-Server 回傳，需回覆 1|OK
  res.status(200).send('1|OK');
}
