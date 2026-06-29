export interface PortfolioItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  tags: string[];
  link: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'freezer-shop',
    title: 'Freezer Shop - 高端服飾形象網站',
    titleEn: 'Freezer Shop - Premium Fashion Website',
    description: '採用極簡主義設計的高端衣服購物網站。以黑白灰極簡風格打造，結合流暢的介面與 Next.js 技術，呈現代言品牌的前衛與純粹。',
    descriptionEn: 'A premium fashion e-commerce website with a minimalist black, white, and gray visual system built with Next.js.',
    image: '/images/freezer_shop_jimmy.jpg',
    tags: ['E-commerce', 'Next.js'],
    link: 'https://freezer-shop-five.vercel.app/',
  },
  {
    id: 'wafer-bi',
    title: '工程 BI 分析軟體',
    titleEn: 'Engineering BI Analytics Software',
    description: '專業的工程商業智慧分析平台，運用 K8S 與 Delta Lake 技術，實現大規模數據分析與可視化。',
    descriptionEn: 'A professional engineering business intelligence platform using K8S and Delta Lake for large-scale analytics and visualization.',
    image: '/images/wafer_bi_jimmy.jpg',
    tags: ['K8S', 'Delta Lake'],
    link: 'https://wafer.carrot-atelier.online/',
  },
  {
    id: 'fastorder',
    title: 'FastOrder - 智能點餐系統',
    titleEn: 'FastOrder - Smart Ordering System',
    description: '為餐廳與團購設計的現代化點餐平台，提供流暢的用戶體驗與強大的後台管理功能。支持多種支付方式與實時訂單追蹤。',
    descriptionEn: 'A modern ordering platform for restaurants and group buying, with a smooth user experience and powerful admin tools.',
    image: '/images/fastorder_jimmy.jpg',
    tags: ['Next.js', 'Ordering System'],
    link: 'https://fast-order-beige.vercel.app/',
  },
  {
    id: 'pickup',
    title: 'PickUp - 購物網站',
    titleEn: 'PickUp - E-commerce Website',
    description: '專為電子商務門市設計的系統。簡化流程，優化管理，並提供專業的數據分析報表。',
    descriptionEn: 'A system designed for e-commerce stores, simplifying workflows, improving management, and providing analytics reports.',
    image: '/images/pickup_jimmy.jpg',
    tags: ['E-commerce', 'Management'],
    link: 'https://pick-up-jade.vercel.app/',
  },
  {
    id: 'daily-mate',
    title: 'Daily Mate - 日常生活管理平台',
    titleEn: 'Daily Mate - Daily Life Management Platform',
    description: '一個聚焦日常生活管理與使用體驗優化的網站作品，強調清楚的資訊呈現與流暢的互動流程。',
    descriptionEn: 'A website project focused on daily life management and user experience, emphasizing clear information presentation and smooth interaction flow.',
    image: '/images/daily_mate_jimi.png',
    tags: ['Web App', 'UX Design'],
    link: 'https://daily-mate-flax.vercel.app/',
  },
];
