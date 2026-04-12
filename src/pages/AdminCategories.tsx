import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LayoutGrid, Plus, Pencil, Trash2, X, Loader2, Save, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";

const EMPTY = { slug: "", nameAr: "", nameEn: "", imageId: "", isActive: true, order: 0 };

const AdminCategories = () => {
  const cats = useQuery(api.categories.getCategories);
  const addCat = useMutation(api.categories.addCategory);
  const updateCat = useMutation(api.categories.updateCategory);
  const deleteCat = useMutation(api.categories.deleteCategory);
  const generateUploadUrl = useMutation(api.categories.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY, order: (cats?.length ?? 0) + 1 }); setEditing(null); setShowForm(true); };
  const openEdit = (c: any) => {
    setForm({ slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn ?? "", imageId: c.imageId ?? "", isActive: c.isActive, order: c.order });
    setEditing(c); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await res.json();
      setForm(f => ({ ...f, imageId: storageId }));
      toast.success("تم رفع الصورة ✅");
    } catch { toast.error("فشل رفع الصورة"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.nameAr.trim()) { toast.error("الـ Slug والاسم بالعربية مطلوبان"); return; }
    setLoading(true);
    try {
      if (editing) {
        await updateCat({ id: editing._id, ...form, nameEn: form.nameEn || undefined, imageId: form.imageId || undefined });
        toast.success("تم تحديث الفئة ✅");
      } else {
        await addCat({ ...form, nameEn: form.nameEn || undefined, imageId: form.imageId || undefined });
        toast.success("تم إضافة الفئة 🎉");
      }
      closeForm();
    } catch { toast.error("فشلت العملية"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: any, name: string) => {
    if (!confirm(`حذف فئة "${name}"؟`)) return;
    try { await deleteCat({ id }); toast.success("تم الحذف"); }
    catch { toast.error("فشل الحذف"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><LayoutGrid size={22} /></div>
            <div>
              <h1 className="text-2xl font-bold">الفئات</h1>
              <p className="text-sm text-muted-foreground">إدارة فئات المنتجات ({cats?.length ?? 0} فئة)</p>
            </div>
          </div>
          <Button onClick={openAdd} className="gap-2"><Plus size={16} /> إضافة فئة</Button>
        </div>

        {/* Grid */}
        {cats === undefined ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : cats.length === 0 ? (
          <div className="glass-card rounded-2xl border border-border p-16 text-center text-muted-foreground">
            <LayoutGrid size={40} className="mx-auto mb-4 opacity-30" />
            <p>لا توجد فئات بعد. أضف أولاً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cats.map(c => (
              <div key={c._id} className={`glass-card rounded-2xl border p-4 transition-all ${c.isActive ? "border-border" : "border-border/30 opacity-60"}`}>
                {c.imageId && (
                  <div className="w-full h-32 rounded-xl border border-border overflow-hidden bg-secondary/30 mb-3">
                    <ItemImage src={c.imageId} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold truncate">{c.nameAr}</p>
                    {c.nameEn && <p className="text-xs text-muted-foreground">{c.nameEn}</p>}
                    <p className="text-xs font-mono text-primary/70 mt-0.5">/{c.slug}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-bold ${c.isActive ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                    {c.isActive ? "مفعّل" : "معطّل"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => openEdit(c)}>
                    <Pencil size={12} /> تعديل
                  </Button>
                  <button onClick={() => handleDelete(c._id, c.nameAr)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">{editing ? "تعديل الفئة" : "إضافة فئة جديدة"}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-secondary"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <Label>الاسم بالعربية *</Label>
                <Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} placeholder="مثال: لوحات المفاتيح" />
              </div>
              <div className="space-y-1.5">
                <Label>الاسم بالإنجليزية</Label>
                <Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} placeholder="e.g. Keyboards" dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>الـ Slug (URL) *</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="keyboards" dir="ltr" />
                <p className="text-[10px] text-muted-foreground">يستخدم في URL — بالإنجليزية فقط بدون مسافات</p>
              </div>
              <div className="space-y-1.5">
                <Label>صورة الفئة</Label>
                <div className="flex gap-2">
                  <Input value={form.imageId} onChange={e => setForm(f => ({ ...f, imageId: e.target.value }))} placeholder="URL أو storageId" dir="ltr" className="flex-1" />
                  <Button type="button" variant="outline" className="relative shrink-0 border-dashed hover:border-primary/50" disabled={uploading}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                  </Button>
                </div>
                {form.imageId && (
                  <div className="w-full h-24 rounded-xl border border-border overflow-hidden bg-secondary/30">
                    <ItemImage src={form.imageId} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>الترتيب</Label>
                <Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} dir="ltr" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                <Label>تفعيل الفئة</Label>
                <Switch checked={form.isActive} onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t border-border">
              <Button variant="ghost" onClick={closeForm}>إلغاء</Button>
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editing ? "حفظ التعديلات" : "إضافة"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
