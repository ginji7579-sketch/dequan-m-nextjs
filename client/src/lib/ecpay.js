import EcpayAio from 'node-ecpay-aio';

const isProduction = process.env.NODE_ENV === 'production';

const ecpay = new EcpayAio({
  MerchantID: process.env.ECPAY_MERCHANT_ID,
  HashKey: process.env.ECPAY_HASH_KEY,
  HashIV: process.env.ECPAY_HASH_IV,
  Env: isProduction ? 'Production' : 'Stage',
});

export default ecpay;