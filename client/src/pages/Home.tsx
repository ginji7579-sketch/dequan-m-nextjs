import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

/**
 * Home Page - Main landing page
 * Design Philosophy: Modern Business Minimalism
 * - Comprehensive showcase of company services and values
 * - Smooth scrolling between sections
 * - Professional, modern aesthetic
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
