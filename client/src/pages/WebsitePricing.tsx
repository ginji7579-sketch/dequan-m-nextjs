import { useEffect, useState, type ComponentType } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Globe,
  Layout,
  ShoppingCart,
  Store,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { services } from '@/data/services';
import { pricingPlans, type PricingPlanId } from '@/data/websitePricing';
import { toast } from 'sonner';

// ─── Category Config ──────────────────────────────────────────────────────────

const categories: { id: PricingPlanId; labelKey: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'branding', labelKey: 'website.branding', icon: Globe },
  { id: 'shopping', labelKey: 'website.shopping', icon: ShoppingCart },
  { id: 'blog', labelKey: 'website.blog', icon: BookOpen },
  { id: 'onepage', labelKey: 'website.onepage', icon: Layout },
  { id: 'special', labelKey: 'website.special', icon: Zap },
  { id: 'fixedshop', labelKey: 'website.fixedshop', icon: Store },
];

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({ planId }: { planId: PricingPlanId }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const plan = pricingPlans[planId];
  const serviceItem = services.find((service) => service.id === plan.serviceId);

  const handleAddToCart = () => {
    if (!serviceItem) return;
    addItem(serviceItem);
    toast.success(`${serviceItem.title} 已加入購物車`);
  };

  return (
    <div
      key={plan.id}
      className="animate-fade-in-up relative w-full overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)' }}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(to right, ${plan.accentFrom}, ${plan.accentTo})` }}
      />

      <div className="relative z-10 px-6 pb-8 pt-9 sm:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{t(plan.titleKey)}</h2>
          <p className="mt-1 text-sm text-gray-400">（{plan.priceNote}）</p>
        </div>

        <div
          className="mb-7 mt-5 flex items-start justify-center gap-1"
          aria-label={`基本價格 ${plan.price.toLocaleString()} 元起`}
        >
          <span className="mt-2 text-lg text-gray-400">$</span>
          <span
            className="text-4xl font-extrabold sm:text-5xl"
            style={{ color: plan.accentTo }}
          >
            {plan.price.toLocaleString()}
          </span>
          {plan.priceFrom && <span className="mt-3 text-sm text-gray-300">以上</span>}
        </div>

        <div className="mb-6 space-y-0">
          {plan.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 border-b border-white/10 py-2.5 last:border-none"
            >
              <CheckCircle2
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                style={{ color: plan.accentTo }}
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-gray-200">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!serviceItem}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            加入購物車
          </button>
          <a
            href="/contact"
            className="block w-full rounded-xl bg-white/10 py-2.5 text-center text-sm font-semibold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            {plan.cta}
          </a>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
        style={{ background: plan.glowColor }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebsitePricing() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<PricingPlanId>('branding');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && categories.some((category) => category.id === tab)) {
      setActiveId(tab as PricingPlanId);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative py-16 md:py-20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}
        >
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#F25C05', transform: 'translate(30%,-30%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#2B8A8A', transform: 'translate(-30%,30%)' }} />

          <div className="container relative z-10">
            <Link href="/">
              <a className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('pricing.backToHome')}
              </a>
            </Link>
            <div className="h-1 w-12 rounded-full bg-[#F25C05] mb-4" />
            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              {t('pricing.websiteTitle')}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/70">
              以下各類型網站均為基本架構與基本方案報價，且都是客製化設計，絕非套版。精確報價須雙方共同討論後決定；若功能需求較簡單，有時會低於基本方案價格。
            </p>
          </div>
        </section>

        {/* Tabs + Card */}
        <section className="container py-10 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">{t('pricing.services')}</p>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map(({ id, labelKey, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = pricingPlans[id];
                  return (
                    <button
                      key={id}
                      id={`tab-${id}`}
                      onClick={() => setActiveId(id)}
                      className={`flex shrink-0 lg:w-full items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'text-white shadow-md scale-[1.02]'
                          : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-100'
                      }`}
                      style={isActive ? { background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` } : {}}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {t(labelKey)}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Card Panel */}
            <div className="flex-1 min-h-[400px]">
              <PricingCard planId={activeId} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
