import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Check, ChevronRight, ArrowLeft,
  Target, Rocket, Star, MessageCircle, Share2, Tv, HandCoins, Globe,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── 行銷方案分類設定 ──────────────────────────────────────────────
const categories = [
  { id: 'brandplan',   label: '品牌整體規劃',   icon: Target },
  { id: 'launch',      label: '產品上市規劃',   icon: Rocket },
  { id: 'celebrity',   label: '明星網紅合作',   icon: Star },
  { id: 'reputation',  label: '輿論口碑操作',   icon: MessageCircle },
  { id: 'socialads',   label: '社群行銷投放',   icon: Share2 },
  { id: 'mediabuy',    label: '媒體採購方案',   icon: Tv },
  { id: 'crowdfunding',label: '募資規劃操盤',   icon: HandCoins },
];

// ─── 各方案詳細內容 ────────────────────────────────────────────────
const plans: Record<string, {
  title: string;
  price: string;
  priceNote?: string;
  features: string[];
  accentFrom: string;
  accentTo: string;
  glowColor: string;
}> = {
  brandplan: {
    title: '品牌整體規劃',
    price: '150,000',
    priceNote: '起，依規模調整',
    features: [
      '品牌策略定位與診斷',
      '品牌故事與核心價值梳理',
      'CIS 企業識別系統設計',
      '品牌形象影片腳本與製作',
      '年度行銷主軸規劃',
      '品牌曝光媒體組合建議',
    ],
    accentFrom: '#7C3AED',
    accentTo: '#A78BFA',
    glowColor: '#7C3AED',
  },
  launch: {
    title: '產品上市規劃',
    price: '120,000',
    priceNote: '起，依專案報價',
    features: [
      '市場競品分析報告',
      '產品定位與定價策略',
      '上市前導預熱活動',
      '媒體記者會規劃執行',
      '新聞稿撰寫與媒體發布',
      'KOL / KOC 試用合作',
    ],
    accentFrom: '#059669',
    accentTo: '#34D399',
    glowColor: '#059669',
  },
  celebrity: {
    title: '明星網紅合作',
    price: '200,000',
    priceNote: '起，依藝人/網紅報價',
    features: [
      '藝人代言/出席活動媒合',
      '社群網紅分層行銷規劃',
      'IG / FB / YouTube 內容置入',
      '直播帶貨專案執行',
      '品牌聯名商品企劃',
      '成效監測與輿情追蹤',
    ],
    accentFrom: '#DB2777',
    accentTo: '#F472B6',
    glowColor: '#DB2777',
  },
  reputation: {
    title: '輿論口碑操作',
    price: '80,000',
    priceNote: '起，依平台與規模計價',
    features: [
      '網路輿情監控系統建置',
      '正面口碑內容策劃與鋪設',
      '論壇/社群討論區操作',
      'Google 地標評論經營',
      '負面訊息處理與SEO壓制',
      '每月輿情分析報告',
    ],
    accentFrom: '#D97706',
    accentTo: '#FBBF24',
    glowColor: '#D97706',
  },
  socialads: {
    title: '社群行銷投放',
    price: '60,000',
    priceNote: '/月，不含廣告費',
    features: [
      'Facebook / Instagram 廣告投放',
      'LINE LAP 廣告操作',
      'TikTok 短影音廣告規劃',
      '受眾輪廓分析與再行銷',
      '素材 A/B 測試與優化',
      '每週報表與策略調整建議',
    ],
    accentFrom: '#2563EB',
    accentTo: '#60A5FA',
    glowColor: '#2563EB',
  },
  mediabuy: {
    title: '媒體採購方案',
    price: '100,000',
    priceNote: '起，不含媒體成本',
    features: [
      '電視/平面/戶外媒體策劃',
      '數位媒體聯播網投放',
      '程序化廣告購買（DSP）',
      '媒體預算分配與排程建議',
      '廣告效益追蹤與歸因',
      '結案報告與優化分析',
    ],
    accentFrom: '#0891B2',
    accentTo: '#22D3EE',
    glowColor: '#0891B2',
  },
  crowdfunding: {
    title: '募資規劃操盤',
    price: '180,000',
    priceNote: '起，含募資頁設計與代操',
    features: [
      '募資平台專案上架規劃',
      '募資前導問卷與名單收集',
      '募資影片腳本與拍攝',
      '回饋方案設計與定價策略',
      '社群募資廣告投放',
      '媒體曝光與KOL合作安排',
    ],
    accentFrom: '#B45309',
    accentTo: '#F59E0B',
    glowColor: '#B45309',
  },
};

// ─── 共用報價卡片（與網站架設頁面相同結構） ───────────────────────────
function PricingCard({ planId }: { planId: string }) {
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

        <div className="mx-8 my-6 border-t border-white/10" />

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
                <Check className="w-3 h-3" style={{ color: plan.accentTo }} />
              </span>
              <span className="text-gray-200 text-sm leading-snug">{feat}</span>
            </li>
          ))}
        </ul>

        <div className="px-8 pb-8">
          <a
            href="/#contact"
            className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${plan.accentFrom} 0%, ${plan.accentTo} 100%)` }}
          >
            立即諮詢
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
                返回首頁
              </a>
            </Link>
            <div className="h-1 w-12 rounded-full bg-[#7C3AED] mb-4" />
            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              精準媒體行銷方案報價
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl">
              品牌曝光、口碑操作、社群投放…全方位行銷服務，透明報價，彈性組合。
            </p>
          </div>
        </section>

        {/* Tabs + Card */}
        <section className="container py-10 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-64 flex-shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">服務項目</p>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                {categories.map(({ id, label, icon: Icon }) => {
                  const isActive = activeId === id;
                  const plan = plans[id];
                  const isMediaBuy = id === 'mediabuy';

                  return (
                    <div key={id} className="flex flex-col w-full">
                      {/* 主按鈕 */}
                      <button
                        onClick={() => {
                          setActiveId(id);
                          setLocation(`/media-marketing-pricing?tab=${id}`);
                        }}
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

                      {/* 如果是媒體採購方案，則在其下方渲染「廣告版面」子按鈕 */}
                      {isMediaBuy && (
                        <Link
                          href="/media-marketing-pricing/ad-space"
                          className="flex items-center gap-2.5 pl-10 pr-4 py-2 mt-1 ml-2 text-sm text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-[#F25C05] rounded-lg transition-colors border-l-2 border-gray-200"
                        >
                          <ChevronRight className="w-3 h-3 text-[#F25C05]" />
                          <span>廣告版面</span>
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