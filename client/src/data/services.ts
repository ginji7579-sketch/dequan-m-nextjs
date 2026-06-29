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
    image: '/images/service_bloom_sky.png',
  },
  {
    ...serviceCatalog[1], // logo設計
    icon: Palette,
    image: '/images/service_writing_room.png',
  },
  {
    ...serviceCatalog[2], // 廣告文宣
    icon: Megaphone,
    image: '/images/service_cloud_library.png',
  },
];
