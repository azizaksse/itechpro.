import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPrice } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "#f59e0b"];

const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  preparing: "قيد التحضير",
  shipped: "مشحون",
  delivered: "مستلم",
  cancelled: "ملغى",
};

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [topWilayas, setTopWilayas] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: orders } = await supabase.from("orders").select("*");
      if (!orders) { setLoading(false); return; }

      // Daily sales (last 7 days)
      const dailyMap: Record<string, number> = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dailyMap[key] = 0;
      }
      orders.forEach((o: any) => {
        const day = new Date(o.created_at).toISOString().split("T")[0];
        if (dailyMap[day] !== undefined) dailyMap[day] += o.total;
      });
      setDailySales(Object.entries(dailyMap).map(([date, total]) => ({
        date: new Date(date).toLocaleDateString("ar-DZ", { weekday: "short", day: "numeric" }),
        total,
      })));

      // Status distribution
      const statusMap: Record<string, number> = {};
      orders.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
      setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name: STATUS_LABELS[name] || name, value })));

      // Top wilayas
      const wilayaMap: Record<string, number> = {};
      orders.forEach((o: any) => { wilayaMap[o.wilaya] = (wilayaMap[o.wilaya] || 0) + 1; });
      setTopWilayas(
        Object.entries(wilayaMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, orders]) => ({ name, orders }))
      );

      // Monthly sales (last 6 months)
      const monthlyMap: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap[key] = 0;
      }
      orders.filter((o: any) => o.status === "delivered").forEach((o: any) => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyMap[key] !== undefined) monthlyMap[key] += o.total;
      });
      setMonthlySales(Object.entries(monthlyMap).map(([month, total]) => ({
        month: new Date(month + "-01").toLocaleDateString("ar-DZ", { month: "short" }),
        total,
      })));

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><span className="tech-loader" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">التقارير والإحصائيات</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales */}
          <Card>
            <CardHeader><CardTitle className="text-base">المبيعات اليومية (آخر 7 أيام)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader><CardTitle className="text-base">توزيع حالات الطلبات</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Sales */}
          <Card>
            <CardHeader><CardTitle className="text-base">المبيعات الشهرية (آخر 6 أشهر)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Wilayas */}
          <Card>
            <CardHeader><CardTitle className="text-base">أكثر الولايات طلباً</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topWilayas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
