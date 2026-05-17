import EcpayAio from 'node-ecpay-aio';

const ecpay = new EcpayAio({
  MerchantID: process.env.ECPAY_MERCHANT_ID,
  HashKey: process.env.ECPAY_HASH_KEY,
  HashIV: process.env.ECPAY_HASH_IV,
  Env: process.env.ECPAY_ENV === 'production' ? 'Production' : 'Stage',
});

export default ecpay;