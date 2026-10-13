import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import {
  ChevronRight, ArrowLeft, ChevronLeft,
  Target, Rocket, Star, MessageCircle, Share2, Tv, HandCoins, Globe,
  Newspaper, FileText, Mic2, Heart, TrendingUp, ShoppingCart,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import NotFound from '@/pages/NotFound';
import { services } from '@/data/services';
import { toast } from 'sonner';
import {
  pressReleaseMediaTable,
  websiteSocialGeoTables,
  type ComparisonTable,
  type MediaListingTable,
} from '@/data/mediaMarketingPricing';

// ─── 行銷方案分類設定 ──────────────────────────────────────────────
const pressReleaseCategories = [
  { id: 'pressrelease', labelKey: 'media.pressrelease', icon: Newspaper },
  { id: 'pressrelease-media', labelKey: 'media.pressreleaseMedia', icon: FileText },
];

const categories = [
  { id: 'website-social-geo', labelKey: 'media.websiteSocialGeo', icon: Globe },
  { id: 'brandplan',   labelKey: 'media.brandplan',   icon: Target },
  { id: 'launch',      labelKey: 'media.launch',      icon: Rocket },
  { id: 'celebrity',   labelKey: 'media.celebrity',   icon: Star },
  { id: 'reputation',  labelKey: 'media.reputation',  icon: MessageCircle },
  { id: 'socialads',   labelKey: 'media.socialads',   icon: Share2 },
  { id: 'mediabuy',    labelKey: 'media.mediabuy',    icon: Tv },
  { id: 'crowdfunding',labelKey: 'media.crowdfunding',icon: HandCoins },
  { id: 'pressrelease-group', labelKey: 'media.pressreleaseGroup', icon: Newspaper },
  { id: 'interview',   labelKey: 'media.interview',   icon: Mic2 },
  { id: 'publicrelations', labelKey: 'media.publicrelations', icon: Globe },
  { id: 'integratedmarketing', labelKey: 'media.integratedmarketing', icon: TrendingUp },
  { id: 'grantplan',   labelKey: 'media.grantplan',   icon: Heart },
];

// ─── 各方案詳細內容 ────────────────────────────────────────────────
const plans: Record<string, {
  titleKey: string;
  accentFrom: string;
  accentTo: string;
  glowColor: string;
}> = {
  'website-social-geo': {
    titleKey: 'media.websiteSocialGeo',
    accentFrom: '#0F766E',
    accentTo: '#2DD4BF',
    glowColor: '#0F766E',
  },
  brandplan: {
    titleKey: 'media.brandplan',
    accentFrom: '#7C3AED',
    accentTo: '#A78BFA',
    glowColor: '#7C3AED',
  },
  launch: {
    titleKey: 'media.launch',
    accentFrom: '#059669',
    accentTo: '#34D399',
    glowColor: '#059669',
  },
  celebrity: {
    titleKey: 'media.celebrity',
    accentFrom: '#DB2777',
    accentTo: '#F472B6',
    glowColor: '#DB2777',
  },
  reputation: {
    titleKey: 'media.reputation',
    accentFrom: '#D97706',
    accentTo: '#FBBF24',
    glowColor: '#D97706',
  },
  socialads: {
    titleKey: 'media.socialads',
    accentFrom: '#2563EB',
    accentTo: '#60A5FA',
    glowColor: '#2563EB',
  },
  mediabuy: {
    titleKey: 'media.mediabuy',
    accentFrom: '#0891B2',
    accentTo: '#22D3EE',
    glowColor: '#0891B2',
  },
  crowdfunding: {
    titleKey: 'media.crowdfunding',
    accentFrom: '#B45309',
    accentTo: '#F59E0B',
    glowColor: '#B45309',
  },
  'pressrelease-group': {
    titleKey: 'media.pressreleaseGroup',
    accentFrom: '#0EA5E9',
    accentTo: '#38BDF8',
    glowColor: '#0EA5E9',
  },
  pressrelease: {
    titleKey: 'media.pressrelease',
    accentFrom: '#0EA5E9',
    accentTo: '#38BDF8',
    glowColor: '#0EA5E9',
  },
  'pressrelease-media': {
    titleKey: 'media.pressreleaseMedia',
    accentFrom: '#F97316',
    accentTo: '#FBBF24',
    glowColor: '#F97316',
  },
  interview: {
    titleKey: 'media.interview',
    accentFrom: '#8B5CF6',
    accentTo: '#A78BFA',
    glowColor: '#8B5CF6',
  },
  publicrelations: {
    titleKey: 'media.publicrelations',
    accentFrom: '#F43F5E',
    accentTo: '#FB7185',
    glowColor: '#F43F5E',
  },
  integratedmarketing: {
    titleKey: 'media.integratedmarketing',
    accentFrom: '#10B981',
    accentTo: '#34D399',
    glowColor: '#10B981',
  },
  grantplan: {
    titleKey: 'media.grantplan',
    accentFrom: '#EC4899',
    accentTo: '#F472B6',
    glowColor: '#EC4899',
  },
};

const marketingPlanOrder = categories.flatMap((category) =>
  category.id === 'pressrelease-group'
    ? [category, ...pressReleaseCategories]
    : [category],
);
const validCategoryIds = new Set(marketingPlanOrder.map(({ id }) => id));
const marketingCategoryOrder = [...marketingPlanOrder.map(({ id }) => id), 'adspace'];

function getMarketingPlanHref(planId: string) {
  return `/media-marketing-pricing/${planId}`;
}

function isMarketingPlanId(planId: string | undefined): planId is string {
  return typeof planId === 'string' && Object.prototype.hasOwnProperty.call(plans, planId);
}

// ─── 共用報價卡片（與網站架設頁面相同結構） ───────────────────────────
function PricingCard({ planId }: { planId: string }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const plan = plans[planId];
  if (!plan) return null;

  const isPressReleaseWriting = planId === 'pressrelease';
  const pressReleaseService = services.find((service) => service.id === 'press-release');

  const handleAddPressReleaseToCart = () => {
    if (!pressReleaseService) return;
    addItem(pressReleaseService);
    toast.success(`${pressReleaseService.title} 已加入購物車`);
  };

  return (
    <div className="animate-fade-in-up flex justify-center">
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)' }}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(to right, ${plan.accentFrom}, ${plan.accentTo})` }}
        />

        <div className="text-center mt-8 px-8">
          <h2 className="text-white text-2xl font-bold mb-1">{t(plan.titleKey)}</h2>
          {isPressReleaseWriting && (
            <p className="text-3xl font-extrabold text-white">
              NT$<span className="text-sky-300">3,000</span>
            </p>
          )}
        </div>

        <div className="px-8 pb-8 pt-6">
          {isPressReleaseWriting ? (
            <button
              type="button"
              onClick={handleAddPressReleaseToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
            >
              <ShoppingCart className="h-4 w-4" />
              {t('pricing.addToCart')}
            </button>
          ) : (
            <a
              href="/contact"
              className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
            >
              {t('pricing.inquireNow')}
            </a>
          )}
        </div>

        <div
          className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
          style={{ background: plan.glowColor }}
        />
      </div>
    </div>
  );
}

function ComparisonCell({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item}`}
          className="relative pl-4 text-sm leading-7 text-gray-700"
        >
          <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-[#1B6E86]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ComparisonTable({
  table,
  accentFrom,
}: {
  table: ComparisonTable;
  accentFrom: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-[#D8E1E5] bg-white shadow-sm"
      style={{ borderTop: `4px solid ${accentFrom}` }}
    >
      <div className="bg-[#1B6E86] px-5 py-4 text-white sm:px-6">
        <h2 className="text-lg font-bold sm:text-xl">{table.title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-4 py-3 text-base font-bold text-[#2C3E50] ${
                    index === 0 ? 'w-[22%]' : 'w-[39%]'
                  } ${index === 0 ? 'bg-[#C5CDD3]' : 'bg-[#D4DDE2]'}`}
                >
                  <span className="block text-center">{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.label} className="border-b border-[#D8E1E5] last:border-0">
                <th
                  scope="row"
                  className="bg-[#C5CDD3] px-4 py-4 align-middle text-center text-sm font-bold leading-6 text-[#2C3E50]"
                >
                  {row.label}
                </th>
                <td className="bg-[#E5E7EB] px-4 py-4 align-top">
                  <ComparisonCell items={row.basic} />
                </td>
                <td className="bg-[#E5E7EB] px-4 py-4 align-top">
                  <ComparisonCell items={row.advanced} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#D1D5DB]">
              <th
                scope="row"
                className="px-4 py-5 text-center text-base font-bold leading-6 text-[#2C3E50]"
              >
                {table.totalLabel}
                {table.totalNote && (
                  <span className="mt-1 block text-xs font-normal text-gray-600">
                    {table.totalNote}
                  </span>
                )}
              </th>
              <td className="px-4 py-5 text-center text-xl font-extrabold text-[#2C3E50] sm:text-2xl">
                {table.totals[0]}
              </td>
              <td className="px-4 py-5 text-center text-xl font-extrabold text-[#2C3E50] sm:text-2xl">
                {table.totals[1]}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function WebsiteSocialGeoDetails({
  accentFrom,
  accentTo,
}: {
  accentFrom: string;
  accentTo: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div
        className="rounded-2xl p-6 text-white shadow-lg sm:p-8"
        style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/80">
          Media Marketing
        </p>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {t('media.websiteSocialGeo')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          整合網站內容、社群經營與 GEO 搜尋曝光，依品牌需求選擇基礎或進階方案。
        </p>
      </div>

      {[...websiteSocialGeoTables].reverse().map((table) => (
        <ComparisonTable key={table.title} table={table} accentFrom={accentFrom} />
      ))}

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#D8E1E5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C3E50]">想依品牌現況調整方案？</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            送出需求後，由專人依網站與社群現況協助確認合適的執行範圍。
          </p>
        </div>
        <a
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
        >
          {t('pricing.inquireNow')}
        </a>
      </div>
    </div>
  );
}

function MediaListingTable({
  table,
  accentFrom,
}: {
  table: MediaListingTable;
  accentFrom: string;
}) {
  const { t } = useLanguage();
  const { addItem } = useCart();

  const handleAddToCart = (serviceId: string, title: string, expectedPrice: number) => {
    const service = services.find((item) => item.id === serviceId);
    if (!service || service.price !== expectedPrice) {
      toast.error('媒體價格資料尚未同步，請稍後再試');
      return;
    }
    addItem(service);
    toast.success(`${title} 已加入購物車`);
  };

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[#D8E1E5] bg-white shadow-sm"
      style={{ borderTop: `4px solid ${accentFrom}` }}
    >
      <div className="divide-y divide-[#D8E1E5] md:hidden">
        {table.rows.map((row) => (
          <article key={row.serviceId} className="space-y-4 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-base font-bold leading-6 text-[#2C3E50]">
                {row.media}
              </h3>
              <span
                className="inline-flex flex-shrink-0 rounded-lg border border-current/15 bg-white px-3 py-1.5 text-sm font-extrabold shadow-sm"
                style={{ color: accentFrom }}
              >
                {row.price}
              </span>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] p-3">
              <p className="mb-1 text-xs font-bold tracking-wide text-gray-500">
                {table.headers[2]}
              </p>
              <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700">
                {row.note}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(row.serviceId, `${row.media}新聞稿刊登`, row.priceValue)}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2"
              aria-label={`將 ${row.media} 新聞稿刊登加入購物車`}
            >
              <ShoppingCart className="h-4 w-4" />
              {t('pricing.addToCart')}
            </button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F97316]">
              {table.headers.map((header, index) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-4 py-3 text-base font-bold text-white ${
                    index === 0
                      ? 'w-[26%]'
                      : index === 1
                        ? 'w-[16%]'
                        : index === 2
                          ? 'w-[38%]'
                          : 'w-[20%]'
                  }`}
                >
                  <span className="block text-center">{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr
                key={row.serviceId}
                className="border-b border-[#D8E1E5] transition-colors last:border-0 hover:bg-[#F8FAFC]"
              >
                <th
                  scope="row"
                  className="bg-[#C5CDD3] px-4 py-4 text-center text-sm font-bold leading-6 text-[#2C3E50]"
                >
                  {row.media}
                </th>
                <td
                  className={`px-4 py-4 text-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className="inline-flex rounded-lg border border-current/15 bg-white px-3 py-1.5 text-base font-extrabold shadow-sm"
                    style={{ color: accentFrom }}
                  >
                    {row.price}
                  </span>
                </td>
                <td
                  className={`px-4 py-4 text-center text-sm font-medium leading-6 text-gray-700 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                  }`}
                >
                  {row.note}
                </td>
                <td
                  className={`px-3 py-4 text-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleAddToCart(row.serviceId, `${row.media}新聞稿刊登`, row.priceValue)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2"
                    aria-label={`將 ${row.media} 新聞稿刊登加入購物車`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t('pricing.addToCart')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.footerNotes && table.footerNotes.length > 0 && (
        <div className="space-y-1 border-t border-[#D8E1E5] bg-[#FFF7ED] px-5 py-4 text-sm leading-6 text-gray-700 sm:px-6">
          {table.footerNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}

    </section>
  );
}

function PressReleaseMediaDetails({
  accentFrom,
  accentTo,
}: {
  accentFrom: string;
  accentTo: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div
        className="rounded-2xl p-6 text-white shadow-lg sm:p-8"
        style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/80">
          Media Marketing
        </p>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {t('media.pressreleaseMedia')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          依媒體與刊登條件整理費用，實際刊登以媒體審稿與檔期確認為準。
        </p>
      </div>

      <MediaListingTable
        table={pressReleaseMediaTable}
        accentFrom={accentFrom}
      />

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#D8E1E5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C3E50]">想確認適合的媒體刊登方案？</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            告知新聞稿主題與產業需求，由專人協助確認媒體及刊登條件。
          </p>
        </div>
        <a
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
        >
          {t('pricing.inquireNow')}
        </a>
      </div>
    </div>
  );
}

function MarketingPlanNavigation({ activeId }: { activeId?: string }) {
  const { t } = useLanguage();

  return (
    <nav className="flex flex-col gap-2" aria-label={t('pricing.services')}>
      {marketingPlanOrder.map(({ id, labelKey, icon: Icon }) => {
        const plan = plans[id];
        const isActive = activeId === id;
        return (
          <Link key={id} href={getMarketingPlanHref(id)}>
            <span
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[48px] items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={
                isActive
                  ? { background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }
                  : undefined
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="min-w-0 truncate">{t(labelKey)}</span>
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 flex-shrink-0" />}
            </span>
          </Link>
        );
      })}
      <Link href="/media-marketing-pricing/ad-space">
        <span
          aria-current={activeId === 'adspace' ? 'page' : undefined}
          className={`flex min-h-[48px] items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            activeId === 'adspace'
              ? 'bg-orange-500 text-white shadow-md'
              : 'border border-gray-100 bg-white text-gray-600 hover:bg-orange-50 hover:text-[#F25C05]'
          }`}
        >
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span>{t('media.adspace')}</span>
        </span>
      </Link>
    </nav>
  );
}

// ─── 媒體行銷分類索引頁 ─────────────────────────────────────────────
export default function MarketingPricing() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab && validCategoryIds.has(tab)) {
      navigate(getMarketingPlanHref(tab), { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative py-16 md:py-20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}
        >
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#7C3AED', transform: 'translate(30%,-30%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#059669', transform: 'translate(-30%,30%)' }} />

          <div className="container relative z-10">
            <Link href="/">
              <span className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('pricing.backToHome')}
              </span>
            </Link>
            <div className="h-1 w-12 rounded-full bg-[#7C3AED] mb-4" />
            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              {t('pricing.marketingTitle')}
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl">
              {t('pricing.marketingDesc')}
            </p>
          </div>
        </section>

        <section className="container pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-12">
          <div
            className="rounded-2xl p-4 shadow-xl sm:p-6 md:p-8"
            style={{ background: 'linear-gradient(160deg, #1B4F72, #2B8A8A 60%, #2c5364)' }}
          >
            <nav
              aria-label={t('pricing.services')}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
            >
              {marketingPlanOrder.map(({ id, labelKey }) => (
                <Link key={id} href={getMarketingPlanHref(id)}>
                  <span className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg border-2 border-white/90 px-4 py-3.5 text-center text-base font-bold text-white transition-all duration-200 hover:bg-white/15 active:scale-[0.98] sm:min-h-[64px] sm:text-lg">
                    {t(labelKey)}
                  </span>
                </Link>
              ))}
              <Link href="/media-marketing-pricing/ad-space">
                <span className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg border-2 border-white/90 px-4 py-3.5 text-center text-base font-bold text-white transition-all duration-200 hover:bg-white/15 active:scale-[0.98] sm:min-h-[64px] sm:text-lg">
                  {t('media.adspace')}
                </span>
              </Link>
            </nav>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

// ─── 媒體行銷分類詳細頁 ────────────────────────────────────────────
export function MarketingPricingDetail() {
  const { t } = useLanguage();
  const { planId } = useParams<{ planId?: string }>();

  if (!isMarketingPlanId(planId)) {
    return <NotFound />;
  }

  const plan = plans[planId];
  const category = marketingPlanOrder.find((item) => item.id === planId);
  const CategoryIcon = category?.icon;
  const currentIndex = marketingCategoryOrder.indexOf(planId);
  const previousId = marketingCategoryOrder[
    (currentIndex - 1 + marketingCategoryOrder.length) % marketingCategoryOrder.length
  ];
  const nextId = marketingCategoryOrder[(currentIndex + 1) % marketingCategoryOrder.length];
  const previousHref = previousId === 'adspace'
    ? '/media-marketing-pricing/ad-space'
    : getMarketingPlanHref(previousId);
  const nextHref = nextId === 'adspace'
    ? '/media-marketing-pricing/ad-space'
    : getMarketingPlanHref(nextId);
  const previousLabel = previousId === 'adspace'
    ? t('media.adspace')
    : t(marketingPlanOrder.find((item) => item.id === previousId)!.labelKey);
  const nextLabel = nextId === 'adspace'
    ? t('media.adspace')
    : t(marketingPlanOrder.find((item) => item.id === nextId)!.labelKey);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1E8]">
      <Header />
      <main className="flex-1">
        <section
          className="relative overflow-hidden py-10 sm:py-12 md:py-16"
          style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
        >
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: plan.glowColor }}
            aria-hidden="true"
          />
          <div className="container relative z-10">
            <Link href="/">
              <span className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                {t('pricing.backToHome')}
              </span>
            </Link>
            <nav aria-label="麵包屑" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
                <li>
                  <Link href="/media-marketing-pricing">
                    <span className="transition-colors hover:text-white">{t('pricing.marketingTitle')}</span>
                  </Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">
                  {t(plan.titleKey)}
                </li>
              </ol>
            </nav>
            <div className="flex items-center gap-3">
              {CategoryIcon && (
                <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20" aria-hidden="true">
                  <CategoryIcon className="h-6 w-6 text-white" />
                </span>
              )}
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                {t(plan.titleKey)}
              </h1>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10">
            <div className="min-w-0">
              {planId === 'website-social-geo' ? (
                <WebsiteSocialGeoDetails
                  accentFrom={plan.accentFrom}
                  accentTo={plan.accentTo}
                />
              ) : planId === 'pressrelease-media' ? (
                <PressReleaseMediaDetails
                  accentFrom={plan.accentFrom}
                  accentTo={plan.accentTo}
                />
              ) : planId === 'pressrelease-group' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {pressReleaseCategories.map(({ id, labelKey, icon: Icon }) => (
                    <Link key={id} href={getMarketingPlanHref(id)}>
                      <span className="flex min-h-[120px] items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-lg font-bold text-gray-700 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-50">
                        <Icon className="h-6 w-6 flex-shrink-0 text-sky-600" />
                        <span>{t(labelKey)}</span>
                        <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 text-gray-400" />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <PricingCard planId={planId} />
              )}

              <nav aria-label="分類切換" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <Link href={previousHref}>
                  <span className="flex min-h-[56px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:px-4">
                    <ChevronLeft className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-xs font-normal text-gray-400">上一個</span>
                      <span className="block truncate">{previousLabel}</span>
                    </span>
                  </span>
                </Link>
                <Link href={nextHref}>
                  <span className="flex min-h-[56px] items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-right text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:px-4">
                    <span className="min-w-0">
                      <span className="block text-xs font-normal text-gray-400">下一個</span>
                      <span className="block truncate">{nextLabel}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  </span>
                </Link>
              </nav>
              <Link href="/media-marketing-pricing">
                <span className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:hidden">
                  <ArrowLeft className="h-4 w-4" />
                  查看所有分類
                </span>
              </Link>
            </div>

            <aside className="hidden lg:block">
              <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                {t('pricing.services')}
              </p>
              <MarketingPlanNavigation activeId={planId} />
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
