import { Monitor, ShoppingCart, Store, PenTool, Layout, Settings, Newspaper, Mic2, Share2, Target, Heart, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { serviceCatalog, type ServiceCatalogItem } from '@shared/services';

export type ServiceItem = ServiceCatalogItem & {
  icon: LucideIcon;
  image?: string;
  isNew?: boolean;
};

  {
    ...serviceCatalog[0], // 形象網站基本價
    icon: Monitor,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[1], // 購物網站基本價
    icon: ShoppingCart,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[2], // 定版式購物網站方案
    icon: Store,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[3], // 部落格網站基本價
    icon: PenTool,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[4], // 一頁式網站基本價
    icon: Layout,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[5], // 特殊功能網站基本價
    icon: Settings,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[6], // 新聞稿撰寫
    icon: Newspaper,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[7], // 人物專訪
    icon: Mic2,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[8], // 公關媒體
    icon: Share2,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[9], // 整合行銷
    icon: Target,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[10], // 政府補助計畫
    icon: Heart,
    image: '/images/service-industrial.png',
  },
  {
    ...serviceCatalog[11], // 塑橡膠外銷
    icon: Star,
    image: '/images/service-industrial.png',
  },
];
