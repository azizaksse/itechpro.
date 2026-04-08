import { useState, useEffect, useMemo } from "react";
import { categories, formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Search, Package, Loader2, Monitor, Cpu, Zap, HardDrive, CircuitBoard, Battery, Box, Fan, Laptop, Keyboard, Mouse, Headphones, Cable, Video, MonitorDot, MemoryStick, Layers, ChevronDown, ChevronUp, Usb, Wifi, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";

interface DBProduct {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  old_price: number | null;
  category: string;
  brand: string;
  image: string | null;
  images: string[] | null;
  in_stock: boolean;
  stock_quantity: number;
  is_active: boolean;
  is_new: boolean;
  is_promo: boolean;
  created_at: string;
}

const iconMap: Record<string, any> = {
  "Monitor": Monitor,
  "Laptop": Laptop,
  "Cpu": Cpu,
  "Zap": Zap,
  "MemoryStick": MemoryStick,
  "HardDrive": HardDrive,
  "CircuitBoard": CircuitBoard,
  "Battery": Battery,
  "Box": Box,
  "Fan": Fan,
  "MonitorDot": MonitorDot,
  "Keyboard": Keyboard,
  "Mouse": Mouse,
  "Headphones": Headphones,
  "Cable": Cable,
  "Video": Video,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<DBProduct | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProducts(data as unknown as DBProduct[]);
    if (error) toast.error("فشل تحميل المنتجات");
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("فشل الحذف"); return; }
    toast.success("تم حذف المنتج");
    fetchProducts();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (error) { toast.error("فشل التحديث"); return; }
    fetchProducts();
  };

  const toggleCollapse = (catId: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name_ar.includes(search) || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  // Group filtered products by category
  const groupedProducts = useMemo(() => {
    const groups: { cat: typeof categories[0]; products: DBProduct[] }[] = [];
    
    const catsToShow = filterCategory === "all" ? categories : categories.filter(c => c.id === filterCategory);
    
    catsToShow.forEach(cat => {
      const catProducts = filtered.filter(p => p.category === cat.id);
      if (catProducts.length > 0) {
        groups.push({ cat, products: catProducts });
      }
    });
    
    return groups;
  }, [filtered, filterCategory]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <Button variant="default" size="sm" className="gap-1" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> إضافة منتج
          </Button>
        </div>

        {/* Category Filter Cards */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            <button
              onClick={() => setFilterCategory("all")}
              className={`rounded-xl p-3 border transition-all duration-200 text-right group ${
                filterCategory === "all"
                  ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                  : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 ${
                filterCategory === "all" ? "bg-primary/20" : "bg-secondary"
              }`}>
                <Layers size={16} className={filterCategory === "all" ? "text-primary" : "text-muted-foreground"} />
              </div>
              <p className={`text-xs font-semibold ${filterCategory === "all" ? "text-primary" : "text-foreground"}`}>الكل</p>
              <p className="text-[10px] text-muted-foreground">{products.length} منتج</p>
            </button>

            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Package;
              const count = categoryCounts[cat.id] || 0;
              const isActive = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`rounded-xl p-3 border transition-all duration-200 text-right group ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                      : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 ${
                    isActive ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"} />
                  </div>
                  <p className={`text-xs font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}>{cat.nameAr}</p>
                  <p className="text-[10px] text-muted-foreground">{count} منتج</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="بحث بالاسم أو العلامة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Products Grouped by Category */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : groupedProducts.length > 0 ? (
          <div className="space-y-4">
            {groupedProducts.map(({ cat, products: catProducts }) => {
              const Icon = iconMap[cat.icon] || Package;
              const isCollapsed = collapsedCategories.has(cat.id);
              return (
                <div key={cat.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCollapse(cat.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-sm">{cat.nameAr}</h3>
                        <p className="text-xs text-muted-foreground">{catProducts.length} منتج</p>
                      </div>
                    </div>
                    {isCollapsed ? <ChevronDown size={18} className="text-muted-foreground" /> : <ChevronUp size={18} className="text-muted-foreground" />}
                  </button>

                  {/* Products Grid */}
                  {!isCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4 pt-0">
                      {catProducts.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-xl border border-border bg-secondary/20 hover:border-primary/30 transition-all duration-200 overflow-hidden group"
                        >
                          {/* Product Image */}
                          <div className="relative aspect-square bg-secondary/50">
                            {product.image ? (
                              <img src={product.image} alt={product.name_ar} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={32} className="text-muted-foreground/40" />
                              </div>
                            )}
                            {/* Status badges */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                              {product.is_new && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/90 text-primary-foreground">جديد</span>
                              )}
                              {product.is_promo && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white">عرض</span>
                              )}
                            </div>
                            {/* Active/Hidden indicator */}
                            <div className="absolute top-2 left-2">
                              <button
                                onClick={() => toggleActive(product.id, product.is_active)}
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                                  product.is_active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {product.is_active ? "نشط" : "مخفي"}
                              </button>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-3 space-y-2">
                            <div>
                              <p className="font-semibold text-sm truncate">{product.name_ar}</p>
                              <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                                {product.old_price && (
                                  <span className="block text-[10px] text-muted-foreground line-through">{formatPrice(product.old_price)}</span>
                                )}
                              </div>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                                product.stock_quantity > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                المخزون: {product.stock_quantity}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                                onClick={() => setEditProduct(product)}
                              >
                                <Edit2 size={12} /> تعديل
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد منتجات بعد</p>
            <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> أضف أول منتج
            </Button>
          </div>
        )}
      </div>

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} onProductAdded={fetchProducts} />
      <EditProductModal open={!!editProduct} product={editProduct} onClose={() => setEditProduct(null)} onProductUpdated={fetchProducts} />
    </AdminLayout>
  );
};

export default AdminProducts;
