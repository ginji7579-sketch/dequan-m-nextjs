import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import PricingCard from '@/components/PricingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPlanHref, isPricingPlanId, websitePlanOrder } from '@/data/websitePricing';

/**
 * 網站架設報價索引頁
 * 手機版依 smallway.tw/price/ 的做法：所有方案卡片由 3 欄網格改為單欄滿版堆疊，
 * 每張卡片完整呈現標題／價格／特色／CTA，點擊進入該方案的獨立頁面。
 */
export default function WebsitePricing() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  // 相容舊的 ?tab=xxx 連結，轉導到新的獨立頁面路由
  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (isPricingPlanId(tab)) {
      navigate(getPlanHref(tab), { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1E8]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-12 sm:py-14 md:py-20"
          style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full opacity-10 blur-3xl sm:h-80 sm:w-80"
            style={{ background: '#F25C05', transform: 'translate(30%,-30%)' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full opacity-10 blur-3xl sm:h-64 sm:w-64"
            style={{ background: '#2B8A8A', transform: 'translate(-30%,30%)' }}
            aria-hidden="true"
          />

          <div className="container relative z-10">
            <Link href="/">
              <a className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                {t('pricing.backToHome')}
              </a>
            </Link>
            <div className="mb-4 h-1 w-12 rounded-full bg-[#F25C05]" />
            <h1 className="mb-3 text-3xl font-extrabold leading-tight text-white md:text-4xl">
              {t('pricing.websiteTitle')}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/70">
              以下各類型網站均為基本架構與基本方案報價，且都是客製化設計，絕非套版。精確報價須雙方共同討論後決定；若功能需求較簡單，有時會低於基本方案價格。
            </p>
          </div>
        </section>

        {/* 方案網格：手機單欄滿版，平板 2 欄，桌面 3 欄 */}
        <section className="container py-10 md:py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {websitePlanOrder.map((planId) => (
              <PricingCard key={planId} planId={planId} variant="summary" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}