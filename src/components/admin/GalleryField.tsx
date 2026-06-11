import { useState } from "react";
import { Upload, Trash2, Images, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ItemImage from "@/components/ItemImage";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface GalleryFieldProps {
  principalImage: string;
  galleryImages: string[];
  onPrincipalChange: (imageId: string) => void;
  onGalleryChange: (images: string[]) => void;
}

const GalleryField = ({
  principalImage,
  galleryImages,
  onPrincipalChange,
  onGalleryChange,
}: GalleryFieldProps) => {
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // ── Upload single main image ──────────────────────────────────────
  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      onPrincipalChange(storageId);
      // Also add to gallery if not already present
      if (!galleryImages.includes(storageId)) {
        onGalleryChange([storageId, ...galleryImages]);
      }
      toast.success("تم رفع الصورة الرئيسية ✅");
    } catch {
      toast.error("فشل رفع الصورة الرئيسية");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  };

  // ── Upload multiple gallery images ────────────────────────────────
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const uploadedIds: string[] = [];
      for (const file of files) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        uploadedIds.push(storageId);
      }
      // Merge, avoid duplicates
      const newGallery = [
        ...galleryImages,
        ...uploadedIds.filter((id) => !galleryImages.includes(id)),
      ];
      onGalleryChange(newGallery);
      toast.success(`تم رفع ${uploadedIds.length} صورة للمعرض ✅`);
    } catch {
      toast.error("فشل رفع بعض الصور");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (imgId: string) => {
    const newGallery = galleryImages.filter((id) => id !== imgId);
    onGalleryChange(newGallery);
    // If removed was the principal, auto-promote next
    if (imgId === principalImage) {
      const next = newGallery.find((id) => id !== imgId) || "";
      onPrincipalChange(next);
    }
  };

  // Gallery images excluding the main one (to show separately)
  const extraGallery = galleryImages.filter((id) => id !== principalImage);

  return (
    <div className="space-y-4">

      {/* ── Section 1: Main Image ─────────────────────────────────── */}
      <div className="space-y-3 p-4 rounded-2xl bg-secondary/20 border border-border">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <ImagePlus size={15} className="text-primary" />
          الصورة الرئيسية
          <span className="text-xs font-normal text-muted-foreground mr-auto">
            تظهر على بطاقة المنتج
          </span>
        </Label>

        {principalImage ? (
          <div className="flex items-start gap-3">
            {/* Preview */}
            <div
              className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-primary shadow-[0_0_16px_hsl(0_72%_51%/0.3)]"
              style={{ background: "hsl(0,0%,8%)" }}
            >
              <ItemImage
                src={principalImage}
                alt="الصورة الرئيسية"
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="relative border-dashed hover:border-primary/50 gap-2 text-xs"
                disabled={uploadingMain}
              >
                {uploadingMain ? (
                  <><Loader2 size={13} className="animate-spin" /> جارٍ الرفع...</>
                ) : (
                  <><Upload size={13} /> تغيير الصورة الرئيسية</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleMainUpload}
                  disabled={uploadingMain}
                />
              </Button>
              <button
                type="button"
                onClick={() => {
                  onPrincipalChange("");
                  onGalleryChange(galleryImages.filter((id) => id !== principalImage));
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={12} /> حذف الصورة الرئيسية
              </button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="relative w-full border-dashed hover:border-primary/50 gap-2 text-sm h-20 flex-col"
            disabled={uploadingMain}
          >
            {uploadingMain ? (
              <><Loader2 size={18} className="animate-spin" /><span className="text-xs">جارٍ رفع الصورة...</span></>
            ) : (
              <>
                <ImagePlus size={22} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">انقر لرفع الصورة الرئيسية</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleMainUpload}
              disabled={uploadingMain}
            />
          </Button>
        )}
      </div>

      {/* ── Section 2: Gallery Images ────────────────────────────── */}
      <div className="space-y-3 p-4 rounded-2xl bg-secondary/20 border border-border">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Images size={15} className="text-primary" />
          معرض الصور
          <span className="text-xs font-normal text-muted-foreground mr-auto">
            صور إضافية تظهر في صفحة المنتج
          </span>
        </Label>

        {/* Upload button */}
        <Button
          type="button"
          variant="outline"
          className="relative w-full border-dashed hover:border-primary/50 gap-2 text-sm"
          disabled={uploadingGallery}
        >
          {uploadingGallery ? (
            <><Loader2 size={15} className="animate-spin" /> جارٍ رفع الصور...</>
          ) : (
            <><Upload size={15} /> إضافة صور للمعرض (يمكن اختيار أكثر من صورة)</>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleGalleryUpload}
            disabled={uploadingGallery}
          />
        </Button>

        {/* Gallery grid — only extra images (not the main) */}
        {extraGallery.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {extraGallery.map((imgId, i) => (
              <div
                key={imgId + i}
                className="relative group rounded-xl overflow-hidden border-2 border-border hover:border-primary/40 transition-all duration-200"
                style={{ background: "hsl(0,0%,8%)" }}
              >
                <div className="aspect-square flex items-center justify-center p-1">
                  <ItemImage
                    src={imgId}
                    className="w-full h-full object-contain"
                    alt={`صورة ${i + 1}`}
                  />
                </div>
                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(imgId)}
                    title="حذف"
                    className="p-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground py-3">
            لم يتم إضافة صور معرض بعد
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryField;
