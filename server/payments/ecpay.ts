import "dotenv/config";
import crypto from 'node:crypto';
import { serviceCatalog } from '../../shared/services';

type CheckoutCartItem = {
  id: string;
  quantity: number;
};

type EcpayConfig = {
  merchantId: string;
  hashKey: string;
  hashIv: string;
  checkoutUrl: string;
};

export type EcpayCheckoutResponse = {
  action: string;
  fields: Record<string, string>;
  merchantTradeNo: string;
  payableItems: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  skippedQuoteItems: string[];
  totalAmount: number;
};

function getEcpayConfig(): EcpayConfig {
  // 使用 ECPAY_ENV 控制環境：設為 'stage' 強制測試環境，否則預設正式環境
  const isProduction = process.env.ECPAY_ENV !== 'stage';

  return {
    merchantId: process.env.ECPAY_MERCHANT_ID || '',
    hashKey: process.env.ECPAY_HASH_KEY || '',
    hashIv: process.env.ECPAY_HASH_IV || '',
    checkoutUrl:
      process.env.ECPAY_CHECKOUT_URL ||
      (isProduction
        ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
        : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'),
  };
}

export function verifyCheckMacValue(fields: Record<string, string>) {
  const config = getEcpayConfig();
  if (!fields.CheckMacValue) return false;
  
  const calculated = createCheckMacValue(fields, config);
  return calculated === fields.CheckMacValue;
}

function ecpayEncode(value: string) {
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

function createCheckMacValue(fields: Record<string, string>, config: EcpayConfig) {
  const sortedEntries = Object.entries(fields)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, 'en'));

  const raw = [
    `HashKey=${config.hashKey}`,
    ...sortedEntries.map(([key, value]) => `${key}=${value}`),
    `HashIV=${config.hashIv}`,
  ].join('&');

  return crypto.createHash('sha256').update(ecpayEncode(raw)).digest('hex').toUpperCase();
}

function formatTradeDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    '/',
    pad(date.getMonth() + 1),
    '/',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
    ':',
    pad(date.getSeconds()),
  ].join('');
}

function createMerchantTradeNo() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DQ${timestamp}${random}`.slice(0, 20);
}

function getRequestOrigin(headers: Record<string, string | string[] | undefined>) {
  const forwardedProto = Array.isArray(headers['x-forwarded-proto'])
    ? headers['x-forwarded-proto'][0]
    : headers['x-forwarded-proto'];
  const forwardedHost = Array.isArray(headers['x-forwarded-host'])
    ? headers['x-forwarded-host'][0]
    : headers['x-forwarded-host'];
  const host = Array.isArray(headers.host) ? headers.host[0] : headers.host;
  const protocol = forwardedProto || 'http';

  return `${protocol}://${forwardedHost || host || 'localhost:3000'}`;
}

function normalizeCartItems(items: unknown): CheckoutCartItem[] {
  if (!Array.isArray(items)) {
    throw new Error('購物車格式不正確');
  }

  return items.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error('購物車項目格式不正確');
    }

    const cartItem = item as Partial<CheckoutCartItem>;
    const quantity = Math.max(1, Math.min(Number(cartItem.quantity) || 1, 99));

    if (!cartItem.id || typeof cartItem.id !== 'string') {
      throw new Error('購物車項目缺少服務代號');
    }

    return {
      id: cartItem.id,
      quantity,
    };
  });
}

export function createEcpayCheckout(
  body: unknown,
  headers: Record<string, string | string[] | undefined>
): EcpayCheckoutResponse {
  const config = getEcpayConfig();
  const requestBody = body && typeof body === 'object' ? (body as { items?: unknown }) : {};
  const cartItems = normalizeCartItems(requestBody.items);
  const payableItems = cartItems.flatMap((cartItem) => {
    const service = serviceCatalog.find((item) => item.id === cartItem.id);

    if (!service?.price) {
      return [];
    }

    return [
      {
        id: service.id,
        title: service.title,
        quantity: cartItem.quantity,
        unitPrice: service.price,
        subtotal: service.price * cartItem.quantity,
      },
    ];
  });
  const skippedQuoteItems = cartItems
    .filter((cartItem) => {
      const service = serviceCatalog.find((item) => item.id === cartItem.id);
      return service && !service.price;
    })
    .map((cartItem) => cartItem.id);
  const totalAmount = payableItems.reduce((total, item) => total + item.subtotal, 0);

  if (totalAmount <= 0) {
    throw new Error('購物車內沒有可直接付款的固定價格項目');
  }

  const origin = process.env.PUBLIC_BASE_URL || getRequestOrigin(headers);
  const merchantTradeNo = createMerchantTradeNo();
  const itemName = payableItems
    .map((item) => `${item.title} x ${item.quantity}`)
    .join('#')
    .slice(0, 400);
  const fields: Record<string, string> = {
    MerchantID: config.merchantId,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: formatTradeDate(new Date()),
    PaymentType: 'aio',
    TotalAmount: String(totalAmount),
    TradeDesc: 'Dequan service order',
    ItemName: itemName,
    ReturnURL: process.env.ECPAY_RETURN_URL || `${origin}/api/payments/ecpay/return`,
    OrderResultURL:
      process.env.ECPAY_ORDER_RESULT_URL || `${origin}/api/payments/ecpay/result`,
    ClientBackURL: process.env.ECPAY_CLIENT_BACK_URL || origin,
    ChoosePayment: process.env.ECPAY_CHOOSE_PAYMENT || 'ALL',
    EncryptType: '1',
  };

  return {
    action: config.checkoutUrl,
    fields: {
      ...fields,
      CheckMacValue: createCheckMacValue(fields, config),
    },
    merchantTradeNo,
    payableItems,
    skippedQuoteItems,
    totalAmount,
  };
}