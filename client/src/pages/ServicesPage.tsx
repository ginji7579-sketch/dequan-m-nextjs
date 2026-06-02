import Header from '@/components/Header';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-10">
        <ServicesSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
