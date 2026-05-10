import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

// 使用 code splitting 分割大型組件
const AboutSection = lazy(() => import('@/components/AboutSection'));
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const PortfolioSection = lazy(() => import('@/components/PortfolioSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));

// 簡單的加載骨架屏
function SectionSkeleton() {
  return <div className="h-96 bg-gray-100 animate-pulse" />;
}

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
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PortfolioSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
