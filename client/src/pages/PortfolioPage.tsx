import Header from '@/components/Header';
import PortfolioSection from '@/components/PortfolioSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-10">
        <PortfolioSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
