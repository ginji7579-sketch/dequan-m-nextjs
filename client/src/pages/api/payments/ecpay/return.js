// pages/api/payments/ecpay/return.js
import ecpay from '@/lib/ecpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('0|Error');
  }

  try {
    const response = req.body;

    // 驗證簽章
    const isValid = ecpay.payment_client.helper.valid(response);
    if (!isValid) {
      console.error('CheckMacValue 驗證失敗');
      return res.status(400).send('0|Error');
    }

    // 付款成功
    if (response.RtnCode === '1') {
      // 在這裡把訂單更新為已付款
      // await updateOrderStatus(response.MerchantTradeNo, 'paid');
      console.log(`✅ 訂單 ${response.MerchantTradeNo} 付款成功`);
    } else {
      console.log(`❌ 訂單 ${response.MerchantTradeNo} 失敗：${response.RtnMsg}`);
    }

    // 一定要回 1|OK
    res.send('1|OK');
  } catch (error) {
    console.error('ReturnURL 處理錯誤', error);
    res.status(500).send('0|Error');
  }
}