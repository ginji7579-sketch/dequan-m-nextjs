import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Check, ChevronRight, ArrowLeft,
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

const plans: Record<string, { title: string; price: string; priceNote?: string; features: string[]; accentFrom: string; accentTo: string; glowColor: string }> = {
  branding: {
    title: '形象網站',
    price: '42,000',
    features: [
      '精緻頁面排版（共 5 頁）',
      '響應式效果（電腦 + 手機 + 平板）',
      '可嵌入 Youtube 影音',
      '基本關鍵字 SEO 優化',
      'Google / Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
    ],
    accentFrom: '#F25C05',
    accentTo: '#F5A623',
    glowColor: '#2B8A8A',
  },
  shopping: {
    title: '購物網站',
    price: '68,000',
    features: [
      '精緻頁面排版',
      '響應式效果（電腦 + 手機 + 平板）',
      '可嵌入 Youtube 影音',
      '基本關鍵字 SEO 優化',
      'Google / Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
      '商品上架管理',
      '金流物流串接',
      '庫存管理',
      '促銷優惠券',
      '訂單管理',
      '銷售報表',
    ],
    accentFrom: '#1a6b3a',
    accentTo: '#2B8A8A',
    glowColor: '#1a6b3a',
  },
  blog: {
    title: '部落格網站',
    price: '34,000',
    features: [
      '精緻首頁排版',
      '響應式效果（電腦 + 手機 + 平板）',
      '可嵌入 Youtube 影音',
      '基本關鍵字 SEO 優化',
      'Google / Yahoo 搜尋登錄',
      '社群分享功能',
      '熱門點閱排行',
      '自動每日備份',
    ],
    accentFrom: '#6B21A8',
    accentTo: '#A855F7',
    glowColor: '#6B21A8',
  },
  onepage: {
    title: '一頁式網站',
    price: '16,000',
    features: [
      '精緻首頁排版',
      '響應式效果（電腦 + 手機 + 平板）',
      '可嵌入 Youtube 影音',
      '基本關鍵字 SEO 優化',
      'Google / Yahoo 搜尋登錄',
      '結合 FB 粉絲頁',
      '結合 Line 加好友',
      '結合 Google 地圖',
      '線上聯絡表單',
      '自動每日備份',
    ],
    accentFrom: '#0369A1',
    accentTo: '#38BDF8',
    glowColor: '#0369A1',
  },
  special: {
    title: '特殊功能網站',
    price: '60,000',
    priceNote: '以上，依需求報價',
    features: [
      '類型 1：課程銷售網站',
      '類型 2：房仲物件網站',
      '類型 3：聯盟推薦行銷功能',
      '類型 4：讓會員上刊資料之網站',
      '類型 5：訂房、預約功能之網站',
      '類型 6：具客戶專區功能之網站',
      '類型 7：公司內部網站（對外不公開）',
      '類型 8：多國語系之網站',
      '其它：歡迎討論',
    ],
    accentFrom: '#B45309',
    accentTo: '#F59E0B',
    glowColor: '#B45309',
  },
  fixedshop: {
    title: '定版式購物網站',
    price: '28,000',
    features: [
      '精緻頁面排版',
      '響應式效果（電腦 + 手機 + 平板）',
      '可嵌入 Youtube 影音',
      '基本關鍵字 SEO 優化',
      'Google / Yahoo 搜尋登錄',
      '結合 Google 地圖',
      '結合 FB 粉絲頁',
      '線上聯絡表單',
      '線上 FB 即時客服',
      '自動每日備份',
      '商品上架管理',
      '金流物流串接',
      '庫存管理',
      '促銷優惠券',
      '訂單管理',
      '銷售報表',
      '最新消息功能',
      '部落格功能',
      '附操作影片',
    ],
    accentFrom: '#0F766E',
    accentTo: '#2DD4BF',
    glowColor: '#0F766E',
  },
};

// ─── Shared Pricing Card ──────────────────────────────────────────────────────

function PricingCard({ planId }: { planId: string }) {
  const plan = plans[planId];
  if (!plan) return null;

  const isSpecial = planId === 'special';

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

        {/* Badge */}
        <div className="flex justify-center mt-6">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full tracking-wider border"
            style={{
              background: `${plan.accentFrom}22`,
              borderColor: `${plan.accentFrom}66`,
              color: plan.accentTo,
            }}
          >
            一次性費用
          </span>
        </div>

        {/* Title & Price */}
        <div className="text-center mt-5 px-8">
          <h2 className="text-white text-2xl font-bold mb-1">{plan.title}</h2>
          <div className="flex items-end justify-center gap-1 mt-3">
            <span className="text-lg font-semibold" style={{ color: plan.accentTo }}>$</span>
            <span className="text-white text-5xl font-extrabold tracking-tight">{plan.price}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {plan.priceNote ?? '一次付清，永久擁有'}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-8 my-6 border-t border-white/10" />

        {/* Features */}
        <ul className="px-8 pb-8 space-y-3">
          {plan.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border"
                style={{
                  background: `${plan.accentFrom}30`,
                  borderColor: plan.accentFrom,
                }}
              >
                {isSpecial ? (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: plan.accentTo }} />
                ) : (
                  <Check className="w-3 h-3" style={{ color: plan.accentTo }} />
                )}
              </span>
              <span className="text-gray-200 text-sm leading-snug">{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="px-8 pb-8">
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
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                {categories.map(({ id, label, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = plans[id];
                  return (
                    <button
                      key={id}
                      id={`tab-${id}`}
                      onClick={() => setActiveId(id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
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
