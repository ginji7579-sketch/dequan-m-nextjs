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

export default function MooncakePage() {
  const { t } = useLanguage();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Find the mooncake service item to add to the cart
  const mooncakeItem = services.find((s) => s.id === 'groupbuy-mooncake');

  const handleAddToCart = () => {
    if (mooncakeItem) {
      // Add multiple times based on selected quantity
      for (let i = 0; i < quantity; i++) {
        addItem(mooncakeItem);
      }
      toast.success(`${mooncakeItem.title} 已成功加入購物車！`);
      openCart();
    } else {
      toast.error('商品資料加載錯誤，請稍後再試。');
    }
  };

  const productFeatures = [
    '嚴選頂級鹹蛋黃與高品質紐西蘭奶油，秘製流心餡料。',
    '純手工減糖配方，口感綿密絲滑，甜而不膩，老少皆宜。',
    '搭配德全限量高質感燙金禮盒包裝，附專屬手提袋，送禮尊榮大方。',
    '投保千萬食品安全責任險，安心有保障。',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow">
        {/* Banner with Mid-Autumn Theme */}
        <section 
          className="relative py-16 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4A134F 0%, #C94B4B 100%)' }}
        >
          {/* Decorative glowing moon */}
          <div className="absolute top-1/2 right-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute top-10 right-28 w-20 h-20 bg-amber-100/30 rounded-full blur-sm pointer-events-none animate-pulse" />

          <div className="container relative z-10 px-6">
            <Link href="/group-buy">
              <a className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                返回團購專區
              </a>
            </Link>
            <div className="h-1 w-12 bg-amber-400 rounded-full mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
              {mooncakeItem?.title || '特級中秋月餅禮盒'}
            </h1>
            <p className="text-amber-100 text-base md:text-lg max-w-xl">
              花好月圓，德全相伴。為您呈現極致工藝的流心月餅，讓佳節的思念更有溫度。
            </p>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="py-12 md:py-20 container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            {/* Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-gradient-to-br from-[#FAF5F5] to-[#F5EAEB] rounded-2xl overflow-hidden p-8 flex items-center justify-center border border-gray-50 aspect-square">
                <img
                  src="/images/service_mooncake.png"
                  alt="特級中秋月餅禮盒"
                  className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Info and Actions */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/50">
                  ★ 中秋限量預購中
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-3 leading-tight">
                  {mooncakeItem?.title || '特級中秋月餅禮盒'}
                </h2>
                <p className="text-gray-400 text-xs tracking-wider uppercase mt-1">Premium Mid-Autumn Mooncake Gift Box</p>
              </div>

              {/* Pricing & Group Buy Stats */}
              <div className="p-6 bg-gradient-to-br from-[#FAF5F5] to-[#FFFBFB] rounded-2xl border border-[#F5EAEB]">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-gray-500 font-medium">團購優惠價:</span>
                  <span className="text-3xl font-black text-brand-primary">
                    NT$ {mooncakeItem?.price || '880'}
                  </span>
                  <span className="text-sm text-gray-400 line-through">原價 NT$ 1,280</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span>目前已成團 (已累計 342 盒)</span>
                  </div>
                  <span>結單倒數：3 天 12 小時</span>
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
                  <span className="font-semibold text-gray-700">食安認證</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">常溫免運</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">售後無憂</span>
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
