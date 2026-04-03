import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/products";
import { X, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const AddProductModal = ({ open, onClose, onProductAdded }: AddProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    price: "",
    old_price: "",
    category: "accessories",
    brand: "",
    stock_quantity: "1",
    is_active: true,
    is_new: false,
    is_promo: false,
  });
  const [images, setImages] = useState<string[]>([]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        setImages((prev) => [...prev, urlData.publicUrl]);
      }
      toast.success("تم رفع الصورة بنجاح");
    } catch (err: any) {
      toast.error("فشل رفع الصورة: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name_ar.trim()) {
      toast.error("يرجى إدخال اسم المنتج بالعربية");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("products").insert({
        name: form.name.trim() || form.name_ar.trim(),
        name_ar: form.name_ar.trim(),
        description: form.description.trim(),
        description_ar: form.description_ar.trim(),
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        category: form.category,
        brand: form.brand.trim(),
        image: images[0] || "",
        images,
        stock_quantity: Number(form.stock_quantity) || 0,
        in_stock: Number(form.stock_quantity) > 0,
        is_active: form.is_active,
        is_new: form.is_new,
        is_promo: form.is_promo,
      });

      if (error) throw error;

      toast.success("تم إضافة المنتج بنجاح! 🎉");
      onProductAdded();
      onClose();
      // Reset
      setForm({
        name: "", name_ar: "", description: "", description_ar: "",
        price: "", old_price: "", category: "accessories", brand: "",
        stock_quantity: "1", is_active: true, is_new: false, is_promo: false,
      });
      setImages([]);
    } catch (err: any) {
      toast.error("فشل إضافة المنتج: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold">إضافة منتج جديد</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
              معلومات المنتج الأساسية
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>اسم المنتج (عربي) *</Label>
                <Input
                  placeholder="مثال: كرت شاشة RTX 5070"
                  value={form.name_ar}
                  onChange={(e) => updateField("name_ar", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>اسم المنتج (إنجليزي)</Label>
                <Input
                  placeholder="e.g. RTX 5070 GPU"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="space-y-1.5">
                <Label>الوصف (عربي)</Label>
                <textarea
                  placeholder="وصف مختصر للمنتج..."
                  value={form.description_ar}
                  onChange={(e) => updateField("description_ar", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-secondary/50 border border-secondary px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>الوصف (إنجليزي)</Label>
                <textarea
                  placeholder="Short product description..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  dir="ltr"
                  className="w-full rounded-xl bg-secondary/50 border border-secondary px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Images */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">2</span>
              صور المنتج
            </h3>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload size={18} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">رفع</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Section: Price & Category */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">3</span>
              السعر والتصنيف
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>السعر (د.ج) *</Label>
                <Input
                  type="number"
                  placeholder="185000"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  dir="ltr"
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>السعر القديم (اختياري)</Label>
                <Input
                  type="number"
                  placeholder="199000"
                  value={form.old_price}
                  onChange={(e) => updateField("old_price", e.target.value)}
                  dir="ltr"
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>العلامة التجارية</Label>
                <Input
                  placeholder="ASUS, MSI..."
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="space-y-1.5">
                <Label>الفئة *</Label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>كمية المخزون *</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={form.stock_quantity}
                  onChange={(e) => updateField("stock_quantity", e.target.value)}
                  dir="ltr"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Section: Visibility */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">4</span>
              الحالة والظهور
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                <Label className="cursor-pointer">نشط (مرئي)</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => updateField("is_active", v)} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                <Label className="cursor-pointer">منتج جديد</Label>
                <Switch checked={form.is_new} onCheckedChange={(v) => updateField("is_new", v)} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                <Label className="cursor-pointer">عرض خاص</Label>
                <Switch checked={form.is_promo} onCheckedChange={(v) => updateField("is_promo", v)} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border sticky bottom-0 bg-card/95 backdrop-blur-sm rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            إضافة للمتجر
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
