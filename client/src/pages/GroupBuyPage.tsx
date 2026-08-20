import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ChevronRight, ChevronDown, ArrowLeft,
  Cake, Wind,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Category Config ──────────────────────────────────────────────────────────

// Left sidebar categories removed per request. Keep arrays empty so no sidebar item is rendered.
const categories: { id: string; labelKey: string; icon?: any }[] = [];

const subItems: Record<string, any[]> = {};

// ─── Feature Data ─────────────────────────────────────────────────────────────

const plans: Record<string, { titleKey: string; accentFrom: string; accentTo: string; glowColor: string }> = {
  mooncake: {
    titleKey: '月餅',
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  fan: {
    titleKey: '風扇',
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  'mooncake-classic': {
    titleKey: '經典月餅',
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  'mooncake-premium': {
    titleKey: '高級月餅',
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  'mooncake-modern': {
    titleKey: '創意月餅',
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  'fan-basic': {
    titleKey: '基礎風扇',
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  'fan-smart': {
    titleKey: '智能風扇',
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  'fan-portable': {
    titleKey: '便攜風扇',
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
};

// ─── Shared Pricing Card ──────────────────────────────────────────────────────

function GroupBuyCard({ planId }: { planId: string }) {
  const plan = plans[planId];
  if (!plan) return null;

  return (
    <div className="animate-fade-in-up flex justify-center">
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)' }}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(to right, ${plan.accentFrom}, ${plan.accentTo})` }}
        />

        {/* Title */}
        <div className="text-center px-8 mt-8">
          <h2 className="text-white text-2xl font-bold mb-1">{plan.titleKey}</h2>
        </div>

        {/* CTA */}
        <div className="px-8 pb-8 pt-6">
          <a
            href="/contact"
            className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
          >
            查詢詳情
          </a>
        </div>

        {/* Decorative glow */}
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
          style={{ background: plan.glowColor }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GroupBuyPage() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState('mooncake');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && (categories.some((c) => c.id === tab) || Object.keys(plans).includes(tab))) {
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
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#F25C05', transform: 'translate(30%,-30%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#2B8A8A', transform: 'translate(-30%,30%)' }} />

          <div className="container relative z-10">
            <Link href="/">
              <a className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                返回首頁
              </a>
            </Link>
            <div className="h-1 w-12 rounded-full bg-[#F25C05] mb-4" />
            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              團購專區
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl">
              精選優質商品，團購價格優惠
            </p>
          </div>
        </section>

        {/* Tabs + Card */}
        <section className="container py-10 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">商品分類</p>
              <nav className="flex flex-col gap-2">
                {categories.map(({ id, labelKey, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = plans[id];
                  const isExpanded = expandedCategory === id;
                  const hasSubItems = subItems[id as keyof typeof subItems];

                  return (
                    <div key={id} className="flex flex-col">
                      {/* 主按鈕 */}
                      <button
                        onClick={() => {
                          setActiveId(id);
                          if (hasSubItems) {
                            setExpandedCategory(isExpanded ? null : id);
                          }
                          setLocation(`/group-buy?tab=${id}`);
                        }}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                          isActive
                            ? 'text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-100'
                        }`}
                        style={isActive ? { background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` } : {}}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {labelKey}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 ml-auto flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {/* 子項目 */}
                      {hasSubItems && isExpanded && (
                        <div className="mt-2 ml-4 flex flex-col gap-1">
                          {subItems[id as keyof typeof subItems]?.map((sub: any) => {
                            return (
                              <Link
                                key={sub.id}
                                href={sub.href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all text-gray-600 bg-white hover:bg-orange-50 hover:text-[#F25C05] border border-gray-100"
                              >
                                <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#F25C05]" />
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </aside>

            {/* Card Panel */}
            <div className="flex-1 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">選擇商品分類</h2>
                <p className="text-gray-600">請點擊左側分類選擇月餅或風扇</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
