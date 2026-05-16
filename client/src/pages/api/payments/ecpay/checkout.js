// pages/api/payments/ecpay/checkout.js
import ecpay from '@/lib/ecpay'; // 請看下一段 ecpay.js

// 這支 API 只接受 POST
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '僅接受 POST' });
  }

  try {
    const { items, recipient } = req.body;

    // 1. 根據 id 查資料庫（這裡先用模擬資料代替，請換成你自己的查詢）
    //    要拿到商品名稱、單價，並計算總金額
    const productMap = {
      // 範例，你應該從資料庫查
      "1": { name: "德全精選茶葉", price: 300 },
      "2": { name: "德全手工餅乾", price: 200 },
    };

    let itemNames = [];
    let totalAmount = 0;
    for (const cartItem of items) {
      const product = productMap[cartItem.id]; // 改成你的 DB 查詢
      if (!product) {
        return res.status(400).json({ message: `商品 id ${cartItem.id} 不存在` });
      }
      itemNames.push(`${product.name} x${cartItem.quantity}`);
      totalAmount += product.price * cartItem.quantity;
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ message: '無效的訂單金額' });
    }

    // 2. 產生唯一訂單編號
    const merchantTradeNo = `DQ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 3. 準備綠界參數
    const params = {
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: new Date().toISOString().replace('T', ' ').split('.')[0],
      PaymentType: 'aio',
      TotalAmount: totalAmount,
      TradeDesc: '德全有限公司 - 線上購物',
      ItemName: itemNames.join('#'),
      ReturnURL: `${process.env.SITE_URL}/api/payments/ecpay/return`,
      OrderResultURL: `${process.env.SITE_URL}/checkout/result`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
      // 如果你需要把收件人資訊傳給綠界物流（非必要）
      // ReceiverName: recipient.name,
      // ReceiverPhone: recipient.phone,
      // ReceiverAddress: recipient.address,
    };

    // 4. 取得表單 action 與參數（含 CheckMacValue）
    const formInfo = ecpay.payment_client.aio_check_out_all(params, true);
    // 第二參數設 true 會回傳 { action, fields }，而不是 HTML 字串

    // 5. 把訂單編號存進資料庫（狀態 pending）
    //    await saveOrder({ merchantTradeNo, items, totalAmount, recipient, status: 'pending' });

    return res.status(200).json({
      action: formInfo.action,
      fields: formInfo.fields,
    });
  } catch (error) {
    console.error('建立綠界訂單失敗', error);
    return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
  }
}