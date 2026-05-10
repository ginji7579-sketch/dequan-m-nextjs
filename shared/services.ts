export type ServiceCatalogItem = {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price?: number;
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: 'image-website',
    title: '形象網站基本價',
    titleEn: 'Image Website',
    description: '展示公司服務、費用、聯絡表單。響應式設計，包含精緻排版(共5頁)、結合地圖與粉絲頁、SEO優化。',
    descriptionEn: 'Showcase your company services and contact info. Includes 5 responsive pages, SEO, and maps integration.',
    price: 42000,
  },
  {
    id: 'ecommerce-website',
    title: '購物網站基本價',
    titleEn: 'E-commerce Website',
    description: '可讓人下單購物的24小時網路店面。包含商品上架管理、金物流串接、訂單與庫存管理。',
    descriptionEn: '24/7 online store with product management, payment gateways, and order tracking.',
    price: 68000,
  },
  {
    id: 'fixed-ecommerce',
    title: '定版式購物網站方案',
    titleEn: 'Fixed Layout E-commerce',
    description: '整合所有常見購物功能與版型，最短時間上線。包含商品管理、金物流、最新消息與部落格功能。',
    descriptionEn: 'Pre-designed e-commerce solution for quick launch with all essential features included.',
    price: 28000,
  },
  {
    id: 'blog-website',
    title: '部落格網站基本價',
    titleEn: 'Blog Website',
    description: '適合大量文章發佈，可串接廣告收益。包含精緻首頁、SEO優化、社群分享與備份。',
    descriptionEn: 'Perfect for content creators. Includes SEO optimization, social sharing, and daily backups.',
    price: 34000,
  },
  {
    id: 'onepage-website',
    title: '一頁式網站基本價',
    titleEn: 'One-page Website',
    description: '展示單一產品或活動，適合名單搜集與廣告投放。長度約2~3頁A4，精美動線規劃。',
    descriptionEn: 'Single page layout ideal for specific products, campaigns, or lead generation.',
    price: 16000,
  },
  {
    id: 'special-function-website',
    title: '特殊功能網站基本價',
    titleEn: 'Special Function Website',
    description: '客製化功能如：課程銷售、房仲物件、訂房預約、客戶專區或多國語系網站等。',
    descriptionEn: 'Custom functionality such as booking systems, real estate listings, or multi-language support.',
    price: 60000,
  },
  {
    id: 'press-release',
    title: '新聞稿撰寫',
    titleEn: 'Press Release',
    description: '$3000',
    descriptionEn: '$3000.',
    price: 3000,
  },
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
    id: 'rubber-export',
    title: '塑橡膠外銷',
    titleEn: 'Rubber & Plastic Export',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
  },
];
