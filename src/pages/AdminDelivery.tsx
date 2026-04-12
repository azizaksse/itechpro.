import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Truck, Save, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wilayas as defaultWilayas } from "@/data/algerianWilayas";

const AdminDelivery = () => {
  const [rates, setRates] = useState<Record<string, { home: number; office: number }>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize from hardcoded wilaya defaults on mount
  useEffect(() => {
    const initialRates: Record<string, { home: number; office: number }> = {};
    defaultWilayas.forEach(w => {
      initialRates[w.code] = { home: w.deliveryHome, office: w.deliveryOffice };
    });
    // restore any previously saved local overrides
    const saved = localStorage.getItem("deliveryRates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(initialRates, parsed);
      } catch { /* ignore */ }
    }
    setRates(initialRates);
  }, []);

  const handlePriceChange = (code: string, type: "home" | "office", value: string) => {
    setRates(prev => ({
      ...prev,
      [code]: { ...prev[code], [type]: parseInt(value) || 0 }
    }));
  };

  const handleSave = () => {
    localStorage.setItem("deliveryRates", JSON.stringify(rates));
    toast.success("تم حفظ أسعار التوصيل بنجاح ✅");
  };

  const filteredWilayas = defaultWilayas.filter(w =>
    w.name.includes(searchTerm) || w.code.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">أسعار التوصيل</h1>
              <p className="text-sm text-muted-foreground">تعديل أسعار التوصيل لجميع الولايات (للمنزل وللمكتب)</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="gap-2 h-11 px-8 rounded-xl shadow-lg shadow-primary/20 bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30"
          >
            <Save size={18} />
            حفظ جميع التغييرات
          </Button>
        </div>

        <div className="glass-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-secondary/50 border border-secondary text-sm text-muted-foreground">
            <Info size={18} className="text-primary shrink-0" />
            <p>قم بتحديد التسعيرة لمختلف الولايات. الأسعار محفوظة محلياً وتُطبَّق فوراً في صفحة الدفع.</p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="ابحث عن ولاية بالاسم أو الرقم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md h-11 rounded-xl bg-secondary/30"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-sm">
                  <th className="py-3 px-4 font-bold">الرقم</th>
                  <th className="py-3 px-4 font-bold">الولاية</th>
                  <th className="py-3 px-4 font-bold text-center w-36">Stopdesk (DA)</th>
                  <th className="py-3 px-4 font-bold text-center w-36">Domicile (DA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredWilayas.map((w) => (
                  <tr key={w.code} className="hover:bg-secondary/10 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{w.code}</td>
                    <td className="py-3 px-4 font-bold text-sm">{w.name}</td>
                    <td className="py-3 px-4 text-center">
                      <Input
                        type="number"
                        min="0"
                        dir="ltr"
                        className="h-10 text-center font-bold"
                        value={rates[w.code]?.office ?? w.deliveryOffice}
                        onChange={(e) => handlePriceChange(w.code, "office", e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Input
                        type="number"
                        min="0"
                        dir="ltr"
                        className="h-10 text-center font-bold"
                        value={rates[w.code]?.home ?? w.deliveryHome}
                        onChange={(e) => handlePriceChange(w.code, "home", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDelivery;
