import { lazy, Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const BlobLogoScene = lazy(() => import('./BlobLogo'));

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('/images/hero_bg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-white/85 md:bg-gradient-to-r md:from-white/95 md:to-transparent pointer-events-none"></div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading and copy */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: '#2B8A8A' }}>
                {t('hero.title')}
              </h1>
            </div>

            <div className="space-y-4 text-xl md:text-2xl font-semibold leading-relaxed max-w-lg mt-6" style={{ color: '#000000' }}>
              <p>
                {t('hero.desc')}
              </p>
            </div>
          </div>

          {/* Right Column: 3D Animated Blob Logo */}
          <div className="flex justify-center items-center animate-fade-in">
            <Suspense fallback={<div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px]" />}>
              <BlobLogoScene className="w-[300px] h-[300px] md:w-[480px] md:h-[480px]" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
