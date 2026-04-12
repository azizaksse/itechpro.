import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ImageOff } from "lucide-react";

interface ItemImageProps {
  src?: string | null;
  className?: string;
  alt?: string;
}

// Convex storage IDs are base32-encoded strings, typically 32+ chars with no slashes or dots
// A simple heuristic: if it doesn't start with http/https, blob:, /, or data:, it's probably a storage ID
const isConvexStorageId = (src: string): boolean => {
  if (!src) return false;
  if (src.startsWith("http://") || src.startsWith("https://")) return false;
  if (src.startsWith("blob:")) return false;
  if (src.startsWith("/")) return false;
  if (src.startsWith("data:")) return false;
  // Must be a reasonably long alphanumeric string (Convex storage IDs)
  return src.length > 10 && /^[a-zA-Z0-9_-]+$/.test(src);
};

// Inner component that calls the query — always called, args may be skipped
const StorageImage = ({ storageId, className, alt }: { storageId: string; className?: string; alt?: string }) => {
  const imageUrl = useQuery(api.products.getImageUrl, { storageId });
  if (imageUrl === undefined) {
    // Loading — show shimmer skeleton
    return <div className={`animate-pulse bg-secondary/40 ${className}`} />;
  }
  if (!imageUrl) {
    // Storage ID resolved but no URL — broken reference
    return (
      <div className={`flex items-center justify-center bg-secondary/20 ${className}`}>
        <ImageOff size={20} className="text-muted-foreground/40" />
      </div>
    );
  }
  return <img src={imageUrl} className={className} alt={alt ?? ""} />;
};

export const ItemImage = ({ src, className, alt = "" }: ItemImageProps) => {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-secondary/30 ${className}`}>
        <ImageOff size={20} className="text-muted-foreground/40" />
      </div>
    );
  }

  if (isConvexStorageId(src)) {
    return <StorageImage storageId={src} className={className} alt={alt} />;
  }

  // Regular URL — just render an img tag
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent) {
          const fallback = document.createElement("div");
          fallback.className = "flex items-center justify-center w-full h-full bg-secondary/20";
          fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/30"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" y1="6" x2="15" y2="6"></line><path d="M14 14H7.6l-1.67-2.07a1 1 0 0 1 .62-1.6l.98-.16a1 1 0 0 0 .72-.53l.75-1.49"></path><path d="M20 14.5V7a1 1 0 0 0-1-1H9.5"></path></svg>`;
          parent.appendChild(fallback);
        }
      }}
    />
  );
};

export default ItemImage;
