export type ServiceCatalogItem = {
  id: string;
  title: string;
  description: string;
  price?: number;
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: 'business-card',
    title: '名片設計',
    description: '依照客人需求報價',
  },
  {
    id: 'logo-design',
    title: 'logo設計',
    description: '依照客人需求報價',
  },
  {
    id: 'ad-copy',
    title: '廣告文宣',
    description: '依照客人需求報價',
  },
  {
    id: 'press-release',
    title: '新聞稿撰寫',
    description: '$3000',
    price: 3000,
  },
  {
    id: 'interview',
    title: '人物專訪',
    description: '＄6000',
    price: 6000,
  },
  {
    id: 'public-relations',
    title: '公關媒體',
    description: '依據客人需求報價',
  },
  {
    id: 'integrated-marketing',
    title: '整合行銷',
    description: '依照客人需求報價',
  },
  {
    id: 'grant-plan',
    title: '政府補助計畫',
    description: '依據客人需求報價',
  },
];
