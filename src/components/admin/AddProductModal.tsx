import { useState } from "react";
import { categories } from "@/data/products";
import { X, Upload, Loader2, Plus, Palette, Ruler } from "lucide-react";
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
  const [colorUploading, setColorUploading] = useState(false);

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

  // — Color state —
  // Colors now have an optional image linked to them so clicking a color changes the preview image!
  const [colors, setColors] = useState<{ hex: string; label: string; imageId?: string }[]>([]);
  const [pickedHex, setPickedHex] = useState("#ef4444");
  const [colorLabel, setColorLabel] = useState("");
  const [colorImage, setColorImage] = useState("");

  // — Size state (cm) —
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Upload an image specifically for the current picked color
  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setColorUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setColorImage(storageId);
      toast.success("تم رفع صورة اللون بنجاح ✅");
    } catch {
      toast.error("فشل رفع صورة اللون");
    } finally {
      setColorUploading(false);
    }
  };

  // Add the color (with its image) to our array
  const addColor = () => {
    if (colors.find((c) => c.hex === pickedHex)) {
      toast.error("هذا اللون مضاف مسبقاً");
      return;
    }
    const label = colorLabel.trim() || pickedHex;
    setColors((prev) => [...prev, { hex: pickedHex, label, imageId: colorImage }]);
    // Reset color inputs
    setColorLabel("");
    setColorImage("");
  };

  const removeColor = (hex: string) => setColors((prev) => prev.filter((c) => c.hex !== hex));

  // Add a size in cm
  const addSize = () => {
    const raw = sizeInput.trim().replace(/\s+/g, "");
    if (!raw) return;
    const normalized = /^\d+(\.\d+)?$/.test(raw) ? `${raw}cm` : raw;
    if (sizes.includes(normalized)) { setSizeInput(""); return; }
    setSizes((prev) => [...prev, normalized]);
    setSizeInput("");
  };
  const removeSize = (s: string) => setSizes((prev) => prev.filter((x) => x !== s));

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
      toast.success("تم رفع الصورة الأساسية بنجاح ✅");
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
    if (!validate()) return;
    setLoading(true);
    try {
      await addProduct({
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
        colors: colors.length > 0 ? colors : undefined, // passing full array of objects
        sizes: sizes.length > 0 ? sizes : undefined,
      });
      toast.success("تم إضافة المنتج بنجاح 🎉");
      onProductAdded();
      onClose();
      // Reset
      setForm({ name: "", nameAr: "", description: "", descriptionAr: "", price: "", oldPrice: "", category: "accessories", brand: "", image: "", stockQuantity: "1", isActive: true, isNew: false, isPromo: false });
      setSpecs({});
      setErrors({});
      setColors([]);
      setSizes([]);
    } catch {
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
          <div className="space-y-1.5">
            <Label>اسم المنتج *</Label>
            <Input placeholder="مثال: كرت شاشة RTX 5070" value={form.nameAr} onChange={(e) => updateField("nameAr", e.target.value)} />
            {errors.nameAr && <p className="text-xs text-destructive">{errors.nameAr}</p>}
          </div>

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

          <div className="space-y-1.5 focus-within:text-primary transition-colors">
            <Label className="flex items-center gap-2"><Upload size={14} /> صورة المنتج الرئيسية *</Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input placeholder="انسخ رابط الصورة هنا..." value={form.image} onChange={(e) => updateField("image", e.target.value)} className="flex-1" dir="ltr" />
                <Button type="button" variant="outline" className="relative overflow-hidden shrink-0 border-dashed hover:border-primary/50" disabled={uploading}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : "رفع ملف"}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" />
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
              <Input type="number" placeholder="185000" value={form.price} onChange={(e) => updateField("price", e.target.value)} dir="ltr" min="0" />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>السعر القديم (اختياري)</Label>
              <Input type="number" value={form.oldPrice} onChange={(e) => updateField("oldPrice", e.target.value)} dir="ltr" min="0" placeholder="للعروض" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الفئة *</Label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>العلامة التجارية</Label>
              <Input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="مثال: MSI" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>كمية المخزون *</Label>
            <Input type="number" placeholder="10" value={form.stockQuantity} onChange={(e) => updateField("stockQuantity", e.target.value)} dir="ltr" min="0" />
            {errors.stockQuantity && <p className="text-xs text-destructive">{errors.stockQuantity}</p>}
          </div>

          {/* ── COLORS ── */}
          <div className="space-y-4 p-4 rounded-2xl bg-secondary/20 border border-border">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Palette size={15} className="text-primary" /> الألوان المتاحة
            </Label>

            {/* Color picker form */}
            <div className="flex flex-col gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={pickedHex}
                  onChange={(e) => setPickedHex(e.target.value)}
                  className="w-10 h-10 rounded-xl border-2 border-border cursor-pointer p-0.5 bg-transparent"
                />
                <Input
                  placeholder="اسم اللون (مثال: أزرق سماوي)"
                  value={colorLabel}
                  onChange={(e) => setColorLabel(e.target.value)}
                  className="flex-1 h-10 text-sm"
                />
              </div>

              {/* Color Image Upload */}
              <div className="flex gap-2 items-center">
                <Button type="button" variant="outline" className="relative flex-1 border-dashed hover:border-primary/50 text-xs gap-2" disabled={colorUploading}>
                  {colorUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {colorImage ? "تغيير صورة هذا اللون" : "اربط صورة بهذا اللون (اختياري)"}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleColorImageUpload} accept="image/*" />
                </Button>
                {colorImage && (
                  <div className="w-10 h-10 rounded-lg border border-border overflow-hidden bg-secondary/30 flex items-center justify-center p-1 shrink-0">
                    <ItemImage src={colorImage} className="h-full object-contain" />
                  </div>
                )}
                <Button type="button" onClick={addColor} size="sm" className="h-10 rounded-xl px-4 shrink-0 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
                  إضافة
                </Button>
              </div>
            </div>

            {/* Selected colors list */}
            {colors.length > 0 && (
              <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
                {colors.map((c) => (
                  <div key={c.hex} className="flex items-center justify-between bg-card text-card-foreground rounded-xl px-3 py-2 border border-border shadow-sm group">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md border border-border shadow-inner" style={{ backgroundColor: c.hex }} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{c.label}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">{c.hex}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {c.imageId && (
                        <div className="w-8 h-8 rounded border border-border p-0.5 bg-secondary/30">
                          <ItemImage src={c.imageId} className="w-full h-full object-cover rounded-[2px]" />
                        </div>
                      )}
                      <button type="button" onClick={() => removeColor(c.hex)} className="text-muted-foreground hover:text-destructive transition-colors p-1 bg-secondary/50 hover:bg-destructive/10 rounded-lg">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SIZES (cm) ── */}
          <div className="space-y-3 p-4 rounded-2xl bg-secondary/20 border border-border">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Ruler size={15} className="text-primary" /> الأبعاد / المقاسات (بالسنتيمتر)
            </Label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input type="number" placeholder="مثال: 35" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())} dir="ltr" min="0" step="0.5" className="h-10 pr-4 pl-14" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">cm</span>
              </div>
              <Button type="button" onClick={addSize} size="sm" className="h-10 rounded-xl gap-1 shrink-0 px-4">
                <Plus size={13} /> إضافة
              </Button>
            </div>
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
                {sizes.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-bold shadow-sm">
                    {s}
                    <button type="button" onClick={() => removeSize(s)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <SpecsField specs={specs} onChange={setSpecs} />

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
