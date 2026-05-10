import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, ShoppingCart, X, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openCart, totalQuantity } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { label: '首頁', href: '/' },
    { label: '關於我們', href: '#about' },
    { label: '服務項目', href: '#services' },
    { label: '精選作品 Showcase', href: '#portfolio' },
    { label: '聯絡我們', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-brand-muted">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <a className="flex items-center gap-3 transition-opacity opacity-100 hover:opacity-80">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663070144485/aSt5pv6mkSff6ez8cLV8EV/logo_ff0fe2ce.jpg"
                alt="德全有限公司 Logo"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-lg text-brand-primary">德全</span>
                <span className="text-xs text-brand-dark">DEQUAN-M CO.LTD</span>
              </div>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
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
            {isAuthenticated && (
              <a
                href="/admin"
                className="font-medium transition-colors duration-300"
                style={{ color: '#2C3E50' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2B8A8A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2C3E50'}
              >
                管理後台
              </a>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#2C3E50' }}>
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.displayName || user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </div>
            ) : (
              <Link href="/login">
                <a className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-[#E8E6E1]" style={{ color: '#2B8A8A', backgroundColor: '#F5F1E8' }}>
                  <UserIcon className="w-4 h-4" />
                  <span>登入 / 註冊</span>
                </a>
              </Link>
            )}

            <button
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: '#F5F1E8' }}
              onClick={openCart}
              aria-label="開啟購物車"
            >
              <ShoppingCart className="w-5 h-5" style={{ color: '#2B8A8A' }} />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F5A623] px-1 text-xs font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#F5F1E8' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" style={{ color: '#2B8A8A' }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: '#2B8A8A' }} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4" style={{ borderTop: '1px solid #E8E6E1' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 font-medium transition-colors"
                style={{ color: '#2C3E50' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F1E8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <a
                  href="/admin"
                  className="block px-4 py-3 font-medium transition-colors"
                  style={{ color: '#2C3E50' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F1E8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理後台
                </a>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-[#F5F1E8]"
                >
                  登出
                </button>
              </>
            ) : (
              <Link href="/login">
                <a
                  className="block px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2"
                  style={{ color: '#2B8A8A' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>會員登入 / 註冊</span>
                </a>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
