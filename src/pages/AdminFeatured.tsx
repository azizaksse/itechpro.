import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Star, Plus, Trash2, Loader2, ToggleLeft, ToggleRight, GripVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";
import { formatPrice } from "@/data/products";

const AdminFeatured = () => {
  const featured = useQuery(api.featuredProducts.getFeatured);
  const allProducts = useQuery(api.products.getProducts);
  const addFeatured = useMutation(api.featuredProducts.addFeatured);
  const updateFeatured = useMutation(api.featuredProducts.updateFeatured);
  const removeFeatured = useMutation(api.featuredProducts.removeFeatured);

  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  // IDs already featured
  const featuredIds = new Set((featured ?? []).map(f => f.productId));

  const handleAdd = async (product: any) => {
    const pid = product._id as string;
    setAdding(pid);
    try {
      await addFeatured({ productId: pid, order: (featured?.length ?? 0) + 1, isActive: true });
      toast.success(`تم تثبيت "${product.nameAr}" ⭐`);
    } catch { toast.error("فشلت العملية"); }
    finally { setAdding(null); setShowPicker(false); }
  };

  const handleRemove = async (id: any, name: string) => {
    if (!confirm(`إزالة "${name}" من المنتجات المميزة؟`)) return;
    try { await removeFeatured({ id }); toast.success("تمت الإزالة"); }
    catch { toast.error("فشل الحذف"); }
  };

  const handleToggle = async (item: any) => {
    try { await updateFeatured({ id: item._id, order: item.order, isActive: !item.isActive }); }
    catch { toast.error("فشل"); }
  };

  // Map featured to full product data
  const featuredWithData = (featured ?? []).map(f => {
    const product = (allProducts ?? []).find(p => (p._id as string) === f.productId);
    return { ...f, product };
  }).filter(f => f.product);

  const filteredProducts = (allProducts ?? []).filter(p =>
    !featuredIds.has(p._id as string) &&
    (p.nameAr?.includes(search) || p.brand?.includes(search))
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Star size={22} /></div>
            <div>
              <h1 className="text-2xl font-bold">المنتجات المميزة</h1>
              <p className="text-sm text-muted-foreground">تثبيت منتجات على الصفحة الرئيسية</p>
            </div>
          </div>
          <Button onClick={() => setShowPicker(true)} className="gap-2"><Plus size={16} /> إضافة منتج مميز</Button>
        </div>

        {/* Featured list */}
        {featured === undefined ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : featuredWithData.length === 0 ? (
          <div className="glass-card rounded-2xl border border-border p-16 text-center text-muted-foreground">
            <Star size={40} className="mx-auto mb-4 opacity-30" />
            <p>لا توجد منتجات مميزة بعد. أضف منتجاً!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {featuredWithData.map((item) => (
              <div key={item._id} className={`glass-card rounded-2xl border p-4 flex gap-4 items-center transition-all ${item.isActive ? "border-border" : "border-border/30 opacity-60"}`}>
                <GripVertical size={16} className="text-muted-foreground/40 shrink-0" />
                <div className="w-14 h-14 rounded-xl border border-border overflow-hidden bg-secondary/30 shrink-0">
                  <ItemImage src={item.product!.image} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{item.product!.nameAr}</p>
                  <p className="text-xs text-muted-foreground">{item.product!.brand} · {item.product!.category}</p>
                  <p className="text-sm font-black text-primary mt-0.5">{formatPrice(item.product!.price)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggle(item)} className={`transition-colors ${item.isActive ? "text-primary" : "text-muted-foreground/30"}`}>
                    {item.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                  <button onClick={() => handleRemove(item._id, item.product!.nameAr)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg flex flex-col shadow-2xl max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h2 className="font-bold">اختر منتجاً لتثبيته</h2>
              <button onClick={() => setShowPicker(false)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground">✕</button>
            </div>
            <div className="p-4 border-b border-border shrink-0">
              <div className="relative">
                <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الماركة..." className="pr-9" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">لا توجد نتائج</p>
              )}
              {filteredProducts.slice(0, 30).map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                    <ItemImage src={p.image} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                  <p className="text-sm font-black text-primary shrink-0">{formatPrice(p.price)}</p>
                  <Button size="sm" disabled={adding === (p._id as string)} onClick={() => handleAdd(p)} className="shrink-0 h-8 px-3 text-xs">
                    {adding === (p._id as string) ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    تثبيت
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFeatured;
