export type PricingPlanId =
  | 'branding'
  | 'shopping'
  | 'blog'
  | 'onepage'
  | 'special'
  | 'fixedshop';

export type PricingPlan = {
  id: PricingPlanId;
  titleKey: string;
  serviceId: string;
  price: number;
  priceFrom?: boolean;
  priceNote: string;
  cta: string;
  features: string[];
  accentFrom: string;
  accentTo: string;
  glowColor: string;
};

export const pricingPlans: Record<PricingPlanId, PricingPlan> = {
  branding: {
    id: 'branding',
    titleKey: 'website.branding',
    serviceId: 'website-branding',
    price: 42000,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '精緻頁面排版（共5頁）',
      '響應式效果（電腦＋手機＋平板）',
      '可崁入 YouTube 影音',
      '基本關鍵字 SEO 優化',
      'Google／Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
    ],
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  shopping: {
    id: 'shopping',
    titleKey: 'website.shopping',
    serviceId: 'website-shopping',
    price: 68000,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '精緻頁面排版',
      '響應式效果（電腦＋手機＋平板）',
      '可崁入 YouTube 影音',
      '基本關鍵字 SEO 優化',
      'Google／Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
      '商品上架管理',
      '金流物流串接',
      '庫存管理',
      '促銷優惠券',
      '訂單管理',
      '銷售報表',
    ],
    accentFrom: '#1a6b3a',
    accentTo: '#2B8A8A',
    glowColor: '#1a6b3a',
  },
  blog: {
    id: 'blog',
    titleKey: 'website.blog',
    serviceId: 'website-blog',
    price: 34000,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '精緻首頁排版',
      '響應式效果（電腦＋手機＋平板）',
      '可崁入 YouTube 影音',
      '基本關鍵字 SEO 優化',
      'Google／Yahoo 搜尋登錄',
      '社群分享功能',
      '熱門點閱排行',
      '自動每日備份',
    ],
    accentFrom: '#6B21A8',
    accentTo: '#A855F7',
    glowColor: '#6B21A8',
  },
  onepage: {
    id: 'onepage',
    titleKey: 'website.onepage',
    serviceId: 'website-onepage',
    price: 16000,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '精緻首頁排版',
      '響應式效果（電腦＋手機＋平板）',
      '可崁入 YouTube 影音',
      '基本關鍵字 SEO 優化',
      'Google／Yahoo 搜尋登錄',
      '結合 FB 粉絲頁',
      '結合 Line 加好友',
      '結合 Google 地圖',
      '線上聯絡表單',
      '自動每日備份',
    ],
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  special: {
    id: 'special',
    titleKey: 'website.special',
    serviceId: 'website-special',
    price: 60000,
    priceFrom: true,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '類型 1：課程銷售網站',
      '類型 2：房仲物件網站',
      '類型 3：聯盟推薦行銷功能',
      '類型 4：讓會員上刊資料之網站',
      '類型 5：訂房、預約功能之網站',
      '類型 6：具客戶專區功能之網站',
      '類型 7：公司內部網站（對外不公開）',
      '類型 8：多國語系之網站',
    ],
    accentFrom: '#B45309',
    accentTo: '#F59E0B',
    glowColor: '#B45309',
  },
  fixedshop: {
    id: 'fixedshop',
    titleKey: 'website.fixedshop',
    serviceId: 'website-fixedshop',
    price: 28000,
    priceNote: '一次性費用',
    cta: '請求報價',
    features: [
      '精緻頁面排版',
      '響應式效果（電腦＋手機＋平板）',
      '可崁入 YouTube 影音',
      '基本關鍵字 SEO 優化',
      'Google／Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
      '商品上架管理',
      '金流物流串接',
      '庫存管理',
      '促銷優惠券',
      '訂單管理',
      '銷售報表',
      '最新消息功能',
      '部落格功能',
      '附操作影片',
    ],
    accentFrom: '#0F766E',
    accentTo: '#2DD4BF',
    glowColor: '#0F766E',
  },
};
