import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Megaphone, Plus, Pencil, Trash2, X, Loader2, Save, Upload, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";

const EMPTY = { title: "", subtitle: "", imageId: "", link: "", isActive: true, order: 0 };

const AdminBanners = () => {
  const banners = useQuery(api.banners.getBanners);
  const addBanner = useMutation(api.banners.addBanner);
  const updateBanner = useMutation(api.banners.updateBanner);
  const deleteBanner = useMutation(api.banners.deleteBanner);
  const generateUploadUrl = useMutation(api.banners.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY, order: (banners?.length ?? 0) + 1 }); setEditing(null); setShowForm(true); };
  const openEdit = (b: any) => { setForm({ title: b.title, subtitle: b.subtitle ?? "", imageId: b.imageId, link: b.link ?? "", isActive: b.isActive, order: b.order }); setEditing(b); setShowForm(true); };
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
    if (!form.title.trim() || !form.imageId.trim()) { toast.error("العنوان والصورة مطلوبان"); return; }
    setLoading(true);
    try {
      if (editing) {
        await updateBanner({ id: editing._id, ...form, subtitle: form.subtitle || undefined, link: form.link || undefined });
        toast.success("تم تحديث البانر ✅");
      } else {
        await addBanner({ ...form, subtitle: form.subtitle || undefined, link: form.link || undefined });
        toast.success("تم إضافة البانر 🎉");
      }
      closeForm();
    } catch { toast.error("فشلت العملية"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("حذف هذا البانر؟")) return;
    try { await deleteBanner({ id }); toast.success("تم الحذف"); }
    catch { toast.error("فشل الحذف"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Megaphone size={22} /></div>
            <div>
              <h1 className="text-2xl font-bold">البانرات والإعلانات</h1>
              <p className="text-sm text-muted-foreground">إدارة الصور والإعلانات الظاهرة في الصفحة الرئيسية</p>
            </div>
          </div>
          <Button onClick={openAdd} className="gap-2"><Plus size={16} /> إضافة بانر</Button>
        </div>

        {/* List */}
        {banners === undefined ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : banners.length === 0 ? (
          <div className="glass-card rounded-2xl border border-border p-16 text-center text-muted-foreground">
            <Megaphone size={40} className="mx-auto mb-4 opacity-30" />
            <p>لا توجد بانرات بعد. أضف أولاً!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map(b => (
              <div key={b._id} className={`glass-card rounded-2xl border p-4 flex gap-4 items-center transition-all ${b.isActive ? "border-border" : "border-border/30 opacity-60"}`}>
                <div className="w-24 h-16 rounded-xl border border-border overflow-hidden bg-secondary/30 shrink-0">
                  <ItemImage src={b.imageId} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>}
                  {b.link && <a href={b.link} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline mt-1"><ExternalLink size={11} />{b.link}</a>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${b.isActive ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                    {b.isActive ? "مفعّل" : "معطّل"}
                  </span>
                  <button onClick={() => openEdit(b)} className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 rounded-xl hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
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
              <h2 className="font-bold text-lg">{editing ? "تعديل البانر" : "إضافة بانر جديد"}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-secondary"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <Label>العنوان *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="مثال: عروض الصيف 🔥" />
              </div>
              <div className="space-y-1.5">
                <Label>العنوان الفرعي</Label>
                <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="وصف قصير اختياري" />
              </div>
              <div className="space-y-1.5">
                <Label>الصورة *</Label>
                <div className="flex gap-2">
                  <Input value={form.imageId} onChange={e => setForm(f => ({ ...f, imageId: e.target.value }))} placeholder="URL أو storageId" dir="ltr" className="flex-1" />
                  <Button type="button" variant="outline" className="relative shrink-0 border-dashed hover:border-primary/50" disabled={uploading}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                  </Button>
                </div>
                {form.imageId && (
                  <div className="w-full h-28 rounded-xl border border-border overflow-hidden bg-secondary/30">
                    <ItemImage src={form.imageId} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>رابط التوجيه (عند النقر)</Label>
                <Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/products" dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>الترتيب</Label>
                <Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} dir="ltr" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                <Label>تفعيل البانر</Label>
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

export default AdminBanners;
