import { FileText, Globe, IdCard, Palette, Megaphone, Newspaper, Video, Gift, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { serviceCatalog, type ServiceCatalogItem } from '@shared/services';
import { pressReleaseMediaServices } from '@shared/pressReleaseMedia';

export type ServiceItem = ServiceCatalogItem & {
  icon: LucideIcon;
  image?: string;
  isNew?: boolean;
};

const websiteServiceIds = [
  'website-branding',
  'website-shopping',
  'website-blog',
  'website-onepage',
  'website-special',
  'website-fixedshop',
] as const;

export const services: ServiceItem[] = [
  ...websiteServiceIds.map((id) => ({
    ...serviceCatalog.find((service) => service.id === id)!,
    icon: Globe,
  })),
  {
    ...serviceCatalog.find((s) => s.id === 'video-production')!,
    icon: Video,
    image: '/images/service_cloud_library.png',
  },
  {
    ...serviceCatalog.find((s) => s.id === 'business-card')!,
    icon: IdCard,
    image: '/images/service_bloom_sky.png',
  },
  {
    ...serviceCatalog.find((s) => s.id === 'logo-design')!,
    icon: Palette,
    image: '/images/service_writing_room.png',
  },
  {
    ...serviceCatalog.find((s) => s.id === 'ad-copy')!,
    icon: Megaphone,
    image: '/images/service_cloud_library.png',
  },
  {
    ...serviceCatalog.find((s) => s.id === 'press-release')!,
    icon: Newspaper,
  },
  ...pressReleaseMediaServices.map((service) => ({
    ...service,
    icon: FileText,
  })),
  {
    ...serviceCatalog.find((s) => s.id === 'groupbuy-mooncake')!,
    icon: Gift,
    image: '/images/service_mooncake.png',
  },
  {
    ...serviceCatalog.find((s) => s.id === 'groupbuy-fan')!,
    icon: Wind,
    image: '/images/service_fan.png',
  },
];
