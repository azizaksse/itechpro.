import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { categories, formatPrice } from "@/data/products";
import { 
  Plus, Edit2, Trash2, Search, Package, Loader2, 
  Layers, ShoppingBag, Eye, ToggleLeft, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import ItemImage from "@/components/ItemImage";

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const products = useQuery(api.products.getProducts);
  const orders = useQuery(api.orders.getOrders);
  const removeProduct = useMutation(api.products.deleteProduct);
  const updateProductMutation = useMutation(api.products.updateProduct);
  const deleteAllMutation = useMutation(api.products.deleteAllProducts);

  const stats = useMemo(() => {
    if (!products) return { total: 0, active: 0, lowStock: 0, totalOrders: 0 };
    return {
      total: products.length,
      active: products.filter(p => p.isActive).length,
      lowStock: products.filter(p => p.stockQuantity < 5).length,
      totalOrders: orders?.length || 0,
    };
  }, [products, orders]);

  const filtered = (products || []).filter((p) => {
    const matchSearch = !search || 
      (p.nameAr || "").includes(search) || 
      (p.name || "").toLowerCase().includes(search.toLowerCase()) || 
      (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: any) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    try {
      await removeProduct({ id });
      toast.success("تم حذف المنتج بنجاح");
    } catch (e) {
      toast.error("فشل حذف المنتج");
    }
  };

  const toggleActive = async (product: any) => {
    try {
      const { _id, _creationTime, ...updateData } = product;
      await updateProductMutation({
        id: _id,
        ...updateData,
        isActive: !product.isActive,
      });
      toast.success(product.isActive ? "تم تعطيل المنتج" : "تم تفعيل المنتج");
    } catch (e) {
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`⚠️ هذا سيحذف جميع المنتجات (${products?.length || 0}). هل أنت متأكد؟`)) return;
    try {
      const count = await deleteAllMutation({});
      toast.success(`تم حذف ${count} منتج بنجاح`);
    } catch (e) {
      toast.error("فشل حذف المنتجات");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "إجمالي المنتجات", value: stats.total, icon: Package, color: "text-primary", bg: "bg-primary/10" },
            { label: "النشطة", value: stats.active, icon: Eye, color: "text-green-400", bg: "bg-green-400/10" },
            { label: "نقص المخزون", value: stats.lowStock, icon: Layers, color: "text-orange-400", bg: "bg-orange-400/10" },
            { label: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col gap-4">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                placeholder="ابحث عن اسم أو ماركة..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-2xl h-11 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-card border border-border rounded-2xl h-11 px-4 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
            >
              <option value="all">كل الأصناف</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
            </select>
          </div>
          <Button 
            variant="default" 
            className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20 gap-2 w-full md:w-auto"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={18} />
            <span>إضافة منتج جديد</span>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl h-11 px-6 border-destructive/40 text-destructive hover:bg-destructive/10 transition-all gap-2 w-full md:w-auto"
            onClick={handleDeleteAll}
            disabled={!products || products.length === 0}
          >
            <Trash2 size={16} />
            <span>حذف كل المنتجات</span>
          </Button>
        </div>

        {/* Products Table */}
        <div className="glass-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-5 text-xs font-bold text-muted-foreground">المنتج</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الفئة</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الماركة</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">السعر</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">المخزون</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الحالة</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5 font-medium">
                {products === undefined ? (
                  <tr><td colSpan={7} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                ) : filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0 border border-secondary/10 shadow-sm">
                          <ItemImage src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-bold line-clamp-1">{p.nameAr}</p>
                      </div>
                    </td>
                    <td className="p-4"><span className="text-xs px-3 py-1 bg-secondary/30 rounded-full text-muted-foreground">{categories.find(c => c.id === p.category)?.nameAr || p.category}</span></td>
                    <td className="p-4 text-xs">{p.brand}</td>
                    <td className="p-4 text-sm font-black text-primary">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.stockQuantity < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {p.stockQuantity} قطعة
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleActive(p)}
                        className={`transition-colors ${p.isActive ? "text-[#5D5FEF]" : "text-muted-foreground/30"}`}
                      >
                        {p.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditProduct(p)}
                          className="p-2 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && products !== undefined && (
            <div className="p-20 text-center">
              <Package size={48} className="mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-bold">لا توجد منتجات مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>

      <AddProductModal 
        open={showAdd} 
        onClose={() => setShowAdd(false)} 
        onProductAdded={() => {}} 
      />
      {editProduct && (
        <EditProductModal 
          open={!!editProduct} 
          product={editProduct} 
          onClose={() => setEditProduct(null)} 
          onProductUpdated={() => {}} 
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
