import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ChevronRight, ArrowLeft,
  Target, Rocket, Star, MessageCircle, Share2, Tv, HandCoins, Globe,
  Newspaper, Mic2, Heart, TrendingUp,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── 行銷方案分類設定 ──────────────────────────────────────────────
const categories = [
  { id: 'brandplan',   labelKey: 'media.brandplan',   icon: Target },
  { id: 'launch',      labelKey: 'media.launch',      icon: Rocket },
  { id: 'celebrity',   labelKey: 'media.celebrity',   icon: Star },
  { id: 'reputation',  labelKey: 'media.reputation',  icon: MessageCircle },
  { id: 'socialads',   labelKey: 'media.socialads',   icon: Share2 },
  { id: 'mediabuy',    labelKey: 'media.mediabuy',    icon: Tv },
  { id: 'crowdfunding',labelKey: 'media.crowdfunding',icon: HandCoins },
  { id: 'pressrelease',labelKey: 'media.pressrelease',icon: Newspaper },
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
  pressrelease: {
    titleKey: 'media.pressrelease',
    accentFrom: '#0EA5E9',
    accentTo: '#38BDF8',
    glowColor: '#0EA5E9',
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

// ─── 共用報價卡片（與網站架設頁面相同結構） ───────────────────────────
function PricingCard({ planId }: { planId: string }) {
  const { t } = useLanguage();
  const plan = plans[planId];
  if (!plan) return null;

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
        </div>

        <div className="px-8 pb-8 pt-6">
          <a
            href="/#contact"
            className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
          >
            {t('pricing.inquireNow')}
          </a>
        </div>

        <div
          className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
          style={{ background: plan.glowColor }}
        />
      </div>
    </div>
  );
}

// ─── 頁面元件 ─────────────────────────────────────────────────────
export default function MarketingPricing() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState('brandplan');
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && categories.some((c) => c.id === tab)) {
      setActiveId(tab);
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
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#7C3AED', transform: 'translate(30%,-30%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#059669', transform: 'translate(-30%,30%)' }} />

          <div className="container relative z-10">
            <Link href="/">
              <a className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('pricing.backToHome')}
              </a>
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

        {/* Tabs + Card */}
        <section className="container py-10 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-64 flex-shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">{t('pricing.services')}</p>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map(({ id, labelKey, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = plans[id];
                  const isMediaBuy = id === 'mediabuy';

                  return (
                    <div key={id} className="contents lg:flex lg:flex-col lg:w-full">
                      {/* 主按鈕 */}
                      <button
                        onClick={() => {
                          setActiveId(id);
                          setLocation(`/media-marketing-pricing?tab=${id}`);
                        }}
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

                      {/* 如果是媒體採購方案，則在其下方渲染「廣告版面」子按鈕 */}
                      {isMediaBuy && (
                        <Link
                          href="/media-marketing-pricing/ad-space"
                          className="flex shrink-0 items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap text-gray-600 bg-white hover:bg-orange-50 hover:text-[#F25C05] transition-colors border border-gray-100 lg:mt-1 lg:ml-2 lg:pl-10 lg:pr-4 lg:py-2 lg:rounded-lg lg:bg-gray-50 lg:border-l-2 lg:border-y-0 lg:border-r-0 lg:border-gray-200"
                        >
                          <ChevronRight className="w-3 h-3 text-[#F25C05]" />
                          <span>{t('media.adspace')}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </aside>

            <div className="flex-1 min-h-[400px]">
              <PricingCard planId={activeId} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
