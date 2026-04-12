import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice } from "@/data/products";
import {
  FileText, Phone, MapPin, Loader2, CheckCircle2, Clock,
  XCircle, Truck, Package, Trash2, Eye, X, ChevronDown,
  Search, Filter, Building2, ShieldAlert, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ItemImage from "@/components/ItemImage";

// ─── Status Config ───────────────────────────────────────────────────────────
const STATUSES = [
  { key: "معلق",          label: "معلق",       color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",  icon: Clock },
  { key: "تم التأكيد",   label: "مؤكد",       color: "text-blue-400 bg-blue-400/10 border-blue-400/20",        icon: CheckCircle2 },
  { key: "قيد التحضير",  label: "يُجهَّز",    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",  icon: Package },
  { key: "تم الشحن",     label: "مُشحون",     color: "text-purple-400 bg-purple-400/10 border-purple-400/20",  icon: Truck },
  { key: "تم التوصيل",   label: "مُسلَّم",    color: "text-green-400 bg-green-400/10 border-green-400/20",     icon: CheckCircle2 },
  { key: "ملغى",         label: "ملغي",       color: "text-red-400 bg-red-400/10 border-red-400/20",           icon: XCircle },
];

const getStatus = (key: string) =>
  STATUSES.find(s => s.key === key) || STATUSES[0];

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const items = useQuery(api.orders.getOrderItems, { orderId: order._id });
  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const markSafe = useMutation(api.orders.markOrderSafe);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusChange = async (status: string) => {
    setStatusLoading(true);
    try {
      await updateStatus({ id: order._id, status });
      toast.success(`تم تحديث الحالة إلى "${status}"`);
    } catch {
      toast.error("فشل تحديث الحالة");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    setDeleting(true);
    try {
      await deleteOrder({ id: order._id });
      toast.success("تم حذف الطلب بنجاح");
      onClose();
    } catch {
      toast.error("فشل حذف الطلب");
      setDeleting(false);
    }
  };

  const st = getStatus(order.status);
  const Icon = st.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <div>
              <h2 className="font-bold">طلب #{order._id.slice(-6).toUpperCase()}</h2>
              <p className="text-xs text-muted-foreground">{new Date(order._creationTime).toLocaleString("ar-DZ")}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Suspicious banner */}
          {order.isSuspicious && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm">
              <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-400 mb-1">طلب مشبوه</p>
                <p className="text-muted-foreground text-xs">{order.suspiciousReason}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs shrink-0 border-green-500/30 text-green-400 hover:bg-green-500/10"
                onClick={() => markSafe({ id: order._id }).then(() => toast.success("تم تمييزه كآمن"))}
              >
                <ShieldCheck size={13} className="ml-1" /> آمن
              </Button>
            </div>
          )}

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/20 border border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">العميل</p>
              <p className="font-bold">{order.customerFirstName} {order.customerLastName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">الهاتف</p>
              <a href={`tel:${order.phone}`} className="font-bold text-primary hover:underline flex items-center gap-1">
                <Phone size={12} /> {order.phone}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">الولاية / البلدية</p>
              <p className="text-sm font-medium flex items-center gap-1"><MapPin size={12} className="text-primary" /> {order.wilaya} - {order.commune}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">طريقة التوصيل</p>
              <p className="text-sm font-medium flex items-center gap-1">
                {order.deliveryMethod === "home" ? <><Truck size={12} className="text-primary" /> توصيل للمنزل</> : <><Building2 size={12} className="text-primary" /> مكتب التوصيل</>}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">العنوان</p>
              <p className="text-sm">{order.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground mb-2">المنتجات المطلوبة</p>
            {items === undefined ? (
              <div className="flex justify-center p-6"><Loader2 className="animate-spin text-primary" /></div>
            ) : items.map((item: any) => (
              <div key={item._id} className="flex gap-3 items-center p-3 rounded-xl bg-secondary/20 border border-border">
                <div className="w-12 h-12 rounded-lg bg-secondary/40 overflow-hidden flex items-center justify-center shrink-0">
                  {item.productImage ? (
                    <ItemImage src={item.productImage} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={18} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-primary shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="p-4 rounded-xl bg-secondary/20 border border-border space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground"><span>المجموع الفرعي</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>رسوم التوصيل</span><span>{formatPrice(order.deliveryFee)}</span></div>
            <div className="flex justify-between font-black text-base border-t border-border pt-2"><span>الإجمالي</span><span className="text-primary">{formatPrice(order.total)}</span></div>
          </div>

          {/* Change Status */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground">تغيير حالة الطلب</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map(s => {
                const SIcon = s.icon;
                const isActive = order.status === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => handleStatusChange(s.key)}
                    disabled={statusLoading}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isActive ? s.color + " border-opacity-100" : "border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <SIcon size={12} />
                    {s.label}
                    {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-current" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border shrink-0">
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            حذف الطلب
          </Button>
          <Button variant="ghost" onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminInvoices = () => {
  const orders = useQuery(api.orders.getOrders);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleQuickDelete = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    if (!confirm("حذف هذا الطلب؟")) return;
    try {
      await deleteOrder({ id });
      toast.success("تم الحذف");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const filtered = (orders ?? []).filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      !search ||
      `${o.customerFirstName} ${o.customerLastName}`.includes(search) ||
      o.phone.includes(search) ||
      o.wilaya.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">الفواتير والطلبات</h2>
              <p className="text-xs text-muted-foreground">{orders?.length ?? 0} طلب إجمالاً</p>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {STATUSES.slice(0, 3).map(s => {
              const count = (orders ?? []).filter(o => o.status === s.key).length;
              return (
                <div key={s.key} className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${s.color}`}>
                  <s.icon size={13} /> {s.label}: {count}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="ابحث بالاسم، الهاتف، الولاية..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl bg-secondary/30 border border-border outline-none focus:border-primary/50 text-sm transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-11 pr-9 pl-8 rounded-xl bg-secondary/30 border border-border outline-none focus:border-primary/50 text-sm transition-all appearance-none"
            >
              <option value="all">جميع الحالات</option>
              {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-5 text-xs font-bold text-muted-foreground">#</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">العميل</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الهاتف</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الولاية</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الإجمالي</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">التوصيل</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الحالة</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders === undefined ? (
                  <tr><td colSpan={8} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-16 text-center text-muted-foreground text-sm">لا توجد نتائج</td></tr>
                ) : filtered.map((order, i) => {
                  const st = getStatus(order.status);
                  const Icon = st.icon;
                  return (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-secondary/20 transition-colors cursor-pointer ${order.isSuspicious ? "bg-red-500/5" : ""}`}
                    >
                      <td className="p-4 text-xs text-muted-foreground font-mono">
                        #{i + 1}
                        {order.isSuspicious && <ShieldAlert size={11} className="inline text-red-400 mr-1" />}
                      </td>
                      <td className="p-4 text-sm font-semibold">{order.customerFirstName} {order.customerLastName}</td>
                      <td className="p-4 text-xs text-muted-foreground">{order.phone}</td>
                      <td className="p-4 text-xs text-muted-foreground">{order.wilaya}</td>
                      <td className="p-4 text-sm font-black text-primary">{formatPrice(order.total)}</td>
                      <td className="p-4 text-xs">
                        {order.deliveryMethod === "home"
                          ? <span className="flex items-center gap-1"><Truck size={11} className="text-primary" />منزل</span>
                          : <span className="flex items-center gap-1"><Building2 size={11} className="text-primary" />مكتب</span>}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.color}`}>
                          <Icon size={11} /> {st.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => handleQuickDelete(e, order._id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminInvoices;
