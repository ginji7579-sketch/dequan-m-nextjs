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
    id: 'business-card',
    title: '名片設計',
    titleEn: 'Business Card Design',
    description: '單面300雙面500。',
    descriptionEn: 'Single-sided $300, double-sided $500.',
    price: 300,
  },
  {
    id: 'logo-design',
    title: 'logo設計',
    titleEn: 'Logo Design',
    description: '$1000。',
    descriptionEn: '$1000.',
    price: 1000,
  },
  {
    id: 'ad-copy',
    title: '廣告文宣',
    titleEn: 'Ad Copywriting',
    description: '$500/頁',
    descriptionEn: '$500/page.',
    price: 500,
  },
  {
    id: 'static-website',
    title: '靜態網站架設',
    titleEn: 'Static Website',
    description: '1-3萬',
    descriptionEn: '$10K - $30K.',
    price: 10000,
  },
  {
    id: 'dynamic-website',
    title: '動態網站架設',
    titleEn: 'Dynamic Website',
    description: '依照客人需求報價',
    descriptionEn: 'Quote based on customer needs.',
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
