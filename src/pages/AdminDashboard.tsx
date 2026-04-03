import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { formatPrice } from "@/data/products";
import { ShoppingCart, Clock, Package, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalSales: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: products.length,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: orders } = await supabase.from("orders").select("*");
      if (orders) {
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === "new").length,
          totalProducts: products.length,
          totalSales: orders.filter((o: any) => o.status === "delivered").reduce((sum: number, o: any) => sum + o.total, 0),
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { title: "طلبات معلقة", value: stats.pendingOrders, icon: Clock, color: "text-yellow-500" },
    { title: "إجمالي المنتجات", value: stats.totalProducts, icon: Package, color: "text-blue-500" },
    { title: "إجمالي المبيعات", value: formatPrice(stats.totalSales), icon: DollarSign, color: "text-green-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">نظرة عامة</h2>

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
