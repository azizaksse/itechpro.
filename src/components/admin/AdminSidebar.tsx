import { LayoutDashboard, ShoppingCart, Package, LogOut, BarChart3, Users, Settings, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "الرئيسية", url: "/admin", icon: LayoutDashboard },
  { title: "المبيعات", url: "/admin/orders", icon: ShoppingCart },
  { title: "المنتجات", url: "/admin/products", icon: Package },
  { title: "الفواتير", url: "/admin/invoices", icon: FileText },
  { title: "العملاء", url: "/admin/members", icon: Users },
  { title: "التقارير", url: "/admin/reports", icon: BarChart3 },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" side="right" className="border-l border-border bg-card">
      <SidebarContent className="bg-card">
        {/* Logo */}
        <div className="p-6 mb-2 border-b border-border/50">
          {!collapsed ? (
            <h2 className="text-xl font-black tracking-tighter text-foreground">
              PRO <span className="text-primary">PC DZ</span>
            </h2>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`h-11 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                      {!collapsed && <span className="mr-3 text-sm">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-card border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-11 px-4 rounded-xl text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="mr-3 text-sm">تسجيل الخروج</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
