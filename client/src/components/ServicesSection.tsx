import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  ChevronRight, ShoppingCart, 
  IdCard, Palette, Megaphone 
} from 'lucide-react';
import { toast } from 'sonner';
import { services } from '@/data/services';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  { id: 'business-card', labelKey: 'graphic.businesscard', icon: IdCard },
  { id: 'logo-design',   labelKey: 'graphic.logodesign',   icon: Palette },
  { id: 'ad-copy',       labelKey: 'graphic.adcopy',       icon: Megaphone },
];

const planStyles: Record<string, {
  accentFrom: string;
  accentTo: string;
  glowColor: string;
}> = {
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

export default function ServicesSection() {
  const { addItem, openCart } = useCart();
  const { t, lang } = useLanguage();
  const [activeId, setActiveId] = useState('business-card');
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && categories.some((c) => c.id === tab)) {
      setActiveId(tab);
    }
  }, []);

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
        <aside className="lg:w-56 flex-shrink-0">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 px-1">
            {t('pricing.services')}
          </p>
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(({ id, labelKey, icon: Icon }) => {
              const isActive = activeId === id;
              const colorStyle = planStyles[id];
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => {
                    setActiveId(id);
                    setLocation(`/services?tab=${id}`);
                  }}
                  className={`flex shrink-0 lg:w-full items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md scale-[1.02]'
                      : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-100'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${colorStyle.accentFrom} 0%, ${colorStyle.accentTo} 100%)` } : {}}
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
        <div className="flex-1 min-h-[400px] flex justify-center items-start">
          {activeService && (
            <div className="animate-fade-in-up w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row">
              {/* Left Side: Image */}
              {activeService.image && (
                <div className="md:w-1/2 relative min-h-[250px] md:min-h-full bg-gray-50">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Right Side: Content */}
              <div className="flex-1 p-8 flex flex-col justify-between relative bg-gradient-to-br from-[#0f2027] to-[#2c5364] text-white">
                <div className="relative z-10">
                  {/* Accent Line */}
                  <div 
                    className="h-1 w-12 rounded-full mb-4"
                    style={{ background: `linear-gradient(to right, ${style.accentFrom}, ${style.accentTo})` }}
                  />
                  
                  <h2 className="text-2xl font-bold mb-2">
                    {lang === 'en' && activeService.titleEn ? activeService.titleEn : activeService.title}
                  </h2>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {lang === 'en' && activeService.descriptionEn ? activeService.descriptionEn : activeService.description}
                  </p>
                </div>

                <div className="mt-8 space-y-4 relative z-10">
                  {/* Shopping Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${style.accentFrom} 0%, ${style.accentTo} 100%)` }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>加入購物車</span>
                  </button>

                  {/* View Cart Button */}
                  <button
                    type="button"
                    onClick={openCart}
                    className="w-full text-center py-3 rounded-xl font-bold text-gray-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/10 cursor-pointer"
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
