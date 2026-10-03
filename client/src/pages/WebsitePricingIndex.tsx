import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import PricingCard from '@/components/PricingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPlanHref, isPricingPlanId, planMeta, websitePlanOrder } from '@/data/websitePricing';

/**
 * 網站架設報價索引頁
 *
 * 手機版版面比對 smallway.tw/price/：
 * 1. 標題「基本報價」
 * 2. 手寫感裝飾分隔線
 * 3. 大字 intro 文字區塊
 * 4. 品牌色大面板，內含滿版堆疊的方案按鈕（點擊進入各方案獨立頁面）
 *
 * 桌面版則把按鈕改為多欄網格，並在下方補上完整報價卡片供比較。
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
        {/* Hero：標題 + 裝飾分隔線 + 說明文字 */}
        <section className="relative overflow-hidden bg-white py-10 sm:py-14 md:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 18%, #2B8A8A 0, transparent 42%), radial-gradient(circle at 88% 78%, #F25C05 0, transparent 42%)',
            }}
            aria-hidden="true"
          />

          <div className="container relative z-10 text-center">
            <Link href="/">
              <a className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand-primary">
                <ArrowLeft className="h-4 w-4" />
                {t('pricing.backToHome')}
              </a>
            </Link>

            <h1 className="text-3xl font-extrabold leading-tight text-gray-800 sm:text-4xl">
              {t('pricing.basicPrice')}
            </h1>

            {/* 手寫感分隔線 */}
            <svg
              className="mx-auto mt-3 h-4 w-28 text-[#F25C05]"
              viewBox="0 0 120 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 11c10-7 20 3 30-2s20 4 30-1 20 3 30-1 16 2 26 0"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-[#F7F5F0] px-5 py-6 shadow-sm sm:px-8 sm:py-8">
              <p className="text-base leading-loose text-gray-600 sm:text-lg">
                以下各類型網站均為<strong className="font-bold text-gray-800">基本架構</strong>與
                <strong className="font-bold text-gray-800">基本方案報價</strong>
                ，且都是客製化設計，絕非套版。精確報價須雙方共同討論後決定；若功能需求較簡單，有時會低於基本方案價格。
              </p>
            </div>
          </div>
        </section>

        {/* 方案導覽面板：手機滿版堆疊，桌面多欄網格 */}
        <section className="container py-8 sm:py-10 md:py-12">
          <div
            className="rounded-2xl p-4 shadow-xl sm:p-6 md:p-8"
            style={{ background: 'linear-gradient(160deg, #1B4F72, #2B8A8A 60%, #2c5364)' }}
          >
            <nav
              aria-label={t('pricing.services')}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4"
            >
              {websitePlanOrder.map((planId) => {
                const meta = planMeta[planId];
                return (
                  <Link key={planId} href={getPlanHref(planId)}>
                    <a className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg border-2 border-white/90 px-4 py-3.5 text-center text-base font-bold text-white transition-all duration-200 hover:bg-white/15 active:scale-[0.98] sm:min-h-[64px] sm:text-lg">
                      {t(meta.labelKey)}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        {/* 完整報價卡片（方便比較） */}
        <section className="container pb-12 md:pb-16">
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