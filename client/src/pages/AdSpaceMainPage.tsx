import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

// 三個廣告版面的詳細資料（與報價頁面卡片格式一致）
const adSpaces = {
  homepage: {
    id: 'homepage',
    titleKey: 'adspace.homepage',
    accentFrom: '#0891B2',
    accentTo: '#22D3EE',
    glowColor: '#0891B2',
  },
  menu: {
    id: 'menu',
    titleKey: 'adspace.menu',
    accentFrom: '#0891B2',
    accentTo: '#22D3EE',
    glowColor: '#0891B2',
  },
  classified: {
    id: 'classified',
    titleKey: 'adspace.classified',
    accentFrom: '#0891B2',
    accentTo: '#22D3EE',
    glowColor: '#0891B2',
  },
};

type AdSpaceKey = keyof typeof adSpaces;

// 左側邊欄選項列表
const sidebarItems = [
  { key: 'homepage' as AdSpaceKey, labelKey: 'adspace.homepage' },
  { key: 'menu' as AdSpaceKey, labelKey: 'adspace.menu' },
  { key: 'classified' as AdSpaceKey, labelKey: 'adspace.classified' },
];

export default function AdSpaceMainPage() {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState<AdSpaceKey>('homepage');
  const current = adSpaces[activeKey];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <Header />

      {/* Hero 區塊（與精準媒體行銷方案報價頁面相同） */}
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
            {t('adspace.title')}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl">
            {t('adspace.desc')}
          </p>
        </div>
      </section>

      {/* 左右兩欄布局 */}
      <section className="container py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* 左側邊欄：三個廣告版面選項 */}
          <aside className="lg:w-64 flex-shrink-0">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">{t('media.adspace')}</p>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`flex shrink-0 lg:w-full items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeKey === item.key
                      ? 'text-white shadow-md scale-[1.02]'
                      : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-100'
                  }`}
                  style={
                    activeKey === item.key
                      ? { background: `linear-gradient(135deg, ${current.accentFrom} 0%, ${current.accentTo} 100%)` }
                      : {}
                  }
                >
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  {t(item.labelKey)}
                  {activeKey === item.key && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* 右側內容：顯示當前選中的廣告版面卡片 */}
          <div className="flex-1 min-h-[400px] flex justify-center">
            <div className="w-full max-w-md">
              {/* 可選：返回媒體採購方案總覽連結，保留原功能 */}
              <Link href="/media-marketing-pricing">
                <a className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  {t('adspace.backToMarketing')}
                </a>
              </Link>

              <div className="animate-fade-in-up flex justify-center">
                <div
                  className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                  style={{ background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)' }}
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ background: `linear-gradient(to right, ${current.accentFrom}, ${current.accentTo})` }}
                  />

                  <div className="text-center mt-8 px-8">
                    <h2 className="text-white text-2xl font-bold mb-1">{t(current.titleKey)}</h2>
                  </div>

                  <div className="px-8 pb-8 pt-6">
                    <a
                      href="/#contact"
                      className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                      style={{ background: `linear-gradient(135deg, ${current.accentFrom} 0%, ${current.accentTo} 100%)` }}
                    >
                      {t('pricing.inquireNow')}
                    </a>
                  </div>

                  <div
                    className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
                    style={{ background: current.glowColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
