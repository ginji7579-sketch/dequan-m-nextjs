import { IdCard, Palette, Megaphone, Heart, Star, Newspaper, Mic2, Share2, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { serviceCatalog, type ServiceCatalogItem } from '@shared/services';

export type ServiceItem = ServiceCatalogItem & {
  icon: LucideIcon;
  image?: string;
  isNew?: boolean;
};

export const services: ServiceItem[] = [
  {
    ...serviceCatalog[0], // 名片設計
    icon: IdCard,
    image: '/images/service-branding.png',
  },
  {
    ...serviceCatalog[1], // logo設計
    icon: Palette,
    image: '/images/service-branding.png',
  },
  {
    ...serviceCatalog[2], // 廣告文宣
    icon: Megaphone,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[3], // 靜態網站架設
    icon: Heart,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[4], // 動態網站架設
    icon: Star,
    image: '/images/service-webdev.png',
  },
  {
    ...serviceCatalog[5], // 新聞稿撰寫
    icon: Newspaper,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[6], // 人物專訪
    icon: Mic2,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[7], // 公關媒體
    icon: Share2,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[8], // 整合行銷
    icon: Target,
    image: '/images/service-marketing.png',
  },
  {
    ...serviceCatalog[9], // 政府補助計畫
    icon: Heart,
    image: '/images/service-industrial.png',
  },
  {
    ...serviceCatalog[10], // 塑橡膠外銷
    icon: Star,
    image: '/images/service-industrial.png',
  },
];
