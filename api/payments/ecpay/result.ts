import { verifyCheckMacValue } from './ecpay-logic';

export default async function handler(req: any, res: any) {
  const isValid = verifyCheckMacValue(req.body);
  const rtnCode = String(req.body?.RtnCode || '');
  const isPaid = isValid && rtnCode === '1';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
      <html lang="zh-Hant">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${isPaid ? '付款完成' : '付款結果'}</title>
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
            <h1>${isPaid ? '付款完成' : '已收到付款結果'}</h1>
            <p>${isPaid ? '感謝您的付款，我們將盡快與您確認服務細節。' : '付款結果已回傳，若尚未完成付款可返回網站重新操作。'}</p>
            <a href="/">回到首頁</a>
          </main>
        </body>
      </html>`);
}
