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
  const { openCart, totalQuantity } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.services'), href: '#services', hasSub: true },
    { label: t('nav.portfolio'), href: '#portfolio', hasSub: true },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const websiteSubCategories = [
    { label: '形象網站',      href: '/website-pricing?tab=branding' },
    { label: '購物網站',      href: '/website-pricing?tab=shopping' },
    { label: '部落格網站',    href: '/website-pricing?tab=blog' },
    { label: '一頁式網站',    href: '/website-pricing?tab=onepage' },
    { label: '特殊功能網站',  href: '/website-pricing?tab=special' },
    { label: '定版式購物網站', href: '/website-pricing?tab=fixedshop' },
  ];

  const mediaMarketingSubCategories = [
    { label: '品牌整體規劃',   href: '/media-marketing-pricing?tab=brandplan' },
    { label: '產品上市規劃',   href: '/media-marketing-pricing?tab=launch' },
    { label: '明星網紅合作',   href: '/media-marketing-pricing?tab=celebrity' },
    { label: '輿論口碑操作',   href: '/media-marketing-pricing?tab=reputation' },
    { label: '社群行銷投放',   href: '/media-marketing-pricing?tab=socialads' },
    { label: '媒體採購方案',   href: '/media-marketing-pricing?tab=mediabuy' },
    { label: '募資規劃操盤',   href: '/media-marketing-pricing?tab=crowdfunding' },
    { label: '網站架設報價',   href: '/website-pricing' },
  ];

  const categories = [
    { label: '網站架設報價', href: '/website-pricing', hasSub: true, isWebsite: true },
    { label: '精準媒體行銷方案報價', href: '/media-marketing-pricing', hasSub: true, isMedia: true },
    { label: '網頁開發', href: '#services', hasSub: true },
    { label: '工業服務', href: '#services' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-brand-muted">
      <div className="bg-[#F25C05] h-1 md:h-1.5 w-full"></div>
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <a className="flex items-center gap-2 md:gap-3 transition-opacity opacity-100 hover:opacity-80">
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
            </a>
          </Link>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <nav className="hidden lg:flex items-center gap-8 mr-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-medium transition-colors duration-300"
                  style={{ color: '#2C3E50' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2B8A8A'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2C3E50'}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Switcher */}
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
                <Link href="/admin">
                  <a className="p-2 text-gray-700 hover:text-brand-primary transition-colors">
                    <UserIcon className="w-5.5 h-5.5" />
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="p-2 text-gray-700 hover:text-brand-primary transition-colors">
                    <UserIcon className="w-5.5 h-5.5" />
                  </a>
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
                    {/* Main Links */}
                    <div className="py-2">
                      {navLinks.map((link) => (
                        <div key={link.label} className="border-b border-gray-50 last:border-none">
                          {link.href.startsWith('#') ? (
                            <a
                              href={link.href}
                              className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                              onClick={(e) => {
                                setIsMenuOpen(false);
                                setTimeout(() => {
                                  const el = document.querySelector(link.href);
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }, 300);
                              }}
                            >
                              {link.label}
                              {link.hasSub && <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </a>
                          ) : (
                            <Link href={link.href}>
                              <a
                                className="flex items-center justify-between px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {link.label}
                                {link.hasSub && <ChevronDown className="w-4 h-4 text-gray-400" />}
                              </a>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Category Section */}
                    <div className="mt-4">
                      <div className="px-6 py-4">
                        <h3 className="text-2xl font-medium text-gray-400">分類</h3>
                      </div>
                      <div className="py-2">
                        {categories.map((link) => (
                          <div key={link.label} className="border-b border-gray-50 last:border-none">
                            {/* 網站架設報價：可展開 */}
                            {link.isWebsite && (
                              <>
                                <Link href={link.href}>
                                  <a
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
                                  </a>
                                </Link>
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isWebsiteExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                  }`}
                                >
                                  {websiteSubCategories.map((sub) => (
                                    <Link key={sub.label} href={sub.href}>
                                      <a
                                        className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                        {sub.label}
                                      </a>
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* 精準媒體行銷：可展開 */}
                            {link.isMedia && (
                              <>
                                <Link href={link.href}>
                                  <a
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
                                  </a>
                                </Link>
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isMediaExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                  }`}
                                >
                                  {mediaMarketingSubCategories.map((sub) => (
                                    <Link key={sub.label} href={sub.href}>
                                      <a
                                        className="flex items-center gap-2 pl-10 pr-6 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-[#F25C05] transition-colors border-t border-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 text-[#F25C05] flex-shrink-0" />
                                        {sub.label}
                                      </a>
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* 其他一般連結 */}
                            {!link.isWebsite && !link.isMedia && (
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

                    {/* Account Section */}
                    <div className="mt-4 pb-10">
                      <div className="px-6 py-4">
                        <h3 className="text-2xl font-medium text-gray-400">帳戶</h3>
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
                            <a
                              href="/admin"
                              className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              管理後台
                            </a>
                            <button
                              onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-6 py-4 text-[16px] font-medium text-red-500 hover:bg-gray-50"
                            >
                              登出帳號
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href="/login">
                              <a
                                className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                會員登入
                              </a>
                            </Link>
                            <Link href="/login">
                              <a
                                className="block px-6 py-4 text-[16px] font-medium text-gray-800 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                新用戶註冊
                              </a>
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