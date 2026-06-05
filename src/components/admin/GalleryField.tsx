import { useState } from "react";
import { Upload, Trash2, Star, Loader2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ItemImage from "@/components/ItemImage";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface GalleryFieldProps {
  /** The current principal image (form.image) */
  principalImage: string;
  /** All gallery images including the principal */
  galleryImages: string[];
  onPrincipalChange: (imageId: string) => void;
  onGalleryChange: (images: string[]) => void;
}

/**
 * GalleryField — lets admin upload multiple images for a product.
 * One image is marked as "principal" (main image shown on cards/listings).
 * Clicking the ⭐ crown on any thumbnail sets it as principal.
 */
const GalleryField = ({
  principalImage,
  galleryImages,
  onPrincipalChange,
  onGalleryChange,
}: GalleryFieldProps) => {
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
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

      const newGallery = [
        ...galleryImages,
        ...uploadedIds.filter((id) => !galleryImages.includes(id)),
      ];
      onGalleryChange(newGallery);

      // If no principal set yet, auto-set the first uploaded image
      if (!principalImage && uploadedIds.length > 0) {
        onPrincipalChange(uploadedIds[0]);
      }

      toast.success(`تم رفع ${uploadedIds.length} صورة بنجاح ✅`);
    } catch {
      toast.error("فشل رفع بعض الصور");
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      e.target.value = "";
    }
  };

  const removeImage = (imgId: string) => {
    const newGallery = galleryImages.filter((id) => id !== imgId);
    onGalleryChange(newGallery);
    // If removing the principal, auto-promote the next image
    if (imgId === principalImage) {
      onPrincipalChange(newGallery[0] || "");
    }
  };

  const setPrincipal = (imgId: string) => {
    onPrincipalChange(imgId);
    // Make sure it's also in the gallery array
    if (!galleryImages.includes(imgId)) {
      onGalleryChange([imgId, ...galleryImages]);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-secondary/20 border border-border">
      {/* Header */}
      <Label className="flex items-center gap-2 text-sm font-semibold">
        <Images size={15} className="text-primary" />
        معرض الصور
        <span className="text-xs font-normal text-muted-foreground mr-auto">
          ⭐ انقر على التاج لاختيار الصورة الرئيسية
        </span>
      </Label>

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        className="relative w-full border-dashed hover:border-primary/50 gap-2 text-sm"
        disabled={uploading}
      >
        {uploading ? (
          <><Loader2 size={15} className="animate-spin" /> جارٍ رفع الصور...</>
        ) : (
          <><Upload size={15} /> رفع صور للمعرض (يمكن اختيار أكثر من صورة)</>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleUpload}
          disabled={uploading}
        />
      </Button>

      {/* Gallery grid */}
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          {galleryImages.map((imgId, i) => {
            const isPrincipal = imgId === principalImage;
            return (
              <div
                key={imgId + i}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  isPrincipal
                    ? "border-primary shadow-[0_0_12px_hsl(0_72%_51%/0.4)]"
                    : "border-border hover:border-primary/40"
                }`}
                style={{ background: "hsl(0,0%,8%)" }}
              >
                {/* Image */}
                <div className="aspect-square flex items-center justify-center p-1">
                  <ItemImage
                    src={imgId}
                    className="w-full h-full object-contain"
                    alt={`صورة ${i + 1}`}
                  />
                </div>

                {/* Principal crown badge */}
                {isPrincipal && (
                  <div
                    className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex items-center gap-0.5"
                    style={{ background: "hsl(0 72% 51%)" }}
                  >
                    <Star size={8} className="fill-white" />
                    رئيسية
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!isPrincipal && (
                    <button
                      type="button"
                      onClick={() => setPrincipal(imgId)}
                      title="تعيين كصورة رئيسية"
                      className="p-1.5 rounded-lg bg-primary text-white text-[10px] font-bold hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Star size={11} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(imgId)}
                    title="حذف"
                    className="p-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {galleryImages.length === 0 && (
        <p className="text-center text-xs text-muted-foreground py-4">
          لم يتم رفع أي صورة بعد
        </p>
      )}
    </div>
  );
};

export default GalleryField;
