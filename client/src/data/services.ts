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
    image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[1], // logo設計
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[2], // 廣告文宣
    icon: Megaphone,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[3], // 靜態網站
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[4], // 動態網站
    icon: Star,
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536ad3a?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[5], // 新聞稿撰寫
    icon: Newspaper,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[6], // 人物專訪
    icon: Mic2,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[7], // 公關媒體
    icon: Share2,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[8], // 整合行銷
    icon: Target,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[9], // 政府補助計畫
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
  {
    ...serviceCatalog[10], // 塑橡膠外銷
    icon: Star,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  },
];
