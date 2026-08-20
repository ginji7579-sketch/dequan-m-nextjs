import { lazy, Suspense, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const BlobLogoScene = lazy(() => import('./BlobLogo'));

export default function HeroSection() {
  const { t } = useLanguage();

  // Generate random star positions on mount and cache them
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 2}s`,
    }));
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#090e17] bg-[url('/images/home_bg.png')] bg-no-repeat bg-right-bottom bg-contain md:bg-right-bottom md:bg-[length:auto_100%] transition-all duration-500"
    >
      {/* Dynamic star elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Dynamic gradient overlay that fades the background image beautifully into dark blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090e17]/95 via-[#090e17]/70 to-[#090e17] md:bg-gradient-to-r md:from-[#090e17] md:via-[#090e17]/85 md:to-transparent z-10 pointer-events-none"></div>

      {/* Subtle blue ambient light glow in the top-left */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#2B8A8A]/10 blur-3xl pointer-events-none z-10"></div>

      <div className="container relative z-20 py-24 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Heading and copy */}
          <div className="space-y-8 animate-fade-in-up text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-teal-200 to-teal-400 drop-shadow-[0_2px_10px_rgba(43,138,138,0.2)]">
                {t('hero.title')}
              </h1>
            </div>

            <div className="space-y-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
              <p>
                {t('hero.desc')}
              </p>
            </div>
          </div>

          {/* Right Column: Polaroid Image card + Floating interactive 3D logo */}
          <div className="flex flex-col justify-center items-center animate-fade-in relative pt-10 md:pt-0">
            {/* Ambient gold glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-amber-500/15 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>

            {/* Polaroid style glassmorphic illustration card */}
            <div className="w-full max-w-[310px] bg-white/5 backdrop-blur-md border border-white/15 p-3 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_60px_-10px_rgba(43,138,138,0.3)] transition-all duration-500 hover:-translate-y-2 animate-float relative z-20 group">
              <div className="relative overflow-hidden rounded-2xl bg-[#090e17] border border-white/10">
                <img
                  src="/images/home_bg.png"
                  alt="Cozy Starry Bear"
                  className="w-full h-auto object-cover transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Smaller floating interactive 3D companion scene */}
            <div className="absolute -bottom-8 -right-8 w-[180px] h-[180px] z-30 pointer-events-auto opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <Suspense fallback={null}>
                <BlobLogoScene className="w-full h-full" />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
