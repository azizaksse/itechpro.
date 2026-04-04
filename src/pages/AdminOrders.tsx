import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { ChevronDown, Eye, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "جديد", color: "bg-blue-500/20 text-blue-400" },
  confirmed: { label: "تم التأكيد", color: "bg-cyan-500/20 text-cyan-400" },
  preparing: { label: "قيد التحضير", color: "bg-yellow-500/20 text-yellow-400" },
  shipped: { label: "تم الشحن", color: "bg-purple-500/20 text-purple-400" },
  delivered: { label: "تم التوصيل", color: "bg-green-500/20 text-green-400" },
  cancelled: { label: "ملغى", color: "bg-red-500/20 text-red-400" },
};

const STATUS_OPTIONS = ["new", "confirmed", "preparing", "shipped", "delivered", "cancelled"] as const;

interface Order {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  delivery_method: string;
  office_name: string | null;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const fetchItems = async (orderId: string) => {
    if (orderItems[orderId]) return;
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    if (data) setOrderItems((prev) => ({ ...prev, [orderId]: data as OrderItem[] }));
  };

  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchItems(orderId);
    }
  };

const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: status as any })
      .eq("id", orderId);
    if (error) {
      toast.error("خطأ في تحديث الحالة");
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success("تم تحديث حالة الطلب");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) {
      toast.error("خطأ في حذف الطلب");
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("تم حذف الطلب");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      `${o.customer_first_name} ${o.customer_last_name}`.includes(search) ||
      o.phone.includes(search) ||
      o.wilaya.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>

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
                <option key={s} value={s}>{STATUS_MAP[s].label}</option>
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
                key={order.id}
                className="glass-card rounded-xl border border-border hover:border-primary/20 transition-all overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">
                        {order.customer_first_name} {order.customer_last_name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[order.status]?.color}`}>
                        {STATUS_MAP[order.status]?.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{order.phone}</span>
                      <span>{order.wilaya} - {order.commune}</span>
                      <span>{new Date(order.created_at).toLocaleDateString("ar-DZ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-sm">{formatPrice(order.total)}</span>
                    <Eye size={16} className="text-muted-foreground" />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-border p-4 space-y-4 bg-secondary/20">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">العنوان:</span> <span className="block">{order.address}</span></div>
                      <div><span className="text-muted-foreground">التوصيل:</span> <span className="block">{order.delivery_method === "home" ? "إلى المنزل" : `مكتب: ${order.office_name}`}</span></div>
                      <div><span className="text-muted-foreground">رسوم التوصيل:</span> <span className="block">{formatPrice(order.delivery_fee)}</span></div>
                    </div>

                    {/* Order Items */}
                    {orderItems[order.id] && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">المنتجات:</p>
                        {orderItems[order.id].map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-secondary/30 rounded-lg p-2">
                            {item.product_image && (
                              <img src={item.product_image} alt="" className="w-10 h-10 rounded object-cover" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(item.price)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="relative flex-1">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{STATUS_MAP[s].label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOrder(order.id)}
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

export default AdminOrders;
