import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, ShoppingCart, X, User as UserIcon, LogOut, ChevronDown, ChevronRight, Search, Globe } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

import { useLanguage } from '@/contexts/LanguageContext';

const logoSrc = '/images/logo.jpg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWebsiteExpanded, setIsWebsiteExpanded] = useState(false);
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const [isGraphicExpanded, setIsGraphicExpanded] = useState(false);
  const { openCart, totalQuantity } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks: { label: string; href: string; hasSub?: boolean }[] = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const graphicDesignSubCategories = [
    { label: t('graphic.businesscard'), href: '/services?tab=business-card' },
    { label: t('graphic.logodesign'),   href: '/services?tab=logo-design' },
    { label: t('graphic.adcopy'),       href: '/services?tab=ad-copy' },
  ];

  const websiteSubCategories = [
    { label: t('website.branding'),      href: '/website-pricing?tab=branding' },
    { label: t('website.shopping'),      href: '/website-pricing?tab=shopping' },
    { label: t('website.blog'),          href: '/website-pricing?tab=blog' },
    { label: t('website.onepage'),       href: '/website-pricing?tab=onepage' },
    { label: t('website.special'),       href: '/website-pricing?tab=special' },
    { label: t('website.fixedshop'),     href: '/website-pricing?tab=fixedshop' },
  ];

  const mediaMarketingSubCategories = [
    { label: t('media.brandplan'),   href: '/media-marketing-pricing?tab=brandplan' },
    { label: t('media.launch'),      href: '/media-marketing-pricing?tab=launch' },
    { label: t('media.celebrity'),   href: '/media-marketing-pricing?tab=celebrity' },
    { label: t('media.reputation'),  href: '/media-marketing-pricing?tab=reputation' },
    { label: t('media.socialads'),   href: '/media-marketing-pricing?tab=socialads' },
    { label: t('media.mediabuy'),    href: '/media-marketing-pricing?tab=mediabuy' },
    { label: t('media.crowdfunding'), href: '/media-marketing-pricing?tab=crowdfunding' },
    { label: t('media.pressrelease'), href: '/media-marketing-pricing?tab=pressrelease' },
    { label: t('media.interview'),   href: '/media-marketing-pricing?tab=interview' },
    { label: t('media.publicrelations'), href: '/media-marketing-pricing?tab=publicrelations' },
    { label: t('media.integratedmarketing'), href: '/media-marketing-pricing?tab=integratedmarketing' },
    { label: t('media.grantplan'),   href: '/media-marketing-pricing?tab=grantplan' },
  ];

  const categories = [
    { label: t('nav.services'), href: '/services', hasSub: true, isGraphic: true },
    { label: t('nav.websitepricing'), href: '/website-pricing', hasSub: true, isWebsite: true },
    { label: t('nav.mediamarketing'), href: '/media-marketing-pricing', hasSub: true, isMedia: true },
  ];

  const desktopNavItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.services'), href: '/services', isGraphic: true, subItems: graphicDesignSubCategories },
    { label: t('nav.websitepricing'), href: '/website-pricing', isWebsite: true, subItems: websiteSubCategories },
    { label: t('nav.mediamarketing'), href: '/media-marketing-pricing', isMedia: true, subItems: mediaMarketingSubCategories },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-brand-muted">
      <div className="bg-[#F25C05] h-1 md:h-1.5 w-full"></div>
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 md:gap-3 transition-opacity opacity-100 hover:opacity-80">
            <img
              src={logoSrc}
              alt="德全有限公司 Logo"
              loading="eager"
              decoding="async"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-xl text-brand-primary leading-tight">德全有限公司</span>
              <span className="text-[9px] md:text-[11px] text-brand-dark leading-tight tracking-widest uppercase">DEQUAN-M CO.LTD</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8 mr-4 xl:mr-8">
              {desktopNavItems.map((item) => {
                const hasSub = item.isWebsite || item.isMedia || item.isGraphic;
                return (
                  <div key={item.label} className="relative group py-2">
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 font-medium transition-colors duration-300 py-1 text-sm xl:text-base whitespace-nowrap"
                      style={{ color: '#2C3E50' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#2B8A8A';
                        const icon = e.currentTarget.querySelector('.chevron-icon');
                        if (icon) (icon as HTMLElement).style.color = '#2B8A8A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#2C3E50';
                        const icon = e.currentTarget.querySelector('.chevron-icon');
                        if (icon) (icon as HTMLElement).style.color = '#9CA3AF';
                      }}
                    >
                      <span>{item.label}</span>
                      {hasSub && (
                        <ChevronDown className="chevron-icon w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>

                    {hasSub && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                          {item.isGraphic && item.subItems?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                              {sub.label}
                            </Link>
                          ))}

                          {item.isWebsite && item.subItems?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                              {sub.label}
                            </Link>
                          ))}

                          {item.isMedia && item.subItems?.map((sub) => {
                            if (sub.href.includes('tab=mediabuy')) {
                              return (
                                <div key={sub.label}>
                                  <Link
                                    href={sub.href}
                                    className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                    {sub.label}
                                  </Link>
                                  <Link
                                    href="/media-marketing-pricing/ad-space"
                                    className="flex items-center gap-2 pl-8 pr-4 py-2 text-[13px] text-gray-500 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                  >
                                    <ChevronRight className="w-3 h-3 text-[#F25C05] flex-shrink-0" />
                                    {t('media.adspace')}
                                  </Link>
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#1A1A1A] text-white rounded-full transition-transform hover:scale-105 active:scale-95"
                onClick={toggleLanguage}
              >
                <span className="text-[10px] md:text-xs font-bold tracking-wider">{t('lang.label')}</span>
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              <button className="p-2 text-gray-700 hover:text-brand-primary transition-colors">
                <Search className="w-5.5 h-5.5" />
              </button>

              {isAuthenticated ? (
                <Link href="/admin" className="p-2 text-gray-700 hover:text-brand-primary transition-colors">
                  <UserIcon className="w-5.5 h-5.5" />
                </Link>
              ) : (
                <Link href="/login" className="p-2 text-gray-700 hover:text-brand-primary transition-colors">
                  <UserIcon className="w-5.5 h-5.5" />
                </Link>
              )}

              <button
                className="relative p-2 text-gray-700 hover:text-brand-primary transition-colors"
                onClick={openCart}
                aria-label="開啟購物車"
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {totalQuantity > 0 && (
                  <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#F5A623] px-1 text-[10px] font-bold text-white">
                    {totalQuantity}
                  </span>
                )}
              </button>

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 text-gray-700 hover:text-brand-primary transition-colors"
                    aria-label="開啟選單"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full p-0 flex flex-col bg-white">
                  <SheetHeader className="flex flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                    <SheetClose className="p-2">
                      <ChevronDown className="w-6 h-6 text-gray-500" />
                    </SheetClose>
                    <div className="flex-1 flex justify-center items-center gap-2">
                      <img
                        src={logoSrc}
                        alt="Logo"
                        className="h-8 w-auto"
                      />
                      <SheetTitle className="text-lg font-bold">德全有限公司 DEQUAN</SheetTitle>
                    </div>
                    <SheetClose className="p-2">
                      <X className="w-6 h-6 text-gray-500" />
                    </SheetClose>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <div>
                      <div className="py-2">
                        {navLinks.filter(link => link.href !== '/contact').map((link) => (
                          <div key={link.label} className="border-b border-gray-50 last:border-none">
                            <Link
                              href={link.href}
                              className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {link.label}
                              {link.hasSub && <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </Link>
                          </div>
                        ))}
                        {categories.map((link) => (
                          <div key={link.label} className="border-b border-gray-50 last:border-none">
                            {link.isGraphic && (
                              <>
                                <Link
                                  href={link.href}
                                  className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span>{link.label}</span>
                                  <button
                                    className="p-1 -mr-1 rounded"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsGraphicExpanded(prev => !prev); }}
                                  >
                                    <ChevronDown
                                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isGraphicExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                </Link>
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isGraphicExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                  }`}
                                >
                                  {graphicDesignSubCategories.map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}

                            {link.isWebsite && (
                              <>
                                <Link
                                  href={link.href}
                                  className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span>{link.label}</span>
                                  <button
                                    className="p-1 -mr-1 rounded"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWebsiteExpanded(prev => !prev); }}
                                  >
                                    <ChevronDown
                                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isWebsiteExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                </Link>
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isWebsiteExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                  }`}
                                >
                                  {websiteSubCategories.map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}

                            {link.isMedia && (
                              <>
                                <Link
                                  href={link.href}
                                  className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span>{link.label}</span>
                                  <button
                                    className="p-1 -mr-1 rounded"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMediaExpanded(prev => !prev); }}
                                  >
                                    <ChevronDown
                                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isMediaExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                </Link>
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isMediaExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                                  }`}
                                >
                                  {/* 依照原本陣列順序渲染，但針對「媒體採購方案」額外顯示廣告版面子項 */}
                                  {mediaMarketingSubCategories.map((sub) => {
                                    if (sub.href.includes('tab=mediabuy')) {
                                      return (
                                        <div key={sub.label} className="border-t border-gray-50">
                                          <Link
                                            href={sub.href}
                                            className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                          >
                                            <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                            {sub.label}
                                          </Link>
                                          <Link
                                            href="/media-marketing-pricing/ad-space"
                                            className="flex items-center gap-2 pl-14 pr-6 py-3 text-[14px] text-gray-500 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                            onClick={() => setIsMenuOpen(false)}
                                          >
                                            <ChevronRight className="w-3 h-3 text-[#F25C05] flex-shrink-0" />
                                            {t('media.adspace')}
                                          </Link>
                                        </div>
                                      );
                                    }
                                    return (
                                      <Link
                                        key={sub.label}
                                        href={sub.href}
                                        className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                        {sub.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </>
                            )}

                            {!link.isWebsite && !link.isMedia && !link.isGraphic && (
                              <a
                                href={link.href}
                                className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {link.label}
                                {link.hasSub && <ChevronDown className="w-4 h-4 text-gray-400" />}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-b border-gray-50">
                      <Link
                        href="/contact"
                        className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.contact')}
                      </Link>
                    </div>

                    <div className="mt-4 pb-10">
                      <div className="px-6 py-4">
                        <h3 className="text-2xl font-medium text-gray-400">{t('nav.account')}</h3>
                      </div>
                      <div className="py-2">
                        {isAuthenticated ? (
                          <>
                            <div className="px-6 py-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-brand-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">{user?.displayName || user?.email}</span>
                                <span className="text-xs text-gray-500">已登入</span>
                              </div>
                            </div>
                            <Link
                              href="/admin"
                              className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {t('nav.admin')}
                            </Link>
                            <button
                              onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-6 py-4 text-[16px] font-medium text-red-500 hover:bg-gray-50"
                            >
                              {t('nav.logout')}
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {t('nav.login')}
                            </Link>
                            <Link
                              href="/login"
                              className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {t('nav.register')}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}