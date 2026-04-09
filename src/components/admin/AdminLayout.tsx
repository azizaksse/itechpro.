import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { Search, Bell, User } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="tech-loader" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground" dir="rtl">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Top Bar */}
          <header className="h-20 flex items-center justify-between px-8 bg-transparent z-20">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">لوحة التحكم</h1>
              <div className="hidden md:flex items-center gap-2 bg-card/50 border border-border px-3 py-1.5 rounded-full">
                <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">يوم</span>
                <span className="text-[10px] bg-primary text-primary-foreground px-3 py-0.5 rounded-full shadow-md shadow-primary/20">شهر</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="بحث..."
                  className="bg-card/60 border border-border rounded-full h-10 pr-10 pl-4 text-xs focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-48 lg:w-64 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm active:scale-95">
                <Bell size={18} />
              </button>
              <div className="flex items-center gap-3 mr-2 p-1 pr-3 rounded-full bg-card border border-border shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <div className="text-left hidden lg:block">
                  <p className="text-[11px] font-bold leading-none text-foreground">مدير النظام</p>
                  <p className="text-[10px] text-muted-foreground">متصل</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xs ring-2 ring-border">
                  <User size={14} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 pt-0 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
