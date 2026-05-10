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
    'services.desc': '德全有限公司致力於提供最專業的網站架設與行銷推廣解決方案。我們以穩固的專業基礎與對細節的極致追求，協助您的品牌在數位時代中建立獨特的競爭優勢，讓每一個選擇都值得被信賴。',
    'cart.open': '開啟購物車',
    'cart.view': '查看目前購物車',
    'lang.label': 'EN',
    // About Section
    'about.title': '我們的核心價值',
    'about.value1.title': '極致專注',
    'about.value1.desc': '全心投入每一個環節，以近乎苛求的標準打磨細節，交付經得起時間檢驗的成果。',
    'about.value2.title': '跨界整合',
    'about.value2.desc': '跨域思考，整合資源，為你找到更好的解法。',
    'about.value3.title': '客戶至上',
    'about.value3.desc': '以客戶需求為中心，提供量身定制的解決方案。',
    'about.value4.title': '高效透明',
    'about.value4.desc': '流程透明，溝通高效，確保每個環節都符合客戶期望。',
    // Portfolio Section
    'portfolio.subtitle': 'Featured Works',
    'portfolio.title': '精選作品 Showcase',
    'portfolio.viewDetails': '查看詳情',
    'portfolio.viewProject': '查看作品',
    'portfolio.startProject': '開啟您的專案合作',
    // Contact Section
    'contact.subtitle': '聯絡我們',
    'contact.title': '與我們取得聯繫',
    'contact.desc': '有任何問題或需要更多信息？請填寫下方表單或直接聯絡我們。',
    'contact.hours': '營業時間',
    'contact.hours.24': '24小時',
    'contact.form.name': '姓名 *',
    'contact.form.namePlaceholder': '您的姓名',
    'contact.form.email': '郵箱 *',
    'contact.form.emailPlaceholder': '您的mail',
    'contact.form.phone': '電話',
    'contact.form.phonePlaceholder': '您的電話',
    'contact.form.subject': '主題 *',
    'contact.form.subjectPlaceholder': '消息主題',
    'contact.form.message': '消息 *',
    'contact.form.messagePlaceholder': '請輸入您的消息',
    'contact.form.submit': '發送消息',
    'contact.form.submitting': '發送中...',
    'contact.form.success': '感謝您的消息！我們將盡快回覆您。',
    'contact.label.phone': '電話',
    'contact.label.address': '地址',
    // Footer Section
    'footer.links': '快速連結',
    'footer.contact': '聯絡方式',
    'footer.copyright': '© 德全有限公司 (DEQUAN-M CO.LTD). 版權所有。',
    'footer.privacy': '隱私政策',
    'footer.terms': '服務條款',
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
    'services.desc': 'DEQUAN-M CO.LTD is committed to providing the most professional website setup and marketing promotion solutions. We help your brand build unique competitive advantages in the digital age with a solid professional foundation and ultimate pursuit of detail.',
    'cart.open': 'Open Cart',
    'cart.view': 'View Cart',
    'lang.label': '中文',
    // About Section
    'about.title': 'Our Core Values',
    'about.value1.title': 'Ultimate Focus',
    'about.value1.desc': 'Fully committed to every detail, polishing with exacting standards to deliver results that stand the test of time.',
    'about.value2.title': 'Cross-Integration',
    'about.value2.desc': 'Thinking across domains and integrating resources to find better solutions for you.',
    'about.value3.title': 'Customer First',
    'about.value3.desc': 'Centering on customer needs to provide tailor-made solutions.',
    'about.value4.title': 'Efficiency & Transparency',
    'about.value4.desc': 'Transparent processes and efficient communication to ensure every step meets expectations.',
    // Portfolio Section
    'portfolio.subtitle': 'Featured Works',
    'portfolio.title': 'Portfolio Showcase',
    'portfolio.viewDetails': 'View Details',
    'portfolio.viewProject': 'View Project',
    'portfolio.startProject': 'Start Your Project',
    // Contact Section
    'contact.subtitle': 'Contact Us',
    'contact.title': 'Get In Touch',
    'contact.desc': 'Have any questions or need more information? Fill out the form below or contact us directly.',
    'contact.hours': 'Business Hours',
    'contact.hours.24': '24 Hours',
    'contact.form.name': 'Name *',
    'contact.form.namePlaceholder': 'Your Name',
    'contact.form.email': 'Email *',
    'contact.form.emailPlaceholder': 'Your Email',
    'contact.form.phone': 'Phone',
    'contact.form.phonePlaceholder': 'Your Phone',
    'contact.form.subject': 'Subject *',
    'contact.form.subjectPlaceholder': 'Message Subject',
    'contact.form.message': 'Message *',
    'contact.form.messagePlaceholder': 'Enter your message',
    'contact.form.submit': 'Send Message',
    'contact.form.submitting': 'Sending...',
    'contact.form.success': 'Thank you for your message! We will get back to you soon.',
    'contact.label.phone': 'Phone',
    'contact.label.address': 'Address',
    // Footer Section
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.copyright': '© DEQUAN-M CO.LTD. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
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
