import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/services';
import { planMeta, pricingPlans, type PricingPlanId } from '@/data/websitePricing';

/**
 * 報價卡片
 * 版面參考 smallway.tw/price/ 的 price-table 結構：
 * 標題 → 副標 → 價格 → 完整特色清單 → 加購 + 請求報價。
 *
 * 僅用於各方案詳細頁（/website-pricing/:planId）；
 * 索引頁只提供方案入口按鈕，不再重複列出報價卡片。
 */
export type PricingCardProps = {
  planId: PricingPlanId;
};

export default function PricingCard({ planId }: PricingCardProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const plan = pricingPlans[planId];
  const meta = planMeta[planId];
  const serviceItem = services.find((service) => service.id === plan.serviceId);

  const handleAddToCart = () => {
    if (!serviceItem) return;
    addItem(serviceItem);
    toast.success(`${serviceItem.title} 已加入購物車`);
  };

  return (
    <article
      className="animate-fade-in-up relative flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)' }}
    >
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{ background: `linear-gradient(to right, ${plan.accentFrom}, ${plan.accentTo})` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
        <div className="text-center">
          <span
            className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
            aria-hidden="true"
          >
            <meta.icon className="h-5 w-5 text-white" />
          </span>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t(plan.titleKey)}</h2>
          <p className="mt-1 text-sm text-gray-400">（{plan.priceNote}）</p>
        </div>

        <div
          className="mb-6 mt-5 flex flex-wrap items-start justify-center gap-x-1 gap-y-1"
          aria-label={`基本價格 ${plan.price.toLocaleString()} 元起`}
        >
          <span className="mt-1.5 text-base text-gray-400 sm:mt-2 sm:text-lg">$</span>
          <span
            className="text-[2rem] font-extrabold leading-none tabular-nums sm:text-4xl sm:leading-tight md:text-5xl"
            style={{ color: plan.accentTo }}
          >
            {plan.price.toLocaleString()}
          </span>
          {plan.priceFrom && <span className="mt-2 text-sm text-gray-300 sm:mt-3">以上</span>}
        </div>

        <div className="mb-6">
          <ul>
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 border-b border-white/10 py-2.5 last:border-none"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  style={{ color: plan.accentTo }}
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-gray-200">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!serviceItem}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)`,
            }}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            加入購物車
          </button>

          <a
            href="/contact"
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            {plan.cta}
          </a>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
        style={{ background: plan.glowColor }}
        aria-hidden="true"
      />
    </article>
  );
}