import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { services } from '@/data/services';
import { useCart } from '@/contexts/CartContext';

export default function ServicesSection() {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (service: (typeof services)[number]) => {
    addItem(service);
    toast.success(`${service.title} 已加入購物車`);
  };

  return (
    <section id="services" className="section-spacing" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <p className="font-semibold text-lg tracking-wide" style={{ color: '#F5A623' }}>
            我們的服務
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-brand-muted flex flex-col"
              >
                {service.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white" style={{ backgroundColor: 'rgba(43, 138, 138, 0.1)', color: '#2B8A8A' }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {service.price && (
                      <span className="text-sm font-bold text-brand-secondary">
                        NT$ {service.price.toLocaleString()} 起
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300" style={{ color: '#2C3E50' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'rgba(44, 62, 80, 0.7)' }} className="leading-relaxed text-sm mb-6 flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-brand-muted mt-auto">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(service)}
                      className="text-sm font-bold flex items-center gap-2 transition-all duration-300"
                      style={{ color: '#2B8A8A' }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      加入購物車
                    </button>
                    <a
                      href="#contact"
                      className="text-sm font-bold flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                      style={{ color: '#F5A623' }}
                    >
                      了解更多
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg mb-6" style={{ color: 'rgba(44, 62, 80, 0.7)' }}>
            需要更多信息？我們的專業團隊隨時準備為您服務。
          </p>
          <button
            type="button"
            onClick={openCart}
            className="btn-secondary hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            查看購物車
          </button>
        </div>
      </div>
    </section>
  );
}
