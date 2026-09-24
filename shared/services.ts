import { pressReleaseMediaServices } from './pressReleaseMedia';

export type ServiceCatalogItem = {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price?: number;
  priceFrom?: boolean;
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: 'website-branding',
    title: '形象網站',
    titleEn: 'Branding Website',
    description: '一次性費用，5 頁客製化形象網站',
    descriptionEn: 'One-time fee for a custom 5-page branding website',
    price: 42000,
  },
  {
    id: 'website-shopping',
    title: '購物網站',
    titleEn: 'E-commerce Website',
    description: '一次性費用，含購物車、金流與物流串接',
    descriptionEn: 'One-time fee with cart, payment, and shipping integration',
    price: 68000,
  },
  {
    id: 'website-blog',
    title: '部落格網站',
    titleEn: 'Blog Website',
    description: '一次性費用，精緻部落格網站',
    descriptionEn: 'One-time fee for a professional blog website',
    price: 34000,
  },
  {
    id: 'website-onepage',
    title: '一頁式網站',
    titleEn: 'One-page Website',
    description: '一次性費用，單頁產品或服務網站',
    descriptionEn: 'One-time fee for a single-page product or service website',
    price: 16000,
  },
  {
    id: 'website-special',
    title: '特殊功能網站',
    titleEn: 'Custom Feature Website',
    description: '一次性費用，$60,000 起，依需求討論報價',
    descriptionEn: 'One-time fee from $60,000, quoted by requirements',
    price: 60000,
    priceFrom: true,
  },
  {
    id: 'website-fixedshop',
    title: '定版式購物網站',
    titleEn: 'Fixed-template E-commerce',
    description: '一次性費用，固定版型並支援局部客製',
    descriptionEn: 'One-time fee for a fixed template with local customization',
    price: 28000,
  },
  {
    id: 'video-production',
    title: '影音製作',
    titleEn: 'Video Production',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'business-card',
    title: '名片設計',
    titleEn: 'Business Card',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'logo-design',
    title: 'logo設計',
    titleEn: 'Logo Design',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'ad-copy',
    title: '廣告文宣',
    titleEn: 'Ad Copy',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'press-release',
    title: '新聞稿撰寫',
    titleEn: 'Press Release',
    description: 'NT$3,000',
    descriptionEn: 'NT$3,000.',
    price: 3000,
  },
  ...pressReleaseMediaServices,
  {
    id: 'interview',
    title: '人物專訪',
    titleEn: 'Interview',
    description: '＄6000',
    descriptionEn: '$6000.',
    price: 6000,
  },
  {
    id: 'public-relations',
    title: '公關媒體',
    titleEn: 'Public Relations',
    description: '依據客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'integrated-marketing',
    title: '整合行銷',
    titleEn: 'Integrated Marketing',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'grant-plan',
    title: '政府補助計畫',
    titleEn: 'Government Grant Plan',
    description: '依據客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
  {
    id: 'groupbuy-mooncake',
    title: '特級中秋月餅禮盒',
    titleEn: 'Premium Mid-Autumn Mooncake Gift Box',
    description: '$880',
    descriptionEn: '$880',
    price: 880,
  },
  {
    id: 'groupbuy-fan',
    title: '智能靜音循環風扇',
    titleEn: 'Smart Silent Air Circulation Fan',
    description: '$1980',
    descriptionEn: '$1980',
    price: 1980,
  },
];
