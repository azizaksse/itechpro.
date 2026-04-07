import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/products";
import { X, Upload, Trash2, Loader2, Plus } from "lucide-react";
import SpecsField from "./SpecsField";
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
    description: "",
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
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "اسم المنتج مطلوب";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "يرجى إدخال سعر صحيح";
    if (!form.stock_quantity || Number(form.stock_quantity) < 0) newErrors.stock_quantity = "يرجى إدخال كمية صحيحة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("products").insert({
        name: form.name.trim(),
        name_ar: form.name.trim(),
        description: form.description.trim(),
        description_ar: form.description.trim(),
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
        specs: Object.keys(specs).length > 0 ? specs : {},
      });

      if (error) throw error;

      toast.success("تم إضافة المنتج بنجاح 🎉");
      onProductAdded();
      onClose();
      setForm({ name: "", description: "", price: "", old_price: "", category: "accessories", brand: "", stock_quantity: "1", is_active: true, is_new: false, is_promo: false });
      setImages([]);
      setSpecs({});
      setErrors({});
    } catch (err: any) {
      toast.error("فشل إضافة المنتج: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-card rounded-t-2xl shrink-0">
          <h2 className="text-xl font-bold">إضافة منتج جديد</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label>اسم المنتج *</Label>
            <Input
              placeholder="مثال: كرت شاشة RTX 5070"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>وصف المنتج</Label>
            <textarea
              placeholder="وصف مختصر للمنتج..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-secondary/50 border border-secondary px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Images */}
          <div className="space-y-1.5">
            <Label>صور المنتج</Label>
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
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Price & Old Price */}
          <div className="grid grid-cols-2 gap-3">
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
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>السعر القديم (اختياري)</Label>
              <Input
                type="number"
                value={form.old_price}
                onChange={(e) => updateField("old_price", e.target.value)}
                dir="ltr"
                min="0"
                placeholder="للعروض"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-3">
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
              <Label>العلامة التجارية</Label>
              <Input
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="مثال: MSI"
              />
            </div>
          </div>

          {/* Stock */}
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
            {errors.stock_quantity && <p className="text-xs text-destructive">{errors.stock_quantity}</p>}
          </div>

          {/* Specs */}
          <SpecsField specs={specs} onChange={setSpecs} />

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <Label className="cursor-pointer">تفعيل المنتج (مرئي في المتجر)</Label>
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

        {/* Submit - Fixed Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-card rounded-b-2xl shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            إضافة المنتج إلى المتجر
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
