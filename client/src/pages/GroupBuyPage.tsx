import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Wind } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GroupBuyPage() {
  const { t } = useLanguage();

  const items = [
    {
      id: 'groupbuy-mooncake',
      title: t('groupbuy.mooncake'),
      titleEn: 'Premium Mid-Autumn Mooncake Gift Box',
      description: '嚴選頂級食材，金黃餅皮，流心奶黃，佳節送禮首選。限時團購特惠中！',
      price: 880,
      image: '/images/service_mooncake.png',
      href: '/group-buy/mooncake',
      icon: Gift,
      color: 'from-[#4B134F] to-[#C94B4B]',
    },
    {
      id: 'groupbuy-fan',
      title: t('groupbuy.fan'),
      titleEn: 'Smart Silent Air Circulation Fan',
      description: '極致靜音、智能溫控、3D立體擺頭。夏日清涼微風，給您最舒適的體驗。',
      price: 1980,
      image: '/images/service_fan.png',
      href: '/group-buy/fan',
      icon: Wind,
      color: 'from-[#00c6ff] to-[#0072ff]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />
      
      <main className="flex-grow">
        {/* Banner */}
        <section 
          className="relative py-20 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 opacity-20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 opacity-15 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/4" />
          
          <div className="container relative z-10 px-6">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {t('pricing.backToHome')}
              </a>
            </Link>
            <div className="h-1.5 w-16 bg-[#F25C05] rounded-full mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
              {t('nav.groupbuy')}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
              德全嚴選，品質生活。為您精選高品質實用好物，透過大量採購回饋最優惠的限時團購價，讓您買得開心、用得安心。
            </p>
          </div>
        </section>

        {/* Product Cards */}
        <section className="py-16 md:py-24 container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100 hover:-translate-y-2"
                >
                  <div className={`relative h-64 md:h-72 bg-gradient-to-r ${item.color} overflow-hidden p-6 flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-auto object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/25">
                      <Icon className="w-4 h-4" />
                      <span>限時團購</span>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                            {item.title}
                          </h2>
                          <p className="text-xs text-gray-400 mt-0.5 tracking-wide uppercase font-medium">{item.titleEn}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-brand-primary">
                            NT$ {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                        {item.description}
                      </p>
                    </div>

                    <Link href={item.href}>
                      <a className="w-full inline-flex items-center justify-center gap-2 bg-[#2B8A8A] hover:bg-[#206969] text-white py-3.5 px-6 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                        查看詳情並搶購
                      </a>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
