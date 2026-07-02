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
];
