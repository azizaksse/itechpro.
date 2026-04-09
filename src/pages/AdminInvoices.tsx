import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice } from "@/data/products";
import { FileText, Package, Phone, MapPin, Loader2, CheckCircle2, Clock, XCircle, Truck } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  new:       { label: "جديد",     color: "text-blue-400 bg-blue-400/10",    icon: Clock },
  confirmed: { label: "مؤكد",     color: "text-primary bg-primary/10",      icon: CheckCircle2 },
  preparing: { label: "يُجهَّز",  color: "text-orange-400 bg-orange-400/10", icon: Package },
  shipped:   { label: "مُشحون",   color: "text-purple-400 bg-purple-400/10", icon: Truck },
  delivered: { label: "مُسلَّم",  color: "text-green-400 bg-green-400/10",   icon: CheckCircle2 },
  cancelled: { label: "ملغي",     color: "text-destructive bg-destructive/10", icon: XCircle },
};

const AdminInvoices = () => {
  const orders = useQuery(api.orders.getOrders);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">الفواتير والطلبات</h2>
            <p className="text-xs text-muted-foreground">{orders?.length || 0} طلب إجمالاً</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders === undefined ? (
                  <tr><td colSpan={7} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="p-16 text-center text-muted-foreground text-sm">لا توجد فواتير بعد</td></tr>
                ) : orders.map((order, i) => {
                  const st = statusConfig[order.status] || statusConfig.new;
                  const Icon = st.icon;
                  return (
                    <tr key={order._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 text-xs text-muted-foreground font-mono">#{i + 1}</td>
                      <td className="p-4 text-sm font-semibold">{order.customerFirstName} {order.customerLastName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone size={12} />
                          {order.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          {order.wilaya} - {order.commune}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-black text-primary">{formatPrice(order.total)}</td>
                      <td className="p-4 text-xs text-muted-foreground">{order.deliveryMethod === "home" ? "توصيل للمنزل" : "مكتب التوصيل"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                          <Icon size={11} />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
