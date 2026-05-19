import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, Edit3, Plus, Save, Search, Ticket, Trash2, UserPlus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type TabId = 'products' | 'coupons' | 'orders' | 'admins';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
type CouponType = 'fixed' | 'percent' | 'shipping';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
};

type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  description: string;
  expiryDate: string;
};

type Order = {
  id: string;
  createdAt: string;
  shippingInfo: { name: string; phone: string };
  items: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
};

type AdminUser = {
  id: string;
  email: string;
  addedAt: string;
};

const tabs: { id: TabId; label: string }[] = [
  { id: 'products', label: '商品管理' },
  { id: 'coupons', label: '折價券管理' },
  { id: 'orders', label: '訂單管理' },
  { id: 'admins', label: '管理員設定' },
];

const statusLabels: Record<OrderStatus, string> = {
  pending: '待處理',
  processing: '處理中',
  shipped: '已出貨',
  completed: '已完成',
  cancelled: '已取消',
};

const initialProducts: Product[] = [
  {
    id: 'prd-101',
    name: '霧白陶瓷擴香盤',
    category: 'HOME',
    price: 1280,
    desc: '手感霧面釉色，適合玄關與工作桌使用。',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'prd-102',
    name: '黑釉線香座',
    category: 'LIFESTYLE',
    price: 880,
    desc: '低調黑釉與金屬托盤，讓日常儀式更安靜。',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'prd-103',
    name: '胡桃木收納托盤',
    category: 'STORAGE',
    price: 1680,
    desc: '以天然木紋承接鑰匙、香氛與首飾。',
    image: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=300&q=80',
  },
];

const initialCoupons: Coupon[] = [
  { id: 'cpn-001', code: 'MIRU15', type: 'percent', value: 15, minOrder: 1800, description: '春季選物全館 85 折', expiryDate: '2026-06-30' },
  { id: 'cpn-002', code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 1200, description: '滿額免運活動', expiryDate: '2026-07-15' },
];

const initialOrders: Order[] = [
  {
    id: 'ord-202605190081',
    createdAt: '2026/5/19 下午 03:24',
    shippingInfo: { name: '林佳穎', phone: '0912-345-678' },
    items: 3,
    couponCode: 'MIRU15',
    total: 3264,
    status: 'processing',
  },
  {
    id: 'ord-202605180044',
    createdAt: '2026/5/18 下午 07:12',
    shippingInfo: { name: '王柏辰', phone: '0988-221-105' },
    items: 1,
    total: 1680,
    status: 'shipped',
  },
  {
    id: 'ord-202605170018',
    createdAt: '2026/5/17 上午 11:05',
    shippingInfo: { name: '陳映安', phone: '0920-771-346' },
    items: 2,
    couponCode: 'FREESHIP',
    total: 2160,
    status: 'completed',
  },
];

const initialAdmins: AdminUser[] = [
  { id: 'adm-001', email: 'owner@miru-studio.com', addedAt: '初始設定' },
  { id: 'adm-002', email: 'ops@miru-studio.com', addedAt: '2026/5/10' },
];

const emptyProduct: Product = { id: '', name: '', category: '', price: 0, desc: '', image: '' };
const emptyCoupon: Coupon = { id: '', code: '', type: 'fixed', value: 0, minOrder: 0, description: '', expiryDate: '' };

export default function Admin() {
  const { user, sessionUser } = useAuth();
  const currentEmail = user?.email || sessionUser?.email || 'demo@miru-studio.com';
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [couponForm, setCouponForm] = useState<Coupon>(emptyCoupon);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const summary = useMemo(
    () => ({
      revenue: orders.reduce((total, order) => total + order.total, 0),
      pending: orders.filter((order) => order.status === 'pending' || order.status === 'processing').length,
      products: products.length,
      coupons: coupons.length,
    }),
    [coupons.length, orders, products.length],
  );

  const openProductModal = (product?: Product) => {
    setEditingProductId(product?.id || null);
    setProductForm(product || emptyProduct);
    setIsModalOpen(true);
  };

  const openCouponModal = () => {
    setCouponForm(emptyCoupon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setProductForm(emptyProduct);
    setCouponForm(emptyCoupon);
  };

  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextProduct = { ...productForm, id: editingProductId || `prd-${Date.now()}`, price: Number(productForm.price) };
    setProducts((items) => (editingProductId ? items.map((item) => (item.id === editingProductId ? nextProduct : item)) : [nextProduct, ...items]));
    closeModal();
  };

  const saveCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCoupons((items) => [
      { ...couponForm, id: `cpn-${Date.now()}`, code: couponForm.code.toUpperCase(), value: Number(couponForm.value), minOrder: Number(couponForm.minOrder) },
      ...items,
    ]);
    closeModal();
  };

  const addAdmin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAdminEmail.trim()) return;
    setAdmins((items) => [{ id: `adm-${Date.now()}`, email: newAdminEmail.trim(), addedAt: new Date().toLocaleDateString() }, ...items]);
    setNewAdminEmail('');
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#17120e]">
      <AdminNav />
      <main>
        <div className="container max-w-6xl px-4 py-8 md:py-12 animate-fade-in">
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="本月營收" value={`NT$ ${summary.revenue.toLocaleString()}`} />
            <Metric label="待處理訂單" value={summary.pending.toString()} />
            <Metric label="上架商品" value={summary.products.toString()} />
            <Metric label="活動折價券" value={summary.coupons.toString()} />
          </div>

          <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-2 font-serif text-2xl font-normal tracking-normal md:text-3xl">後台管理中心</h2>
              <div className="mt-4 flex max-w-full gap-6 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 border-b-2 pb-1 text-[10px] tracking-[0.2em] transition-all ${
                      activeTab === tab.id ? 'border-black font-bold opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <a className="border border-black/30 px-6 py-3 text-xs font-semibold tracking-widest transition hover:bg-black hover:text-white">返回前台</a>
              </Link>
              {activeTab === 'products' && (
                <button type="button" onClick={() => openProductModal()} className="inline-flex items-center gap-2 bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-black/80">
                  <Plus size={16} />
                  新增商品
                </button>
              )}
              {activeTab === 'coupons' && (
                <button type="button" onClick={openCouponModal} className="inline-flex items-center gap-2 bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-black/80">
                  <Plus size={16} />
                  新增折價券
                </button>
              )}
            </div>
          </div>

          {activeTab === 'products' && <ProductsTable products={products} onEdit={openProductModal} onDelete={(id) => setProducts((items) => items.filter((item) => item.id !== id))} />}
          {activeTab === 'coupons' && <CouponsTable coupons={coupons} onDelete={(id) => setCoupons((items) => items.filter((item) => item.id !== id))} />}
          {activeTab === 'orders' && <OrdersTable orders={orders} onStatusUpdate={(id, status) => setOrders((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))} />}
          {activeTab === 'admins' && (
            <AdminsPanel
              admins={admins}
              currentEmail={currentEmail}
              newAdminEmail={newAdminEmail}
              setNewAdminEmail={setNewAdminEmail}
              onAddAdmin={addAdmin}
              onRemoveAdmin={(email) => setAdmins((items) => items.filter((item) => item.email !== email))}
            />
          )}
        </div>
      </main>
      <AdminFooter />

      {isModalOpen && activeTab === 'products' && (
        <ProductModal productForm={productForm} setProductForm={setProductForm} editingProductId={editingProductId} onClose={closeModal} onSubmit={saveProduct} />
      )}
      {isModalOpen && activeTab === 'coupons' && <CouponModal couponForm={couponForm} setCouponForm={setCouponForm} onClose={closeModal} onSubmit={saveCoupon} />}
    </div>
  );
}

function AdminNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/40 bg-[#fcfaf7]/80 px-6 py-4 backdrop-blur-xl md:px-12 md:py-8">
      <div className="flex items-center gap-4 md:gap-16">
        <Link href="/">
          <a className="font-serif text-xl font-bold tracking-[0.4em] md:text-2xl">M I R U .</a>
        </Link>
        <div className="hidden gap-6 text-[11px] font-medium uppercase tracking-widest opacity-60 lg:flex xl:gap-10 xl:text-[13px]">
          <Link href="/">
            <a className="transition-opacity hover:opacity-100">商店總覽</a>
          </Link>
          <a className="transition-opacity hover:opacity-100" href="#coupons">領券中心</a>
          <Link href="/admin">
            <a className="text-[#9c6f3a] transition-opacity hover:opacity-100">後台體驗 (DEMO)</a>
          </Link>
          <a className="transition-opacity hover:opacity-100" href="#about">關於卡洛特</a>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button type="button" className="hidden opacity-40 transition-opacity hover:opacity-100 md:block" aria-label="搜尋">
          <Search size={18} />
        </button>
        <button type="button" className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
          <span className="text-[13px] font-medium uppercase tracking-widest">購物車</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">0</span>
        </button>
      </div>
    </nav>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/5 bg-white/50 px-5 py-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] opacity-40">{label}</div>
      <div className="font-serif text-2xl">{value}</div>
    </div>
  );
}

function ProductsTable({ products, onEdit, onDelete }: { products: Product[]; onEdit: (product: Product) => void; onDelete: (id: string) => void }) {
  return (
    <TableShell minWidth="min-w-[680px]">
      <thead className="bg-[#f2ece4] text-[10px] uppercase tracking-widest opacity-60">
        <tr>
          <th className="px-6 py-4">圖片</th>
          <th className="px-6 py-4">名稱</th>
          <th className="px-6 py-4">分類</th>
          <th className="px-6 py-4">價格</th>
          <th className="px-6 py-4 text-right">操作</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/5">
        {products.map((product) => (
          <tr key={product.id} className="transition-colors hover:bg-black/[0.01]">
            <td className="px-6 py-4">
              <div className="h-12 w-12 overflow-hidden border border-black/5 bg-[#f2ece4]">
                <img src={product.image} alt="" className="h-full w-full object-cover" />
              </div>
            </td>
            <td className="px-6 py-4 font-serif text-sm font-bold">{product.name}</td>
            <td className="px-6 py-4 text-[10px] opacity-40">{product.category}</td>
            <td className="px-6 py-4 text-xs">NT$ {product.price.toLocaleString()}</td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => onEdit(product)} className="p-2 transition hover:bg-black/5" aria-label="編輯商品"><Edit3 size={14} /></button>
                <button type="button" onClick={() => onDelete(product.id)} className="p-2 text-red-500 transition hover:bg-red-50" aria-label="刪除商品"><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function CouponsTable({ coupons, onDelete }: { coupons: Coupon[]; onDelete: (id: string) => void }) {
  return (
    <TableShell minWidth="min-w-[640px]">
      <thead className="bg-[#f2ece4] text-[10px] uppercase tracking-widest opacity-60">
        <tr>
          <th className="px-6 py-4">代碼</th>
          <th className="px-6 py-4">類型</th>
          <th className="px-6 py-4">折扣值</th>
          <th className="px-6 py-4">最低門檻</th>
          <th className="px-6 py-4 text-right">操作</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/5">
        {coupons.map((coupon) => (
          <tr key={coupon.id} className="transition-colors hover:bg-black/[0.01]">
            <td className="px-6 py-4 text-sm font-bold uppercase tracking-widest">{coupon.code}</td>
            <td className="px-6 py-4 text-[10px] opacity-60">{couponTypeLabel(coupon.type)}</td>
            <td className="px-6 py-4 text-xs">{coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'shipping' ? '免運費' : `NT$ ${coupon.value.toLocaleString()}`}</td>
            <td className="px-6 py-4 text-xs">NT$ {coupon.minOrder.toLocaleString()}</td>
            <td className="px-6 py-4 text-right">
              <button type="button" onClick={() => onDelete(coupon.id)} className="p-2 text-red-500 opacity-60 transition hover:bg-red-50 hover:opacity-100" aria-label="刪除折價券"><Trash2 size={14} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function OrdersTable({ orders, onStatusUpdate }: { orders: Order[]; onStatusUpdate: (id: string, status: OrderStatus) => void }) {
  return (
    <TableShell minWidth="min-w-[820px]">
      <thead className="bg-[#f2ece4] text-[10px] uppercase tracking-widest opacity-60">
        <tr>
          <th className="px-6 py-4">訂單編號</th>
          <th className="px-6 py-4">時間</th>
          <th className="px-6 py-4">收件人</th>
          <th className="px-6 py-4">明細</th>
          <th className="px-6 py-4">總金額</th>
          <th className="px-6 py-4 text-right">狀態管理</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/5">
        {orders.map((order) => (
          <tr key={order.id} className="transition-colors hover:bg-black/[0.01]">
            <td className="px-6 py-4 font-mono text-xs uppercase opacity-80">#{order.id.slice(-8)}</td>
            <td className="px-6 py-4 text-[10px] opacity-60">{order.createdAt}</td>
            <td className="px-6 py-4 text-xs">{order.shippingInfo.name}<br /><span className="text-[10px] opacity-50">{order.shippingInfo.phone}</span></td>
            <td className="px-6 py-4 text-xs opacity-80">{order.items} 項商品{order.couponCode && <span className="mt-1 block text-[10px] text-[#9c6f3a]">券: {order.couponCode}</span>}</td>
            <td className="px-6 py-4 font-serif text-sm font-bold">NT$ {order.total.toLocaleString()}</td>
            <td className="px-6 py-4">
              <div className="flex justify-end">
                <select value={order.status} onChange={(event) => onStatusUpdate(order.id, event.target.value as OrderStatus)} className={`border px-3 py-1.5 text-xs outline-none ${statusClass(order.status)}`}>
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function AdminsPanel({
  admins,
  currentEmail,
  newAdminEmail,
  setNewAdminEmail,
  onAddAdmin,
  onRemoveAdmin,
}: {
  admins: AdminUser[];
  currentEmail: string | null;
  newAdminEmail: string;
  setNewAdminEmail: (email: string) => void;
  onAddAdmin: (event: FormEvent<HTMLFormElement>) => void;
  onRemoveAdmin: (email: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="border border-amber-200 bg-amber-50 p-4 md:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <h4 className="mb-1 text-sm font-bold">管理員權限說明</h4>
            <p className="text-xs leading-relaxed text-amber-800">管理員可以操作後台所有功能，包含商品管理、折價券管理、訂單狀態管理。新增管理員後，該帳號登入即可直接使用後台功能。</p>
          </div>
        </div>
      </div>

      <form onSubmit={onAddAdmin} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-[11px] uppercase tracking-widest opacity-60">新增管理員 Email</label>
          <input type="email" required placeholder="admin@example.com" value={newAdminEmail} onChange={(event) => setNewAdminEmail(event.target.value)} className="w-full border border-black/10 bg-white/80 px-4 py-2.5 text-sm outline-none" />
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-2 bg-black px-6 py-2.5 text-xs font-semibold tracking-widest text-white"><UserPlus size={14} />新增管理員</button>
      </form>

      <TableShell>
        <thead className="bg-[#f2ece4] text-[10px] uppercase tracking-widest opacity-60">
          <tr>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">新增時間</th>
            <th className="px-6 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {admins.map((admin) => (
            <tr key={admin.id} className="transition-colors hover:bg-black/[0.01]">
              <td className="px-6 py-4 text-sm font-medium">{admin.email}{admin.email === currentEmail && <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">你</span>}</td>
              <td className="px-6 py-4 text-[10px] opacity-60">{admin.addedAt}</td>
              <td className="px-6 py-4 text-right">
                {admin.email !== currentEmail ? (
                  <button type="button" onClick={() => onRemoveAdmin(admin.email)} className="p-2 text-red-500 opacity-60 transition hover:bg-red-50 hover:opacity-100" aria-label="移除管理員"><Trash2 size={14} /></button>
                ) : (
                  <span className="text-[10px] opacity-30">不可移除</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}

function ProductModal({
  productForm,
  setProductForm,
  editingProductId,
  onClose,
  onSubmit,
}: {
  productForm: Product;
  setProductForm: (product: Product) => void;
  editingProductId: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalFrame title={editingProductId ? '編輯商品' : '新增商品'} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Field label="商品名稱"><input required type="text" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} /></Field>
          <Field label="價格"><input required type="number" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={productForm.price || ''} onChange={(event) => setProductForm({ ...productForm, price: Number(event.target.value) })} /></Field>
          <Field label="分類"><input required type="text" className="w-full border-b border-black/20 bg-transparent py-2 uppercase outline-none" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} /></Field>
          <Field label="圖片 URL"><input required type="url" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} /></Field>
          <div className="col-span-2">
            <label className="mb-2 block text-[11px] uppercase tracking-widest opacity-60">商品描述</label>
            <textarea required rows={3} className="w-full border border-black/20 bg-transparent p-3 text-sm outline-none" value={productForm.desc} onChange={(event) => setProductForm({ ...productForm, desc: event.target.value })} />
          </div>
        </div>
        <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 bg-black py-4 text-sm font-semibold tracking-widest text-white"><Save size={16} />儲存商品</button>
      </form>
    </ModalFrame>
  );
}

function CouponModal({
  couponForm,
  setCouponForm,
  onClose,
  onSubmit,
}: {
  couponForm: Coupon;
  setCouponForm: (coupon: Coupon) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalFrame title="新增活動折價券" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Field label="折價券代碼 (如: DOUBLE11)"><input required type="text" className="w-full border-b border-black/20 bg-transparent py-2 uppercase outline-none" value={couponForm.code} onChange={(event) => setCouponForm({ ...couponForm, code: event.target.value })} /></Field>
          <Field label="折扣類型"><select className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={couponForm.type} onChange={(event) => setCouponForm({ ...couponForm, type: event.target.value as CouponType })}><option value="fixed">固定金額 (NT$)</option><option value="percent">百分比 (%)</option><option value="shipping">免運費</option></select></Field>
          <Field label="折扣數值"><input required type="number" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={couponForm.value || ''} onChange={(event) => setCouponForm({ ...couponForm, value: Number(event.target.value) })} /></Field>
          <Field label="最低使用門檻 (NT$)"><input required type="number" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={couponForm.minOrder || ''} onChange={(event) => setCouponForm({ ...couponForm, minOrder: Number(event.target.value) })} /></Field>
          <Field label="活動描述"><input required type="text" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={couponForm.description} onChange={(event) => setCouponForm({ ...couponForm, description: event.target.value })} /></Field>
          <Field label="失效日期"><input type="date" className="w-full border-b border-black/20 bg-transparent py-2 outline-none" value={couponForm.expiryDate} onChange={(event) => setCouponForm({ ...couponForm, expiryDate: event.target.value })} /></Field>
        </div>
        <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 bg-black py-4 text-sm font-semibold tracking-widest text-white"><Ticket size={16} />建立折價券</button>
      </form>
    </ModalFrame>
  );
}

function ModalFrame({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" aria-label="關閉視窗背景" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#f9f7f4] p-6 shadow-2xl animate-fade-in md:p-10">
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <h3 className="font-serif text-xl font-normal md:text-2xl">{title}</h3>
          <button type="button" onClick={onClose} className="opacity-40 transition hover:opacity-100" aria-label="關閉視窗"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="col-span-2 md:col-span-1">
      <label className="mb-2 block text-[11px] uppercase tracking-widest opacity-60">{label}</label>
      {children}
    </div>
  );
}

function AdminFooter() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-[#fcfaf7] pb-12 pt-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="mb-6 font-serif text-2xl font-bold tracking-[0.4em]">M I R U .</h2>
            <p className="max-w-sm text-sm font-light leading-relaxed text-black/50">探索日常物件中的美學價值。我們精選具有商業美感與生活溫度的器物，讓您的空間與生活更加精緻。</p>
          </div>
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] opacity-40">快速連結</h3>
            <ul className="flex flex-col gap-4 text-xs font-medium uppercase tracking-widest"><li>商店總覽</li><li>關於我們</li><li>管理後台</li></ul>
          </div>
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] opacity-40">聯絡資訊</h3>
            <ul className="flex flex-col gap-4 text-xs font-light tracking-widest text-black/50"><li>E. hello@miru-studio.com</li><li>T. +886 2 2345 6789</li><li>A. 台北市信義區美學路 101 號</li></ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-8 md:flex-row">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/50">© 2026 Carrot Studio. 版權所有</div>
          <div className="flex gap-8 text-[10px] font-medium uppercase tracking-[0.2em] text-black/50"><span>隱私政策</span><span>服務條款</span></div>
        </div>
      </div>
    </footer>
  );
}

function TableShell({ children, minWidth = 'min-w-[600px]' }: { children: ReactNode; minWidth?: string }) {
  return (
    <div className="overflow-x-auto border border-black/5 bg-white/50">
      <table className={`w-full text-left ${minWidth}`}>{children}</table>
    </div>
  );
}

function couponTypeLabel(type: CouponType) {
  if (type === 'fixed') return '固定金額';
  if (type === 'percent') return '百分比';
  return '免運費';
}

function statusClass(status: OrderStatus) {
  if (status === 'completed') return 'border-green-200 bg-green-50 text-green-700';
  if (status === 'cancelled') return 'border-red-200 bg-red-50 text-red-700';
  if (status === 'shipped') return 'border-blue-200 bg-blue-50 text-blue-700';
  return 'border-orange-200 bg-orange-50 text-orange-700';
}
