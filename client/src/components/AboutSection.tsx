import { Target, Layers, Heart, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  const values = [
    {
      title: t('about.value1.title'),
      description: t('about.value1.desc'),
      icon: Target,
    },
    {
      title: t('about.value2.title'),
      description: t('about.value2.desc'),
      icon: Layers,
    },
    {
      title: t('about.value3.title'),
      description: t('about.value3.desc'),
      icon: Heart,
    },
    {
      title: t('about.value4.title'),
      description: t('about.value4.desc'),
      icon: Zap,
    },
  ];

  return (
    <section id="about" className="section-spacing bg-white">
      <div className="container">
        <div>
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#2C3E50' }}>
            {t('about.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-xl transition-colors duration-300 group"
                  style={{ backgroundColor: '#F5F1E8' }}
                >
                  <Icon className="w-6 h-6 flex-shrink-0 mt-1 transition-colors" style={{ color: '#2B8A8A' }} />
                  <div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: '#2C3E50' }}>
                      {value.title}
                    </h4>
                    <p style={{ color: 'rgba(44, 62, 80, 0.7)' }} className="leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
