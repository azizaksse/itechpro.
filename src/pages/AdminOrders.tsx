import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice } from "@/data/products";
import { ChevronDown, Eye, Trash2, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  "معلق": { label: "معلق", color: "bg-blue-500/20 text-blue-400" },
  "تم التأكيد": { label: "تم التأكيد", color: "bg-cyan-500/20 text-cyan-400" },
  "قيد التحضير": { label: "قيد التحضير", color: "bg-yellow-500/20 text-yellow-400" },
  "تم الشحن": { label: "تم الشحن", color: "bg-purple-500/20 text-purple-400" },
  "تم التوصيل": { label: "تم التوصيل", color: "bg-green-500/20 text-green-400" },
  "ملغى": { label: "ملغى", color: "bg-red-500/20 text-red-400" },
  "new": { label: "جديد", color: "bg-blue-500/20 text-blue-400" },
  "confirmed": { label: "تم التأكيد", color: "bg-cyan-500/20 text-cyan-400" },
};

const STATUS_OPTIONS = ["معلق", "تم التأكيد", "قيد التحضير", "تم الشحن", "تم التوصيل", "ملغى"];

const AdminOrders = () => {
  const orders = useQuery(api.orders.getOrders);
  const updateStatusMutation = useMutation(api.orders.updateOrderStatus);
  const deleteOrderMutation = useMutation(api.orders.deleteOrder);
  const markOrderSafeMutation = useMutation(api.orders.markOrderSafe);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateStatus = async (orderId: any, status: string) => {
    try {
      await updateStatusMutation({ id: orderId, status });
      toast.success("تم تحديث حالة الطلب");
    } catch (e) {
      toast.error("فشل تحديث الحالة");
    }
  };

  const deleteOrder = async (orderId: any) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await deleteOrderMutation({ id: orderId });
      toast.success("تم حذف الطلب");
    } catch (e) {
      toast.error("فشل حذف الطلب");
    }
  };

  const markSafe = async (orderId: any) => {
    try {
      await markOrderSafeMutation({ id: orderId });
      toast.success("تم تأكيد سلامة الطلب");
    } catch (e) {
      toast.error("حدث خطأ");
    }
  };

  const filtered = (orders || []).filter((o) => {
    const matchSearch =
      !search ||
      `${o.customerFirstName} ${o.customerLastName}`.includes(search) ||
      o.phone.includes(search) ||
      o.wilaya.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSuspicious = !showSuspiciousOnly || o.isSuspicious;
    return matchSearch && matchStatus && matchSuspicious;
  });

  const suspiciousCount = (orders || []).filter((o) => o.isSuspicious).length;

  const loading = orders === undefined;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
          {suspiciousCount > 0 && (
            <button
              onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                showSuspiciousOnly
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-secondary border-border text-muted-foreground hover:border-red-500/30"
              }`}
            >
              <ShieldAlert size={14} />
              {showSuspiciousOnly ? "جميع الطلبات" : `طلبات مشبوهة (${suspiciousCount})`}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="بحث بالاسم أو الهاتف أو الولاية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm appearance-none pr-4 pl-8 focus:outline-none focus:border-primary/50 transition-all"
            >
              <option value="all">كل الحالات</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><span className="tech-loader" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد طلبات</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="glass-card rounded-xl border border-border hover:border-primary/20 transition-all overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">
                        {order.customerFirstName} {order.customerLastName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[order.status]?.color || "bg-secondary text-muted-foreground"}`}>
                        {order.status}
                      </span>
                      {order.isSuspicious && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          <ShieldAlert size={11} /> مشبوه
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{order.phone}</span>
                      <span>{order.wilaya} - {order.commune}</span>
                      <span>{new Date(order._creationTime).toLocaleDateString("ar-DZ")}</span>
                      {order.isSuspicious && order.suspiciousReason && (
                        <span className="text-red-400">⚠️ {order.suspiciousReason}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-sm">{formatPrice(order.total)}</span>
                    <Eye size={16} className={`text-muted-foreground transition-transform ${expandedOrder === order._id ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-border p-4 space-y-4 bg-secondary/20">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">العنوان:</span> <span className="block">{order.address}</span></div>
                      <div><span className="text-muted-foreground">التوصيل:</span> <span className="block">{order.deliveryMethod === "home" ? "إلى المنزل" : `مكتب: ${order.officeName}`}</span></div>
                      <div><span className="text-muted-foreground">رسوم التوصيل:</span> <span className="block">{formatPrice(order.deliveryFee)}</span></div>
                    </div>

                    {/* Order Items */}
                    <OrderItemsList orderId={order._id} />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="relative flex-1">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                      {order.isSuspicious && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markSafe(order._id)}
                          className="gap-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <ShieldCheck size={14} /> آمن
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOrder(order._id)}
                        className="gap-1"
                      >
                        <Trash2 size={14} /> حذف
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const OrderItemsList = ({ orderId }: { orderId: any }) => {
  const items = useQuery(api.orders.getOrderItems, { orderId });
  
  if (!items) return <div className="animate-pulse h-10 bg-secondary/30 rounded-lg" />;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground">المنتجات:</p>
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-3 bg-secondary/30 rounded-lg p-2">
          {item.productImage && (
            <img src={item.productImage} alt="" className="w-10 h-10 rounded object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{item.productName}</p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(item.price)} × {item.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
