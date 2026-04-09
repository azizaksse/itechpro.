import AdminLayout from "@/components/admin/AdminLayout";
import { Settings, Bell, Shield, Globe, Palette, Phone, MessageSquare, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ADMIN_PHONE = "213772061398";

const AdminSettings = () => {
  const [phone, setPhone] = useState(ADMIN_PHONE);
  const [siteName, setSiteName] = useState("PRO PC DZ");
  const [currency, setCurrency] = useState("دج");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success("تم حفظ الإعدادات بنجاح ✔");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">الإعدادات</h2>
            <p className="text-xs text-muted-foreground">تخصيص إعدادات المتجر</p>
          </div>
        </div>

        {/* General Settings */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-primary" />
            <h3 className="font-bold text-sm">الإعدادات العامة</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">اسم المتجر</label>
              <input
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary/40 border border-border outline-none focus:border-primary/40 text-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">رمز العملة</label>
              <input
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary/40 border border-border outline-none focus:border-primary/40 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={16} className="text-primary" />
            <h3 className="font-bold text-sm">معلومات التواصل</h3>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">رقم واتساب للطلبات</label>
            <div className="flex items-center gap-2 bg-secondary/40 border border-border rounded-xl h-11 px-4">
              <MessageSquare size={14} className="text-green-400 shrink-0" />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                dir="ltr"
                className="flex-1 bg-transparent outline-none text-sm text-foreground"
                placeholder="213XXXXXXXXX"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">يجب أن يبدأ بـ 213 بدون +</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-primary" />
            <h3 className="font-bold text-sm">الإشعارات</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">إشعارات الطلبات الجديدة</p>
              <p className="text-xs text-muted-foreground mt-0.5">تلقي تنبيهات عند وصول طلبات جديدة</p>
            </div>
            <button
              onClick={() => setNotifications(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${notifications ? "bg-primary" : "bg-secondary"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${notifications ? "right-1" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-primary" />
            <h3 className="font-bold text-sm">الأمان</h3>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <Shield size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-primary">الوصول محمي</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">لوحة التحكم تعمل بدون تسجيل دخول حالياً. يمكنك تفعيل المصادقة عند الحاجة.</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl gap-2 shadow-lg shadow-primary/20"
        >
          <Save size={16} />
          حفظ الإعدادات
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
