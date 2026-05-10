export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: '智能點餐系統 (FastOrder)',
    description: '極簡、高效的雲端團購管理系統。讓團購回歸簡單，讓對帳不再頭痛，優化使用者體驗。',
    image: '/images/fastorder.png',
    tags: ['React', 'Next.js', 'Firebase', 'Cloud'],
    link: 'https://fast-order-beige.vercel.app/',
  },
  {
    id: '2',
    title: 'PickUp - 購物網站',
    description: '結合數位技術與人文美學的電子商務平台，探索日常物件中的美學價值，讓購物成為生活方式的延伸。',
    image: '/images/pickup.png',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Framer Motion'],
    link: 'https://pick-up-jade.vercel.app/',
  },
  {
    id: '3',
    title: '物業管理 App',
    description: '直觀且高效的物業管理工具，提升社區服務與行政作業效率。',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    tags: ['Mobile App', 'Admin Panel', 'Community'],
    link: '#',
  },
];
