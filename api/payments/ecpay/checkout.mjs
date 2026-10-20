import { createHash, randomBytes } from 'node:crypto';

const serviceCatalog = new Map([
  ['website-branding', ['形象網站', 42000]],
  ['website-shopping', ['購物網站', 68000]],
  ['website-blog', ['部落格網站', 34000]],
  ['website-onepage', ['一頁式網站', 16000]],
  ['website-special', ['特殊功能網站', 60000]],
  ['website-fixedshop', ['定版式購物網站', 28000]],
  ['enterprise-security', ['企業資安服務', 150000]],
  ['video-production', ['影音製作', null]],
  ['business-card', ['名片設計', null]],
  ['logo-design', ['logo設計', null]],
  ['ad-copy', ['廣告文宣', null]],
  ['press-release', ['新聞稿撰寫', 3000]],
  ['media-geo-maintenance-basic', ['網站社群經營+GEO｜基礎季度維護費', 90000]],
  ['media-geo-maintenance-advanced', ['網站社群經營+GEO｜進階季度維護費', 210000]],
  ['media-geo-setup-basic', ['網站社群經營+GEO｜方案A專案啟動費', 45000]],
  ['media-geo-setup-advanced', ['網站社群經營+GEO｜方案B專案啟動費', 75000]],
  ['press-release-media-1d-1h-otu-pdb-jvx', ['15網聯播新聞稿刊登', 18000]],
  ['press-release-media-kfl-kq6-k34-pcu-otu', ['東森新聞網新聞稿刊登', 24000]],
  ['press-release-media-kfl-kq6-rs1-osz-otu', ['東森財經網新聞稿刊登', 24000]],
  ['press-release-media-lch-r6e-k34-pcu', ['民視新聞新聞稿刊登', 15000]],
  ['press-release-media-ffx-hm6-ny6', ['中央社新聞稿刊登', 9000]],
  ['press-release-media-u5k-fxv-hw2', ['風傳媒新聞稿刊登', 9000]],
  ['press-release-media-o29-jgg-k34-hf5', ['科技新報新聞稿刊登', 15000]],
  ['press-release-media-ttn-i1c-k76-hf5', ['電子時報新聞稿刊登', 15000]],
  ['press-release-media-24-21-26-1x', ['LINE新聞稿刊登', 9000]],
  ['press-release-media-hmv-ju1', ['奇摩新聞稿刊登', 9000]],
  ['press-release-media-ho3-i1c-lz2', ['女子漾新聞稿刊登', 9000]],
  ['press-release-media-lch-njy-k4l-hf5', ['民眾日報新聞稿刊登', 9000]],
  ['press-release-media-na6-i3m-skm', ['痞客邦新聞稿刊登', 9000]],
  ['press-release-media-26-33-3b-32-2t-3b-37', ['Nownews新聞稿刊登', 18000]],
  ['press-release-media-mx2-rs1-go8-g7e', ['理財周刊新聞稿刊登', 9000]],
  ['press-release-media-ijp-gue-k76-hf5', ['工商時報新聞稿刊登', 9000]],
  ['press-release-media-osz-m3j-k4l-hf5', ['經濟日報新聞稿刊登', 9000]],
  ['press-release-media-t7l-ttn-r6e', ['鏡電視新聞稿刊登', 18000]],
  ['press-release-media-lia-lia-mcm-pzd', ['波波焦莉新聞稿刊登', 9000]],
  ['press-release-media-qx8-si5-hm1-fez', ['行遍天下新聞稿刊登', 15000]],
  ['press-release-media-nop-fjc-qjj', ['矩亨號新聞稿刊登', 9000]],
  ['press-release-media-hod-k34-pcu', ['好新聞新聞稿刊登', 15000]],
  ['press-release-media-hkp-qh7', ['壹蘋新聞稿刊登', 9000]],
  ['press-release-media-2c-i3m-skm', ['T客邦新聞稿刊登', 15000]],
  ['press-release-media-ffx-k76-ttn-i1c-hf5', ['中時電子報新聞稿刊登', 12000]],
  ['press-release-media-gad-ktp-i6n-pcq', ['創業小聚新聞稿刊登', 18000]],
  ['press-release-media-1v-2c-2f-1t-26-2c', ['CTWANT新聞稿刊登', 12000]],
  ['press-release-media-oll-fvp-ipj', ['粉健康新聞稿刊登', 15000]],
  ['press-release-media-1y-39-32-19-2v-2p-31-2t', ['Fun-game新聞稿刊登', 15000]],
  ['press-release-media-ju1-k3d-otu', ['摩方網新聞稿刊登', 24000]],
  ['press-release-media-i4s-i3m-id2', ['富客島新聞稿刊登', 15000]],
  ['press-release-media-hx9-hx9-i5y-i5y', ['媽媽寶寶新聞稿刊登', 30000]],
  ['press-release-media-fex-o97-ttn-i1c-hf5', ['三立電子報新聞稿刊登', 30000]],
  ['press-release-media-2c-2e-1u-2b', ['TVBS新聞稿刊登', 45000]],
  ['press-release-media-pnu-n5d-ttn-i1c-hf5', ['自由電子報新聞稿刊登', 45000]],
  ['press-release-media-kfl-kq6-k34-pcu-tte', ['東森新聞雲新聞稿刊登', 45000]],
  ['press-release-media-ffx-hm1-k34-pcu-otu', ['中天新聞網新聞稿刊登', 30000]],
  ['press-release-media-gue-ktp-go8-g7e-otu', ['商業周刊網新聞稿刊登', 150000]],
  ['press-release-media-fs1-fxv-hw2', ['信傳媒新聞稿刊登', 15000]],
  ['press-release-media-ik4-gqw-hqe-mm1', ['巴哈姆特新聞稿刊登', 9000]],
  ['press-release-media-25-33-2q-2x-30-2t-w-1c-1d', ['Mobile 01新聞稿刊登', 9000]],
  ['press-release-media-srv-iln-hod-n4v-lkr', ['醫師好生活新聞稿刊登', 15000]],
  ['press-release-media-mhr-u8a-iln-re2-fvp-ipj', ['營養師說健康新聞稿刊登', 15000]],
  ['press-release-media-fvp-ipj-1x-2i-1z-27', ['健康EZGO新聞稿刊登', 15000]],
  ['press-release-media-fvp-ipj-hod-n4v-lkr', ['健康好生活新聞稿刊登', 15000]],
  ['press-release-media-fvp-ipj-hod-2t-3e', ['健康好ez新聞稿刊登', 15000]],
  ['interview', ['人物專訪', 6000]],
  ['public-relations', ['公關媒體', null]],
  ['integrated-marketing', ['整合行銷', null]],
  ['grant-plan', ['政府補助計畫', null]],
]);

function getEcpayConfig() {
  const merchantId = process.env.ECPAY_MERCHANT_ID || '';
  const hashKey = process.env.ECPAY_HASH_KEY || '';
  const hashIv = process.env.ECPAY_HASH_IV || '';

  if (!merchantId || !hashKey || !hashIv) {
    throw new Error('綠界付款服務尚未設定，請聯絡客服');
  }

  const isProduction = process.env.ECPAY_STAGE === 'false';
  return {
    merchantId,
    hashKey,
    hashIv,
    checkoutUrl:
      process.env.ECPAY_CHECKOUT_URL ||
      (isProduction
        ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
        : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'),
  };
}

function encodeForEcpay(value) {
  return encodeURIComponent(value)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');
}

function createCheckMacValue(fields, config) {
  const sortedEntries = Object.entries(fields)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, 'en'));
  const raw = [
    `HashKey=${config.hashKey}`,
    ...sortedEntries.map(([key, value]) => `${key}=${value}`),
    `HashIV=${config.hashIv}`,
  ].join('&');

  return createHash('sha256').update(encodeForEcpay(raw)).digest('hex').toUpperCase();
}

function formatTradeDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getRequestOrigin(headers) {
  const forwardedProto = Array.isArray(headers['x-forwarded-proto'])
    ? headers['x-forwarded-proto'][0]
    : headers['x-forwarded-proto'];
  const forwardedHost = Array.isArray(headers['x-forwarded-host'])
    ? headers['x-forwarded-host'][0]
    : headers['x-forwarded-host'];
  const host = Array.isArray(headers.host) ? headers.host[0] : headers.host;

  return `${forwardedProto || 'http'}://${forwardedHost || host || 'localhost:3000'}`;
}

function createMerchantTradeNo() {
  return `DQ${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString('hex').toUpperCase()}`.slice(
    0,
    20
  );
}

function createCheckout(body, headers) {
  const config = getEcpayConfig();
  if (!Array.isArray(body?.items) || body.items.length === 0) {
    throw new Error('購物車格式不正確');
  }

  const cartItems = body.items.map((item) => {
    if (!item || typeof item.id !== 'string' || !item.id) {
      throw new Error('購物車項目缺少服務代號');
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error('商品數量不正確');
    }
    if (!serviceCatalog.has(item.id)) {
      throw new Error('購物車包含不存在的服務項目');
    }
    return { id: item.id, quantity };
  });

  const payableItems = cartItems.flatMap(({ id, quantity }) => {
    const [title, price] = serviceCatalog.get(id);
    return price
      ? [{ id, title, quantity, unitPrice: price, subtotal: price * quantity }]
      : [];
  });
  const skippedQuoteItems = cartItems
    .filter(({ id }) => serviceCatalog.get(id)[1] === null)
    .map(({ id }) => id);
  const totalAmount = payableItems.reduce((total, item) => total + item.subtotal, 0);

  if (totalAmount <= 0) {
    throw new Error('購物車內沒有可直接付款的固定價格項目');
  }

  const origin = process.env.PUBLIC_BASE_URL || getRequestOrigin(headers);
  const merchantTradeNo = createMerchantTradeNo();
  const fields = {
    MerchantID: config.merchantId,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: formatTradeDate(new Date()),
    PaymentType: 'aio',
    TotalAmount: String(totalAmount),
    TradeDesc: 'Dequan service order',
    ItemName: payableItems
      .map((item) => `${item.title} x ${item.quantity}`)
      .join('#')
      .slice(0, 400),
    ReturnURL: process.env.ECPAY_RETURN_URL || `${origin}/api/payments/ecpay/return`,
    OrderResultURL:
      process.env.ECPAY_ORDER_RESULT_URL || `${origin}/api/payments/ecpay/result`,
    ClientBackURL: process.env.ECPAY_CLIENT_BACK_URL || origin,
    ChoosePayment: process.env.ECPAY_CHOOSE_PAYMENT || 'ALL',
    EncryptType: '1',
  };

  return {
    action: config.checkoutUrl,
    fields: { ...fields, CheckMacValue: createCheckMacValue(fields, config) },
    merchantTradeNo,
    payableItems,
    skippedQuoteItems,
    totalAmount,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    res.status(200).json(createCheckout(req.body, req.headers));
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(400).json({
      message: error instanceof Error ? error.message : '建立付款單失敗',
    });
  }
}
