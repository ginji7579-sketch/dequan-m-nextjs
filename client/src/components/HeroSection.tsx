import { useLanguage } from '@/contexts/LanguageContext';

const BlobLogoScene = lazy(() => import('./BlobLogo'));

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663070144485/aSt5pv6mkSff6ez8cLV8EV/hero-background-oMnaxMrGRdxnRLxrxfr5gb.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // 移除 backgroundAttachment: 'fixed' - 手機效能差
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-white/85 md:bg-gradient-to-r md:from-white/95 md:to-transparent"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#2B8A8A' }}>
                {t('hero.title')}
              </h1>
            </div>

            <div className="space-y-4 text-2xl md:text-3xl font-semibold leading-relaxed max-w-lg mt-6" style={{ color: '#000000' }}>
              <p>
                {t('hero.desc')}
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center animate-fade-in">
            <Suspense fallback={<div className="w-80 h-80" />}>
              <BlobLogoScene />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
