import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice } from "@/data/products";
import { ShoppingCart, Clock, Package, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const orders = useQuery(api.orders.getOrders);
  const products = useQuery(api.products.getProducts);

  const stats = {
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === "معلق" || o.status === "new").length || 0,
    totalProducts: products?.length || 0,
    totalSales: orders?.reduce((acc, o) => acc + o.total, 0) || 0,
  };

  const loading = orders === undefined || products === undefined;

  const cards = [
    { title: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { title: "طلبات معلقة", value: stats.pendingOrders, icon: Clock, color: "text-yellow-500" },
    { title: "إجمالي المنتجات", value: stats.totalProducts, icon: Package, color: "text-blue-500" },
    { title: "إجمالي المبيعات", value: formatPrice(stats.totalSales), icon: DollarSign, color: "text-green-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">نظرة عامة (Realtime)</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="tech-loader" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="glass-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{card.title}</span>
                  <card.icon size={20} className={card.color} />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
