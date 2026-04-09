import { useState } from "react";
import { categories } from "@/data/products";
import { X, Upload, Trash2, Loader2, Plus } from "lucide-react";
import SpecsField from "./SpecsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ItemImage from "../ItemImage";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const AddProductModal = ({ open, onClose, onProductAdded }: AddProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const addProduct = useMutation(api.products.addProduct);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: "",
    oldPrice: "",
    category: "accessories",
    brand: "",
    image: "",
    stockQuantity: "1",
    isActive: true,
    isNew: false,
    isPromo: false,
  });
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // In a real app, you'd store the storageId and use storage.getUrl()
      // For this project, we'll store the direct URL for simplicity if possible
      // But Convex storageIds are best used with getUrl. 
      // We'll store it in a way that our frontend can show it.
      // We can use a trick: the image saved will be the storageId, 
      // and we update ProductCard and other places to handle it.
      // BUT, it's easier to just store the URL.
      
      updateField("image", storageId); // Store storageId as image string
      toast.success("تم رفع الصورة بنجاح ✅");
    } catch (e) {
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
    if (!validate()) return;
    setLoading(true);
    try {
      await addProduct({
        name: form.nameAr, // Use nameAr as name for now
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
      toast.success("تم إضافة المنتج بنجاح 🎉");
      onProductAdded();
      onClose();
      setForm({ name: "", nameAr: "", description: "", descriptionAr: "", price: "", oldPrice: "", category: "accessories", brand: "", image: "", stockQuantity: "1", isActive: true, isNew: false, isPromo: false });
      setSpecs({});
      setErrors({});
    } catch (e) {
      toast.error("فشل إضافة المنتج");
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
              value={form.nameAr}
              onChange={(e) => updateField("nameAr", e.target.value)}
            />
            {errors.nameAr && <p className="text-xs text-destructive">{errors.nameAr}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>وصف المنتج</Label>
            <textarea
              placeholder="وصف مختصر للمنتج..."
              value={form.descriptionAr}
              onChange={(e) => updateField("descriptionAr", e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-secondary/50 border border-secondary px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Images */}
          <div className="space-y-1.5 focus-within:text-primary transition-colors">
            <Label className="flex items-center gap-2">
              <Upload size={14} />
              صورة المنتج *
            </Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="انسخ رابط الصورة هنا أو ارفع ملفاً..."
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
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : "اختر ملفاً"}
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
                value={form.oldPrice}
                onChange={(e) => updateField("oldPrice", e.target.value)}
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
              value={form.stockQuantity}
              onChange={(e) => updateField("stockQuantity", e.target.value)}
              dir="ltr"
              min="0"
            />
            {errors.stockQuantity && <p className="text-xs text-destructive">{errors.stockQuantity}</p>}
          </div>

          {/* Specs */}
          <SpecsField specs={specs} onChange={setSpecs} />

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <Label className="cursor-pointer">تفعيل المنتج (مرئي في المتجر)</Label>
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
