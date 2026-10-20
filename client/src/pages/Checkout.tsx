import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const { items, fixedSubtotal } = useCart();
  const [, setLocation] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [discountCode, setDiscountCode] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("請填寫完整的收件資訊");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/payments/ecpay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ id, quantity })),
          recipient: formData,
        }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("付款服務目前無法使用，請聯絡客服");
      }
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof payload.message === "string" ? payload.message : "建立付款單失敗"
        );
      }

      if (
        typeof payload.action !== "string" ||
        !payload.fields ||
        typeof payload.fields !== "object"
      ) {
        throw new Error("付款服務回應格式錯誤，請稍後再試");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payload.action;
      form.style.display = "none";

      Object.entries(payload.fields as Record<string, string>).forEach(
        ([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        }
      );

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "建立付款單失敗");
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#F5F1E8]">
        <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">購物車是空的</h1>
        <Button onClick={() => setLocation("/")} className="bg-[#2B8A8A] hover:bg-[#247777]">
          回到首頁
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F5F1E8]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Side - Recipient Info */}
          <div className="bg-transparent p-6 lg:p-12">
            <h1 className="text-2xl font-bold text-[#2C3E50] mb-12">結帳收件資訊</h1>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-500">收件人姓名</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[#2C3E50] text-lg font-medium text-[#2C3E50]"
                  placeholder="請輸入姓名"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-500">聯絡電話</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[#2C3E50] text-lg font-medium text-[#2C3E50]"
                  placeholder="請輸入電話"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-500">配送地址</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[#2C3E50] text-lg font-medium text-[#2C3E50]"
                  placeholder="請輸入地址"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="bg-[#EAE6DD] p-8 rounded-sm h-fit">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-8">訂單摘要</h2>

            <div className="space-y-6 mb-8 border-b border-[#D5D1C8] pb-8">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[#2C3E50]">
                  <span className="text-sm">
                    {item.title} x {item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    {item.price ? currencyFormatter.format(item.price * item.quantity) : "需報價"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8 border-b border-[#D5D1C8] pb-8">
              <label className="text-sm text-gray-500 mb-3 block">折價券代碼</label>
              <div className="flex gap-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="輸入代碼"
                  className="bg-white border-none rounded-sm"
                />
                <Button variant="secondary" className="rounded-sm bg-gray-400 text-white hover:bg-gray-500">
                  套用
                </Button>
              </div>
            </div>

            <div className="space-y-4 mb-8 border-b border-[#D5D1C8] pb-8 text-[#2C3E50]">
              <div className="flex justify-between items-center text-sm">
                <span>小計</span>
                <span className="font-medium">{currencyFormatter.format(fixedSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>運費</span>
                <span className="font-medium">NT$ 0</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 text-[#2C3E50]">
              <span className="text-lg font-bold">總計</span>
              <span className="text-lg font-bold">{currencyFormatter.format(fixedSubtotal)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut || fixedSubtotal <= 0}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-6 text-sm font-medium rounded-sm"
            >
              {isCheckingOut ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              確認結帳並前往付款
            </Button>
            
            {fixedSubtotal <= 0 && (
              <p className="text-xs text-center mt-4 text-gray-500">
                無固定價格項目可付款
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
