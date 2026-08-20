import { Cake, Wind } from 'lucide-react';

export const groupBuySubCategories = [
  { id: 'mooncake', label: '月餅', href: '/group-buy/mooncake' },
  { id: 'fan', label: '風扇', href: '/group-buy/fan' },
];

export const groupBuyCategory = {
  id: 'groupbuy',
  label: '團購',
  href: '/group-buy',
  hasSub: true,
  isGroupBuy: true,
  icon: Cake,
  subItems: groupBuySubCategories,
};
