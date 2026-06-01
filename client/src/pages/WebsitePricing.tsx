import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ChevronRight, ArrowLeft,
  Globe, ShoppingCart, BookOpen, Layout, Zap, Store,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── Category Config ──────────────────────────────────────────────────────────

const categories = [
  { id: 'branding',  label: '形象網站',       icon: Globe },
  { id: 'shopping',  label: '購物網站',       icon: ShoppingCart },
  { id: 'blog',      label: '部落格網站',     icon: BookOpen },
  { id: 'onepage',   label: '一頁式網站',     icon: Layout },
  { id: 'special',   label: '特殊功能網站',   icon: Zap },
  { id: 'fixedshop', label: '定版式購物網站', icon: Store },
];

// ─── Feature Data ─────────────────────────────────────────────────────────────

const plans: Record<string, { title: string; accentFrom: string; accentTo: string; glowColor: string }> = {
  branding: {
    title: '形象網站',
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  shopping: {
    title: '購物網站',
    accentFrom: '#1a6b3a',
    accentTo: '#2B8A8A',
    glowColor: '#1a6b3a',
  },
  blog: {
    title: '部落格網站',
    accentFrom: '#6B21A8',
    accentTo: '#A855F7',
    glowColor: '#6B21A8',
  },
  onepage: {
    title: '一頁式網站',
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  special: {
    title: '特殊功能網站',
    accentFrom: '#B45309',
    accentTo: '#F59E0B',
    glowColor: '#B45309',
  },
  fixedshop: {
    title: '定版式購物網站',
    accentFrom: '#0F766E',
    accentTo: '#2DD4BF',
    glowColor: '#0F766E',
  },
};

// ─── Shared Pricing Card ──────────────────────────────────────────────────────

function PricingCard({ planId }: { planId: string }) {
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
          <h2 className="text-white text-2xl font-bold mb-1">{plan.title}</h2>
        </div>

        {/* CTA */}
        <div className="px-8 pb-8 pt-6">
          <a
            href="/#contact"
            className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
          >
            立即諮詢
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebsitePricing() {
  const [activeId, setActiveId] = useState('branding');

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
              網站架設報價
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl">
              依您的需求選擇最適合的網站方案，透明報價、專業開發、快速交件。
            </p>
          </div>
        </section>

        {/* Tabs + Card */}
        <section className="container py-10 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">服務項目</p>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map(({ id, label, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = plans[id];
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
                      {label}
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
    </div>
  );
}
