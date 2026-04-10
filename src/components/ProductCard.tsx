import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import ItemImage from "./ItemImage";

const ProductCard = ({ product, index = 0 }: { product: any; index?: number }) => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(t("cart.added"));
  };

  const productId = product.id || product._id;

  return (
    <Link to={`/product/${productId}`} className="block group">
      <div
        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "hsl(0 0% 7%)",
          border: "1px solid hsla(0,0%,100%,0.07)",
          boxShadow: "0 4px 24px -6px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Image area ── */}
        <div className="relative bg-[hsl(0,0%,10%)] overflow-hidden">
          {/* Badge — top left (matching screenshot) */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isPromo && (
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white"
                style={{ background: "hsl(0 72% 51%)" }}
              >
                PROMO
              </span>
            )}
            {product.isNew && (
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white"
                style={{ background: "hsl(0 72% 45%)" }}
              >
                NEW
              </span>
            )}
          </div>

          {/* Stock dot — top right */}
          {product.inStock && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 stock-pulse" />
              <span className="text-[10px] text-green-400 font-medium">متوفر</span>
            </div>
          )}

          {/* Product image */}
          <div className="aspect-[4/3] flex items-center justify-center p-4 img-zoom-container">
            <ItemImage
              src={product.image}
              alt={product.nameAr}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* ── Info area ── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Brand */}
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            {product.brand}
          </p>

          {/* Product name */}
          <h3
            className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200"
            style={{ color: "hsl(0 0% 92%)" }}
          >
            {product.nameAr}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2 flex-wrap mt-auto">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span
              className="text-base font-extrabold"
              style={{ color: "hsl(0 72% 51%)" }}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Action buttons — matches screenshot layout */}
          <div className="flex gap-2 pt-1">
            {/* Cart icon button */}
            <button
              onClick={handleAddToCart}
              aria-label="أضف للسلة"
              className="w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-105 btn-press"
              style={{
                borderColor: "hsla(0,72%,51%,0.4)",
                color: "hsl(0 72% 51%)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(0 72% 51% / 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <ShoppingCart size={16} />
            </button>

            {/* Shop Now button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 rounded-lg text-sm font-bold text-white transition-all duration-200 hover:opacity-90 btn-press"
              style={{
                background: "hsl(0 72% 51%)",
                boxShadow: "0 4px 14px hsl(0 72% 51% / 0.3)",
              }}
            >
              اطلب الآن
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
