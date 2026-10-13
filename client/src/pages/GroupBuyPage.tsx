import { ArrowLeft, Gift } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GroupBuyPage() {
  const { t } = useLanguage();

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
              {t('groupbuy.emptyDescription')}
            </p>
          </div>
        </section>

        <section className="container px-6 py-16 md:py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
            <Gift className="mb-5 h-10 w-10 text-brand-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">{t('groupbuy.empty')}</h2>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
