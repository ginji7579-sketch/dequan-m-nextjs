import { ArrowRight, ClipboardCheck, KeyRound, ScanSearch, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/services';

const serviceCards = [
  { icon: ScanSearch, title: 'security.assessment.title', description: 'security.assessment.desc' },
  { icon: KeyRound, title: 'security.access.title', description: 'security.access.desc' },
  { icon: ClipboardCheck, title: 'security.readiness.title', description: 'security.readiness.desc' },
];

const approachSteps = [
  { title: 'security.step1.title', description: 'security.step1.desc' },
  { title: 'security.step2.title', description: 'security.step2.desc' },
  { title: 'security.step3.title', description: 'security.step3.desc' },
];

export default function EnterpriseSecurityPage() {
  const { t } = useLanguage();
  const { addItem, openCart } = useCart();
  const securityService = services.find((service) => service.id === 'enterprise-security');

  const handleAddToCart = () => {
    if (!securityService) {
      toast.error('目前無法加入企業資安服務，請聯絡客服');
      return;
    }

    addItem(securityService);
    toast.success(`${securityService.title} 已加入購物車`);
    openCart();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1E8]">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white px-4 py-16 sm:py-20 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 18%, #2B8A8A 0, transparent 42%), radial-gradient(circle at 88% 78%, #F25C05 0, transparent 42%)',
            }}
            aria-hidden="true"
          />
          <div className="container relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F3F2] text-[#2B8A8A]">
              <ShieldCheck className="h-9 w-9" aria-hidden="true" />
            </div>
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-[#2B8A8A]">
              {t('security.eyebrow')}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-gray-800 sm:text-4xl md:text-5xl">
              {t('security.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
              {t('security.intro')}
            </p>
            <div className="mt-8 inline-flex flex-col items-center gap-4 rounded-2xl bg-[#F5F1E8] px-6 py-5 sm:flex-row sm:gap-7">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">{t('security.price.note')}</p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#1B4F72]">
                  NT$150,000
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#F25C05] px-6 py-3 font-bold text-white transition-colors hover:bg-[#d94f00]"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {t('security.addToCart')}
              </button>
            </div>
            <div>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2B8A8A] transition-colors hover:text-[#1B4F72]"
              >
                {t('security.cta.button')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 sm:py-18 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {serviceCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F5F0] text-[#2B8A8A]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{t(title)}</h2>
                <p className="mt-3 leading-7 text-gray-600">{t(description)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:py-18 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-extrabold text-gray-800 sm:text-3xl">
              {t('security.approach.title')}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {approachSteps.map(({ title, description }, index) => (
                <article key={title} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#2B8A8A] text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{t(title)}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{t(description)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 sm:py-18 md:py-20">
          <div className="mx-auto max-w-4xl rounded-2xl bg-[#1B4F72] px-6 py-10 text-center text-white shadow-xl sm:px-10 sm:py-14">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t('security.cta.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">{t('security.cta.desc')}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-[#1B4F72] transition-colors hover:bg-gray-100"
            >
              {t('security.cta.button')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mx-auto mt-6 max-w-3xl text-xs leading-6 text-white/70">
              {t('security.disclaimer')}
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
