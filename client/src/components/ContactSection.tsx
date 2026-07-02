import { Mail, Phone, Send, MapPin } from 'lucide-react';
import { LineIcon } from './LineIcon';
import { WeChatIcon } from './WeChatIcon';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    const form = e.target as HTMLFormElement;
    const botField = form.querySelector('input[name="_honey"]') as HTMLInputElement;
    if (botField && botField.value) {
      console.warn('Bot detected');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 使用 formsubmit.co 免費轉寄服務
      // 加入更多安全與配置參數
      await fetch('https://formsubmit.co/ajax/ginji7579@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `網站聯絡表單: ${formData.subject}`,
          _template: 'box', // 使用更好看的郵件模板
          _captcha: 'true', // 強制開啟驗證 (預設即為 true)
          ...formData
        })
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('發送失敗', error);
      alert('發生錯誤，無法發送消息。請直接點擊上方 mail 聯絡我們。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: t('contact.label.phone'),
      value: '0930137329',
      href: 'tel:0930137329',
    },
    {
      icon: Mail,
      label: 'mail',
      value: 'ginji7579@gmail.com',
      href: 'mailto:ginji7579@gmail.com',
    },
    {
      icon: LineIcon,
      label: 'line',
      value: 'ginji7579',
      href: 'https://line.me/ti/p/zz8b4pkw8C',
    },
    {
      icon: WeChatIcon,
      label: 'wechat',
      value: 'ginji7579',
      href: '#',
    },
    {
      icon: MapPin,
      label: t('contact.label.address'),
      value: '台北市信義區松德路65號11樓之2',
      href: 'https://maps.google.com/?q=台北市信義區松德路65號11樓之2',
    },
  ];

  return (
    <section id="contact" className="section-spacing bg-white">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <p className="font-semibold text-lg tracking-wide" style={{ color: '#F5A623' }}>
            {t('contact.subtitle')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2C3E50' }}>
            {t('contact.title')}
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(44, 62, 80, 0.7)' }}>
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: 'rgba(43, 138, 138, 0.1)' }}>
                      <Icon className="w-6 h-6" style={{ color: '#2B8A8A' }} />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#2C3E50' }}>{info.label}</p>
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? "_blank" : undefined}
                      rel={info.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="transition-colors"
                      style={{ color: 'rgba(44, 62, 80, 0.7)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2B8A8A'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(44, 62, 80, 0.7)'}
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              );
            })}

            <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E8E6E1' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#2C3E50' }}>{t('contact.hours')}</h4>
              <div className="space-y-2" style={{ color: 'rgba(44, 62, 80, 0.7)' }}>
                <p>{t('contact.hours.24')}</p>
                <p></p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl" style={{ backgroundColor: '#F5F1E8' }}>
              {/* Honeypot field to prevent spam */}
              <input type="text" name="_honey" style={{ display: 'none' }} />
              
              {submitted && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4', borderColor: '#DCFCE7', borderWidth: '1px' }}>
                  <p className="font-semibold" style={{ color: '#166534' }}>
                    {t('contact.form.success')}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E8E6E1', borderWidth: '1px' }}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E8E6E1', borderWidth: '1px' }}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E8E6E1', borderWidth: '1px' }}
                  placeholder={t('contact.form.phonePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E8E6E1', borderWidth: '1px' }}
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ borderColor: '#E8E6E1', borderWidth: '1px' }}
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary justify-center hover:shadow-lg transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
