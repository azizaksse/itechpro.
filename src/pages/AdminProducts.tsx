import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { categories, formatPrice } from "@/data/products";
import {
  Plus, Edit2, Trash2, Search, Package, Loader2,
  Layers, ShoppingBag, Eye, ToggleLeft, ToggleRight, PackageSearch, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import ItemImage from "@/components/ItemImage";

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const products = useQuery(api.products.getProducts);
  const orders = useQuery(api.orders.getOrders);
  const removeProduct = useMutation(api.products.deleteProduct);
  const updateProductMutation = useMutation(api.products.updateProduct);
  const deleteAllMutation = useMutation(api.products.deleteAllProducts);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = search.trim().toLowerCase();

  // Helper: does a product match the search query?
  const matchesSearch = (p: any) => {
    if (!q) return true;
    return (
      (p.nameAr || "").toLowerCase().includes(q) ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );
  };

  // Live dropdown — max 6 results
  const liveResults = useMemo(() => {
    if (!q || !products) return [];
    return products.filter(matchesSearch).slice(0, 6);
  }, [q, products]);

  // Table — filtered by search + category
  const filtered = useMemo(() => {
    return (products || []).filter((p) => {
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      return matchesSearch(p) && matchCat;
    });
  }, [q, filterCategory, products]);

  const stats = useMemo(() => {
    if (!products) return { total: 0, active: 0, lowStock: 0, totalOrders: 0 };
    return {
      total: products.length,
      active: products.filter((p) => p.isActive).length,
      lowStock: products.filter((p) => p.stockQuantity < 5).length,
      totalOrders: orders?.length || 0,
    };
  }, [products, orders]);

  const handleDelete = async (id: any) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    try {
      await removeProduct({ id });
      toast.success("تم حذف المنتج بنجاح");
    } catch {
      toast.error("فشل حذف المنتج");
    }
  };

  const toggleActive = async (product: any) => {
    try {
      const { _id, _creationTime, ...updateData } = product;
      await updateProductMutation({ id: _id, ...updateData, isActive: !product.isActive });
      toast.success(product.isActive ? "تم تعطيل المنتج" : "تم تفعيل المنتج");
    } catch {
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`⚠️ هذا سيحذف جميع المنتجات (${products?.length || 0}). هل أنت متأكد؟`)) return;
    try {
      const count = await deleteAllMutation({});
      toast.success(`تم حذف ${count} منتج بنجاح`);
    } catch {
      toast.error("فشل حذف المنتجات");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
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

            {/* ── Live Search ── */}
            <div ref={searchWrapperRef} className="relative flex-1 md:w-80">
              {/* Input */}
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <input
                ref={inputRef}
                placeholder="ابحث عن اسم أو ماركة أو فئة..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="w-full bg-card border border-border rounded-2xl h-11 pr-10 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
              {/* Clear button */}
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              )}

              {/* ── Live Dropdown ── */}
              {dropdownOpen && search.trim().length > 0 && (
                <div
                  className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden shadow-2xl z-50 border"
                  style={{ background: "hsl(0 0% 8%)", borderColor: "hsla(0,0%,100%,0.1)" }}
                >
                  {liveResults.length > 0 ? (
                    <>
                      {/* Header */}
                      <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "hsla(0,0%,100%,0.06)" }}>
                        <p className="text-xs text-muted-foreground">
                          {liveResults.length} نتيجة لـ &ldquo;{search}&rdquo;
                        </p>
                        <button onClick={() => setDropdownOpen(false)} className="text-muted-foreground hover:text-foreground">
                          <X size={12} />
                        </button>
                      </div>

                      {/* Results list */}
                      <ul className="max-h-[380px] overflow-y-auto py-1">
                        {liveResults.map((p) => (
                          <li key={p._id}>
                            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group">
                              {/* Thumbnail */}
                              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-secondary/50 border border-white/5">
                                <ItemImage
                                  src={p.image}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-semibold text-foreground truncate">{p.nameAr || p.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {p.brand} · {categories.find((c) => c.id === p.category)?.nameAr || p.category}
                                </p>
                                <p className="text-xs font-bold text-primary mt-0.5">{formatPrice(p.price)}</p>
                              </div>

                              {/* Active badge */}
                              <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.isActive ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                                {p.isActive ? "نشط" : "معطّل"}
                              </span>

                              {/* Quick actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => { setEditProduct(p); setDropdownOpen(false); }}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                  title="تعديل"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => { handleDelete(p._id); setDropdownOpen(false); }}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                  title="حذف"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      <div className="border-t px-3 py-2 text-center" style={{ borderColor: "hsla(0,0%,100%,0.06)" }}>
                        <button
                          onClick={() => setDropdownOpen(false)}
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          عرض {filtered.length} نتيجة في الجدول ↓
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                      <PackageSearch size={28} className="opacity-30" />
                      <p className="text-sm">لا توجد نتائج لـ &ldquo;{search}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-card border border-border rounded-2xl h-11 px-4 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
            >
              <option value="all">كل الأصناف</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
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

        {/* Search status bar */}
        {search.trim() && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-4">
            <Search size={13} />
            <span>
              نتائج البحث عن <strong className="text-foreground">&ldquo;{search}&rdquo;</strong>: {filtered.length} منتج
            </span>
            <button onClick={clearSearch} className="mr-auto text-xs text-primary hover:underline flex items-center gap-1">
              <X size={11} /> مسح البحث
            </button>
          </div>
        )}

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
                  <th className="p-5 text-xs font-bold text-muted-foreground">الألوان</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">المقاسات</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">المخزون</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الحالة</th>
                  <th className="p-5 text-xs font-bold text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5 font-medium">
                {products === undefined ? (
                  <tr><td colSpan={9} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
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
                    <td className="p-4"><span className="text-xs px-3 py-1 bg-secondary/30 rounded-full text-muted-foreground">{categories.find((c) => c.id === p.category)?.nameAr || p.category}</span></td>
                    <td className="p-4 text-xs">{p.brand}</td>
                    <td className="p-4 text-sm font-black text-primary">{formatPrice(p.price)}</td>
                    {/* Colors */}
                    <td className="p-4">
                      {(p as any).colors?.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {((p as any).colors as any[]).slice(0, 5).map((c: any, idx: number) => {
                            const hex = typeof c === "string" ? c.split("|")[0] : c.hex;
                            const label = typeof c === "string" ? c.split("|")[1] || c : c.label;
                            return <span key={idx} title={label} className="w-5 h-5 rounded-full border-2 border-white/20 shadow-sm shrink-0" style={{ backgroundColor: hex }} />;
                          })}
                          {(p as any).colors.length > 5 && <span className="text-[10px] text-muted-foreground">+{(p as any).colors.length - 5}</span>}
                        </div>
                      ) : <span className="text-muted-foreground/30 text-xs">—</span>}
                    </td>
                    {/* Sizes */}
                    <td className="p-4">
                      {(p as any).sizes?.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {((p as any).sizes as string[]).slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold">{s}</span>
                          ))}
                          {(p as any).sizes.length > 3 && <span className="text-[10px] text-muted-foreground">+{(p as any).sizes.length - 3}</span>}
                        </div>
                      ) : <span className="text-muted-foreground/30 text-xs">—</span>}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.stockQuantity < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {p.stockQuantity} قطعة
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleActive(p)} className={`transition-colors ${p.isActive ? "text-[#5D5FEF]" : "text-muted-foreground/30"}`}>
                        {p.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditProduct(p)} className="p-2 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
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
              <PackageSearch size={48} className="mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-bold">لا توجد منتجات مطابقة</p>
              {search && (
                <button onClick={clearSearch} className="mt-2 text-sm text-primary hover:underline">مسح البحث</button>
              )}
            </div>
          )}
        </div>
      </div>

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} onProductAdded={() => {}} />
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
