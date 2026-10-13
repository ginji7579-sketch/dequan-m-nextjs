import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  ChevronRight, ShoppingCart, 
  IdCard, Palette, Megaphone, Video 
} from 'lucide-react';
import { toast } from 'sonner';
import { services } from '@/data/services';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const videoCategory = { id: 'video-production', labelKey: 'video.production', icon: Video };

const graphicCategories = [
  { id: 'business-card', labelKey: 'graphic.businesscard', icon: IdCard },
  { id: 'logo-design',   labelKey: 'graphic.logodesign',   icon: Palette },
  { id: 'ad-copy',       labelKey: 'graphic.adcopy',       icon: Megaphone },
];

type ServicesSectionProps = {
  mode?: 'video' | 'graphic';
};

const planStyles: Record<string, {
  accentFrom: string;
  accentTo: string;
  glowColor: string;
}> = {
  'video-production': {
    accentFrom: '#F59E0B',
    accentTo: '#FCD34D',
    glowColor: '#F59E0B',
  },
  'business-card': {
    accentFrom: '#7C3AED',
    accentTo: '#A78BFA',
    glowColor: '#7C3AED',
  },
  'logo-design': {
    accentFrom: '#059669',
    accentTo: '#34D399',
    glowColor: '#059669',
  },
  'ad-copy': {
    accentFrom: '#DB2777',
    accentTo: '#F472B6',
    glowColor: '#DB2777',
  },
};

export default function ServicesSection({ mode = 'graphic' }: ServicesSectionProps) {
  const { addItem, openCart } = useCart();
  const { t, lang } = useLanguage();
  const categories = mode === 'video' ? [videoCategory] : graphicCategories;
  const [activeId, setActiveId] = useState(mode === 'video' ? videoCategory.id : 'business-card');
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && (mode === 'video' ? tab === videoCategory.id : graphicCategories.some((category) => category.id === tab))) {
      setActiveId(tab);
    } else if (mode === 'graphic' && tab === videoCategory.id) {
      setLocation('/video-production', { replace: true });
    }
  }, [mode, setLocation]);

  const activeService = services.find(s => s.id === activeId);
  const style = planStyles[activeId] || planStyles['business-card'];

  const handleAddToCart = () => {
    if (activeService) {
      addItem(activeService);
      toast.success(`${activeService.title} 已加入購物車`);
    }
  };

  return (
    <section id="services" className="container py-10 md:py-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside className="flex-shrink-0 lg:w-56">
          <p className="mb-3 hidden px-1 text-xs font-bold uppercase tracking-widest text-gray-400 lg:block">
            {t('pricing.services')}
          </p>
          <nav
            aria-label={t('pricing.services')}
            className="rounded-2xl bg-[linear-gradient(160deg,#1B4F72,#2B8A8A_60%,#2c5364)] p-4 shadow-xl sm:p-6 lg:rounded-none lg:bg-none lg:p-0 lg:shadow-none"
          >
            <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-white/70 lg:hidden">
              {t('pricing.services')}
            </p>
            <div className="flex flex-col gap-3 lg:gap-2">
            {categories.map(({ id, labelKey, icon: Icon }) => {
              const isActive = activeId === id;
              const colorStyle = planStyles[id];
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  type="button"
                  onClick={() => {
                    setActiveId(id);
                    setLocation(mode === 'video' ? '/video-production' : `/services?tab=${id}`);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-[56px] w-full items-center gap-2.5 rounded-lg border-2 border-white/90 px-4 py-3.5 text-left text-base font-bold text-white transition-all duration-200 hover:bg-white/15 active:scale-[0.98] lg:min-h-0 lg:rounded-xl lg:border lg:px-4 lg:py-3 lg:text-sm lg:font-semibold ${
                    isActive
                      ? 'shadow-md lg:scale-[1.02]'
                      : 'lg:border-gray-100 lg:bg-white lg:text-gray-600 lg:hover:bg-gray-50'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${colorStyle.accentFrom} 0%, ${colorStyle.accentTo} 100%)` } : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {t(labelKey)}
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              );
            })}
            </div>
          </nav>
        </aside>

        {/* Card Panel */}
        <div className="flex min-h-[400px] min-w-0 flex-1 items-start justify-center">
          {activeService && (
            <div className="animate-fade-in-up flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl md:flex-row">
              {/* Left Side: Image */}
              {activeService.image && (
                <div className="relative min-h-[200px] bg-gray-50 sm:min-h-[250px] md:min-h-full md:w-1/2">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Right Side: Content */}
              <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-[#0f2027] to-[#2c5364] p-5 text-white sm:p-8">
                <div className="relative z-10">
                  {/* Accent Line */}
                  <div 
                    className="h-1 w-12 rounded-full mb-4"
                    style={{ background: `linear-gradient(to right, ${style.accentFrom}, ${style.accentTo})` }}
                  />
                  
                  <h2 className="mb-2 text-2xl font-bold">
                    {lang === 'en' && activeService.titleEn ? activeService.titleEn : activeService.title}
                  </h2>
                  
                  <p className="mb-6 break-words text-sm leading-relaxed text-gray-300">
                    {lang === 'en' && activeService.descriptionEn ? activeService.descriptionEn : activeService.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                  {mode === 'video' && (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${style.accentFrom} 0%, ${style.accentTo} 100%)` }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>加入購物車</span>
                    </button>
                  )}

                  {/* View Cart Button */}
                  <button
                    type="button"
                    onClick={openCart}
                    className="min-h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-white/10 py-3 text-center font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <span>查看購物車</span>
                  </button>
                </div>

                {/* Decorative Glow */}
                <div
                  className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
                  style={{ background: style.glowColor }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
