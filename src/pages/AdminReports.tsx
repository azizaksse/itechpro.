import { useEffect, useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPrice } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "#f59e0b"];

const AdminReports = () => {
  const orders = useQuery(api.orders.getOrders);

  const stats = useMemo(() => {
    if (!orders) return null;

    // Status Data
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Wilaya Data
    const wilayaCounts: Record<string, number> = {};
    orders.forEach(o => {
      wilayaCounts[o.wilaya] = (wilayaCounts[o.wilaya] || 0) + 1;
    });
    const topWilayas = Object.entries(wilayaCounts)
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6);

    // Sales over time (Simplified: last 7 days)
    const dailyMap: Record<string, number> = {};
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    
    // Initialize last 7 days
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      dailyMap[dayName] = 0;
    }

    orders.forEach(o => {
      const d = new Date(o._creationTime);
      const dayName = days[d.getDay()];
      if (dailyMap[dayName] !== undefined) {
        dailyMap[dayName] += o.total;
      }
    });

    const dailySales = Object.entries(dailyMap).map(([date, total]) => ({ date, total }));

    return { statusData, topWilayas, dailySales };
  }, [orders]);

  if (!orders) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><span className="tech-loader" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">التقارير والإحصائيات (Convex)</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">إجمالي المبيعات حسب اليوم</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">حالات الطلبات</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats?.statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {stats?.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">أكثر الولايات طلباً</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.topWilayas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">نظرة عامة</CardTitle></CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(orders.reduce((acc, o) => acc + o.total, 0))}</p>
                  <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
