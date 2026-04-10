import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { categories } from "@/data/products";
import { X, Upload, Loader2, Save } from "lucide-react";
import SpecsField from "./SpecsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ItemImage from "../ItemImage";

interface EditProductModalProps {
  open: boolean;
  product: any | null;
  onClose: () => void;
  onProductUpdated: () => void;
}

const EditProductModal = ({ open, product, onClose, onProductUpdated }: EditProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const updateProductMutation = useMutation(api.products.updateProduct);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [form, setForm] = useState({
    nameAr: "",
    descriptionAr: "",
    price: "",
    oldPrice: "",
    category: "accessories",
    brand: "",
    image: "",
    stockQuantity: "0",
    isActive: true,
    isNew: false,
    isPromo: false,
  });
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        nameAr: product.nameAr || "",
        descriptionAr: product.descriptionAr || "",
        price: String(product.price),
        oldPrice: product.oldPrice ? String(product.oldPrice) : "",
        category: product.category,
        brand: product.brand || "",
        image: product.image || "",
        stockQuantity: String(product.stockQuantity),
        isActive: product.isActive,
        isNew: product.isNew,
        isPromo: product.isPromo,
      });
      setSpecs(product.specs || {});
      setErrors({});
    }
  }, [product]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      updateField("image", storageId);
      toast.success("تم رفع الصورة بنجاح ✅");
    } catch {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.nameAr.trim()) newErrors.nameAr = "اسم المنتج مطلوب";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "يرجى إدخال سعر صحيح";
    if (!form.stockQuantity || Number(form.stockQuantity) < 0) newErrors.stockQuantity = "يرجى إدخال كمية صحيحة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !product) return;
    setLoading(true);
    try {
      await updateProductMutation({
        id: product._id,
        name: form.nameAr,
        nameAr: form.nameAr,
        description: form.descriptionAr,
        descriptionAr: form.descriptionAr,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        category: form.category,
        brand: form.brand,
        image: form.image || "",
        images: [form.image || ""],
        inStock: Number(form.stockQuantity) > 0,
        stockQuantity: Number(form.stockQuantity),
        isActive: form.isActive,
        isNew: form.isNew,
        isPromo: form.isPromo,
        specs: specs,
      });
      toast.success("تم تحديث المنتج بنجاح ✅");
      onProductUpdated();
      onClose();
    } catch (e) {
      toast.error("فشل تحديث المنتج");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold">تعديل المنتج (Convex)</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-1.5">
            <Label>اسم المنتج *</Label>
            <Input value={form.nameAr} onChange={(e) => updateField("nameAr", e.target.value)} />
            {errors.nameAr && <p className="text-xs text-destructive">{errors.nameAr}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>وصف المنتج</Label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => updateField("descriptionAr", e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-secondary/50 border border-secondary px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5 focus-within:text-primary transition-colors">
            <Label className="flex items-center gap-2">
              <Upload size={14} />
              صورة المنتج
            </Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="انسخ رابط الصورة هنا..."
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  className="flex-1"
                  dir="ltr"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative overflow-hidden shrink-0 border-dashed hover:border-primary/50"
                  disabled={uploading}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : "رفع صورة"}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </Button>
              </div>
              {form.image && (
                <div className="w-full h-32 rounded-xl border border-border overflow-hidden bg-secondary/30 flex items-center justify-center p-2 group transition-all hover:bg-secondary/50">
                  <ItemImage src={form.image} className="h-full object-contain transition-transform group-hover:scale-105" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>السعر (د.ج) *</Label>
              <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} dir="ltr" min="0" />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>السعر القديم (اختياري)</Label>
              <Input type="number" value={form.oldPrice} onChange={(e) => updateField("oldPrice", e.target.value)} dir="ltr" min="0" placeholder="للعروض" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الفئة</Label>
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
              <Input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="مثال: MSI" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>كمية المخزون *</Label>
            <Input type="number" value={form.stockQuantity} onChange={(e) => updateField("stockQuantity", e.target.value)} dir="ltr" min="0" />
            {errors.stockQuantity && <p className="text-xs text-destructive">{errors.stockQuantity}</p>}
          </div>

          <SpecsField specs={specs} onChange={setSpecs} />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <Label className="cursor-pointer">تفعيل المنتج</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => updateField("isActive", v)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <Label className="cursor-pointer">منتج جديد</Label>
              <Switch checked={form.isNew} onCheckedChange={(v) => updateField("isNew", v)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <Label className="cursor-pointer">عرض خاص</Label>
              <Switch checked={form.isPromo} onCheckedChange={(v) => updateField("isPromo", v)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border sticky bottom-0 bg-card/95 backdrop-blur-sm rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            حفظ التعديلات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
