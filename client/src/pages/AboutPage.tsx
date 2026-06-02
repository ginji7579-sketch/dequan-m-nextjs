import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-10">
        <AboutSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
