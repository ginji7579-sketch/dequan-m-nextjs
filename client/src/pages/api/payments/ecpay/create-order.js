// pages/api/ecpay/create-order.js
import ecpay from '@/lib/ecpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '僅接受 POST' });
  }

  try {
    const { items, totalAmount } = req.body;
    const merchantTradeNo = `DQ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const params = {
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: new Date().toISOString().replace('T', ' ').split('.')[0],
      PaymentType: 'aio',
      TotalAmount: Math.round(totalAmount),
      TradeDesc: '德全有限公司 - 線上購物',
      ItemName: items.map(item => item.name).join('#'),
      ReturnURL: `${process.env.SITE_URL}/api/ecpay/return`,
      OrderResultURL: `${process.env.SITE_URL}/checkout/result`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    };

    // 產生自動提交的付款表單 HTML
    const html = ecpay.payment_client.aio_check_out_all(params);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('建立訂單失敗:', error);
    res.status(500).json({ error: '建立訂單時發生錯誤' });
  }
}