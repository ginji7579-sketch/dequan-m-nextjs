import { CreditCard, Loader2, Mail, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0,
});

function formatPrice(price?: number, priceFrom?: boolean) {
  if (!price) return '依需求報價';
  return `${priceFrom ? '起 ' : ''}${currencyFormatter.format(price)}`;
}

export default function CartDrawer() {
  const [, setLocation] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const {
    items,
    isCartOpen,
    totalQuantity,
    fixedSubtotal,
    quoteItemCount,
    updateQuantity,
    removeItem,
    clearCart,
    setCartOpen,
  } = useCart();

  const mailBody = [
    '您好，我想詢問以下服務：',
    '',
    ...items.map((item) => {
      const subtotal = item.price
        ? `，小計${item.priceFrom ? '起 ' : ''}${currencyFormatter.format(item.price * item.quantity)}`
        : '';
      return `- ${item.title} x ${item.quantity}（${formatPrice(item.price, item.priceFrom)}${subtotal}）`;
    }),
    '',
    `固定價格小計：${currencyFormatter.format(fixedSubtotal)}`,
    quoteItemCount > 0 ? `另有 ${quoteItemCount} 個項目需進一步報價。` : '',
    '',
    '聯絡方式：',
  ].filter(Boolean).join('\n');

  const mailHref = `mailto:ginji7579@gmail.com?subject=${encodeURIComponent(
    '服務購物車詢價'
  )}&body=${encodeURIComponent(mailBody)}`;

  const handleCheckout = () => {
    setCartOpen(false);
    setLocation('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full bg-white sm:max-w-md">
        <SheetHeader className="border-b border-[#E8E6E1] px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl" style={{ color: '#2C3E50' }}>
            <ShoppingCart className="h-5 w-5" style={{ color: '#2B8A8A' }} />
            購物車
          </SheetTitle>
          <SheetDescription>
            {totalQuantity > 0 ? `目前共有 ${totalQuantity} 項服務` : '先從服務項目加入需要詢問的內容。'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F3F2]">
                <ShoppingCart className="h-8 w-8" style={{ color: '#2B8A8A' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#2C3E50' }}>
                  購物車是空的
                </p>
                <p className="mt-1 text-sm" style={{ color: 'rgba(44, 62, 80, 0.65)' }}>
                  加入服務後可以一次整理詢價內容。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-[#E8E6E1] bg-[#F5F1E8] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: '#2C3E50' }}>
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: 'rgba(44, 62, 80, 0.7)' }}>
                        {formatPrice(item.price, item.priceFrom)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      aria-label={`移除 ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-md border border-[#E8E6E1] bg-white">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        aria-label={`減少 ${item.title} 數量`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`增加 ${item.title} 數量`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#2B8A8A' }}>
                      {item.price
                        ? `${item.priceFrom ? '起 ' : ''}${currencyFormatter.format(item.price * item.quantity)}`
                        : '需報價'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-[#E8E6E1] bg-white px-6 py-5">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: 'rgba(44, 62, 80, 0.7)' }}>固定價格小計</span>
              <span className="font-bold" style={{ color: '#2C3E50' }}>
                {currencyFormatter.format(fixedSubtotal)}
              </span>
            </div>
            {quoteItemCount > 0 && (
              <p style={{ color: 'rgba(44, 62, 80, 0.7)' }}>
                含 {quoteItemCount} 個需客製報價項目，送出後會由專人回覆。
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={clearCart}
              disabled={items.length === 0}
            >
              清空
            </Button>
            {items.length === 0 ? (
              <Button type="button" disabled className="bg-[#2B8A8A] hover:bg-[#247777]">
                <Mail className="h-4 w-4" />
                送出詢價
              </Button>
            ) : (
              <Button asChild className="bg-[#2B8A8A] hover:bg-[#247777]">
                <a href={mailHref}>
                  <Mail className="h-4 w-4" />
                  送出詢價
                </a>
              </Button>
            )}
          </div>

          <Button
            type="button"
            onClick={handleCheckout}
            disabled={fixedSubtotal <= 0 || isCheckingOut}
            className="w-full bg-[#F5A623] hover:bg-[#dc941f]"
          >
            {isCheckingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {fixedSubtotal > 0 ? '線上付款' : '無固定價格項目可付款'}
          </Button>
          {fixedSubtotal > 0 && quoteItemCount > 0 && (
            <p className="text-xs" style={{ color: 'rgba(44, 62, 80, 0.65)' }}>
              線上付款只包含固定價格項目，客製報價項目請另外送出詢價。
            </p>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
