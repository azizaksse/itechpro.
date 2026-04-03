import { useState, useEffect } from "react";
import { categories, formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Search, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";

interface DBProduct {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  old_price: number | null;
  category: string;
  brand: string;
  image: string;
  in_stock: boolean;
  stock_quantity: number;
  is_active: boolean;
  is_new: boolean;
  is_promo: boolean;
  created_at: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<DBProduct | null>(null);

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

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name_ar.includes(search) || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <Button variant="default" size="sm" className="gap-1" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> إضافة منتج
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="بحث بالاسم أو العلامة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all"
          >
            <option value="all">كل الفئات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-right py-3 px-3 font-medium">المنتج</th>
                  <th className="text-right py-3 px-3 font-medium hidden md:table-cell">الفئة</th>
                  <th className="text-right py-3 px-3 font-medium">السعر</th>
                  <th className="text-right py-3 px-3 font-medium hidden sm:table-cell">المخزون</th>
                  <th className="text-right py-3 px-3 font-medium hidden sm:table-cell">الحالة</th>
                  <th className="text-right py-3 px-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const cat = categories.find((c) => c.id === product.category);
                  return (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Package size={16} className="text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">{product.name_ar}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell text-muted-foreground">{cat?.nameAr || product.category}</td>
                      <td className="py-3 px-3">
                        <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                        {product.old_price && (
                          <span className="block text-xs text-muted-foreground line-through">{formatPrice(product.old_price)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className={`text-xs font-medium ${product.stock_quantity > 0 ? "text-green-400" : "text-red-400"}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                            product.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {product.is_active ? "نشط" : "مخفي"}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            onClick={() => setEditProduct(product)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
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
    </AdminLayout>
  );
};

export default AdminProducts;
