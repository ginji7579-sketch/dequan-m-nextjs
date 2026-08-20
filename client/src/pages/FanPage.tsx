import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check, Heart, Shield, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/services';
import { toast } from 'sonner';

export default function FanPage() {
  const { t } = useLanguage();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Find the fan service item to add to the cart
  const fanItem = services.find((s) => s.id === 'groupbuy-fan');

  const handleAddToCart = () => {
    if (fanItem) {
      // Add multiple times based on selected quantity
      for (let i = 0; i < quantity; i++) {
        addItem(fanItem);
      }
      toast.success(`${fanItem.title} 已成功加入購物車！`);
      openCart();
    } else {
      toast.error('商品資料加載錯誤，請稍後再試。');
    }
  };

  const productFeatures = [
    '採用日本最新DC變頻馬達，最低僅 13dB 運轉音，比落葉還安靜。',
    '內建高精度溫度感測器，根據室內溫度自動調節風速，節能省電。',
    '支援左右 120° 與上下 90° 擺頭，搭配渦輪導流風扇，快速平衡室內溫差。',
    '支援手機 App 與語音助理遙控，附全功能磁吸式紅外線遙控器。',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F8FB]">
      <Header />

      <main className="flex-grow">
        {/* Banner with Cool Breeze Theme */}
        <section 
          className="relative py-16 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)' }}
        >
          {/* Decorative wind-like ripples */}
          <div className="absolute top-1/2 left-10 w-96 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 rotate-12" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container relative z-10 px-6">
            <Link href="/group-buy">
              <a className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                返回團購專區
              </a>
            </Link>
            <div className="h-1 w-12 bg-cyan-300 rounded-full mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
              {fanItem?.title || '智能靜音循環風扇'}
            </h1>
            <p className="text-cyan-100 text-base md:text-lg max-w-xl">
              夏日微風，極致靜音。智能控制與超靜音設計，帶給您一整天舒適自然的清爽生活。
            </p>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="py-12 md:py-20 container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            {/* Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-gradient-to-br from-[#F5FAFD] to-[#EAF4FB] rounded-2xl overflow-hidden p-8 flex items-center justify-center border border-gray-50 aspect-square">
                <img
                  src="/images/service_fan.png"
                  alt="智能靜音循環風扇"
                  className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Info and Actions */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/50">
                  ⚡ 夏季熱銷團購
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-3 leading-tight">
                  {fanItem?.title || '智能靜音循環風扇'}
                </h2>
                <p className="text-gray-400 text-xs tracking-wider uppercase mt-1">Smart Silent Air Circulation Fan</p>
              </div>

              {/* Pricing & Group Buy Stats */}
              <div className="p-6 bg-gradient-to-br from-[#F5FAFD] to-[#FAFDFF] rounded-2xl border border-[#EAF4FB]">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-gray-500 font-medium">團購優惠價:</span>
                  <span className="text-3xl font-black text-brand-primary">
                    NT$ {fanItem?.price || '1,980'}
                  </span>
                  <span className="text-sm text-gray-400 line-through">原價 NT$ 2,980</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span>已達最低團購門檻 (已售 158 台)</span>
                  </div>
                  <span>結單倒數：5 天 8 小時</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-l-4 border-brand-primary pl-2 text-base">商品特色</h3>
                <ul className="space-y-3">
                  {productFeatures.map((feature, index) => (
                    <li key={index} className="flex gap-2.5 items-start text-gray-600 text-sm md:text-base">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl border transition-colors flex items-center justify-center h-12 w-12 ${
                      isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#2B8A8A] hover:bg-[#206969] text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] text-base"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    立即搶購
                  </button>
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1.5">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">兩年保固</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">快速送達</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">七天鑑賞</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
