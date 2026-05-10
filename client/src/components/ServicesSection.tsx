import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { services } from '@/data/services';
import { useCart } from '@/contexts/CartContext';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ServicesSection() {
  const { addItem, openCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (service: (typeof services)[number]) => {
    addItem(service);
    toast.success(`${service.title} 已加入購物車`);
  };

  return (
    <section id="services" className="py-12 md:py-24 bg-white">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary">{t('services.title')}</h2>
          <div className="h-1.5 w-20 bg-accent mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-brand-dark/80 leading-relaxed font-medium">
            {t('services.desc')}
          </p>
        </div>

        <div className="mobile-grid-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col transition-all duration-300"
              >
                {/* Image/Icon Container */}
                <div className="relative w-full aspect-[4/5] mb-4 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Icon className="w-16 h-16 text-brand-primary opacity-40" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm md:text-base font-normal text-center mb-1 text-gray-800 leading-snug px-2 line-clamp-2 min-h-[2.5rem] flex items-center">
                    {service.title}
                  </h3>
                  
                  <p className="text-base md:text-lg font-bold text-center mb-4 text-black">
                    NT${service.price?.toLocaleString() || '---'}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(service)}
                    className="w-full max-w-[140px] bg-[#F5F5F5] py-2 md:py-3 flex justify-center items-center rounded-sm hover:bg-gray-200 transition-colors"
                    aria-label="加入購物車"
                  >
                    <ShoppingCart className="h-5 w-5 text-black" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <button
            type="button"
            onClick={openCart}
            className="px-10 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
          >
            {t('cart.view')}
          </button>
        </div>
      </div>
    </section>
  );
}
