import { Mail, Phone, MapPin } from 'lucide-react';
import { LineIcon } from './LineIcon';
import { WeChatIcon } from './WeChatIcon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#2C3E50', color: 'white' }}>
      <div className="container section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#F5A623' }}>德全有限公司</h3>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>DEQUAN-M CO.LTD</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#F5A623' }}>{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <span style={{ color: '#D1D5DB' }}>0930137329</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <a href="mailto:ginji7579@gmail.com" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F5A623'} onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}>
                  ginji7579@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <LineIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <span style={{ color: '#D1D5DB' }}>ginji7579</span>
              </div>
              <div className="flex items-start gap-3">
                <WeChatIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <span style={{ color: '#D1D5DB' }}>ginji7579</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <a href="https://maps.google.com/?q=台北市信義區松德路65號11樓之2" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F5A623'} onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}>
                  台北市信義區松德路65號11樓之2
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #4B5563', paddingTop: '2rem' }}>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm" style={{ color: '#9CA3AF' }}>
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#F5A623'} onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                {t('footer.privacy')}
              </a>
              <a href="/privacy" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#F5A623'} onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
