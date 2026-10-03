import { Link, useParams } from 'wouter';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import PricingCard from '@/components/PricingCard';
import NotFound from '@/pages/NotFound';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getPlanHref,
  isPricingPlanId,
  planMeta,
  pricingPlans,
  websitePlanOrder,
  type PricingPlanId,
} from '@/data/websitePricing';

/**
 * 單一網站架設方案的詳細報價頁（/website-pricing/:planId）
 * 每個方案都是獨立頁面，可直接分享、收藏。
 */
export default function WebsitePricingDetail() {
  const { t } = useLanguage();
  const params = useParams<{ planId?: string }>();
  const planId = params.planId;

  if (!isPricingPlanId(planId)) {
    return <NotFound />;
  }

  const plan = pricingPlans[planId];
  const meta = planMeta[planId];
  const index = websitePlanOrder.indexOf(planId);
  const prevId = websitePlanOrder[(index - 1 + websitePlanOrder.length) % websitePlanOrder.length];
  const nextId = websitePlanOrder[(index + 1) % websitePlanOrder.length];

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
              <a className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                {t('pricing.backToHome')}
              </a>
            </Link>

            <nav aria-label="麵包屑" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
                <li>
                  <Link href="/website-pricing">
                    <a className="transition-colors hover:text-white">
                      {t('pricing.websiteTitle')}
                    </a>
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li className="font-semibold text-white" aria-current="page">
                  {t(plan.titleKey)}
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20"
                aria-hidden="true"
              >
                <meta.icon className="h-6 w-6 text-white" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                  {t(plan.titleKey)}
                </h1>
                <p className="mt-1 text-sm text-white/80">（{plan.priceNote}）</p>
              </div>
            </div>
          </div>
        </section>

        <PlanDetailBody planId={planId} prevId={prevId} nextId={nextId} />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

function PlanDetailBody({
  planId,
  prevId,
  nextId,
}: {
  planId: PricingPlanId;
  prevId: PricingPlanId;
  nextId: PricingPlanId;
}) {
  const { t } = useLanguage();

  return (
    <section className="container py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10">
        <div className="min-w-0">
          <PricingCard planId={planId} variant="full" />

          {/* 上一個／下一個方案 */}
          <nav aria-label="方案切換" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <Link href={getPlanHref(prevId)}>
              <a className="flex min-h-[56px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 sm:px-4">
                <ChevronLeft className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-xs font-normal text-gray-400">上一個</span>
                  <span className="block truncate">{t(planMeta[prevId].labelKey)}</span>
                </span>
              </a>
            </Link>

            <Link href={getPlanHref(nextId)}>
              <a className="flex min-h-[56px] items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-right text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 sm:px-4">
                <span className="min-w-0">
                  <span className="block text-xs font-normal text-gray-400">下一個</span>
                  <span className="block truncate">{t(planMeta[nextId].labelKey)}</span>
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
              </a>
            </Link>
          </nav>

          <Link href="/website-pricing">
            <a className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:hidden">
              <ArrowLeft className="h-4 w-4" />
              查看所有方案
            </a>
          </Link>
        </div>

        {/* 桌面版側欄：所有方案 */}
        <aside className="hidden lg:block">
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-gray-400">
            {t('pricing.services')}
          </p>
          <nav className="flex flex-col gap-2">
            {websitePlanOrder.map((id) => {
              const isActive = id === planId;
              const itemPlan = pricingPlans[id];
              const ItemIcon = planMeta[id].icon;
              return (
                <Link key={id} href={getPlanHref(id)}>
                  <a
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${itemPlan.accentFrom} 0%, ${itemPlan.accentTo} 100%)`,
                          }
                        : undefined
                    }
                  >
                    <ItemIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="min-w-0 truncate">{t(planMeta[id].labelKey)}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 flex-shrink-0" />
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </section>
  );
}