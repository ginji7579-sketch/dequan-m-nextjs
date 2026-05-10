import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    'nav.home': '首頁',
    'nav.about': '關於我們',
    'nav.services': '服務項目',
    'nav.portfolio': '精選作品 Showcase',
    'nav.contact': '聯絡我們',
    'hero.title': '穩固基礎，細節致遠',
    'hero.desc': '我們在資訊破碎的時代中，不虛華、不妥協，讓每一個選擇都值得被信賴。',
    'services.title': '服務項目 Services',
    'services.desc': '德全有限公司致力於提供最專業的品牌設計與行銷推廣解決方案。我們以穩固的專業基礎與對細節的極致追求，協助您的品牌在數位時代中建立獨特的競爭優勢，讓每一個選擇都值得被信賴。',
    'cart.open': '開啟購物車',
    'cart.view': '查看目前購物車',
    'lang.label': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio Showcase',
    'nav.contact': 'Contact',
    'hero.title': 'Solid Foundation, Distant Details',
    'hero.desc': 'In an era of fragmented information, we are not flashy or compromising, making every choice worthy of trust.',
    'services.title': 'Our Services',
    'services.desc': 'DEQUAN-M CO.LTD is committed to providing the most professional brand design and marketing promotion solutions. We help your brand build unique competitive advantages in the digital age with a solid professional foundation and ultimate pursuit of detail.',
    'cart.open': 'Open Cart',
    'cart.view': 'View Cart',
    'lang.label': '中文',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
