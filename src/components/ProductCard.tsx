import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import ItemImage from "./ItemImage";
import CheckoutModal from "./CheckoutModal";
import { createPortal } from "react-dom";

const ProductCard = ({ product, index = 0 }: { product: any; index?: number }) => {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { t } = useLanguage();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const wishlisted = isWishlisted(product._id || product.id);

  // Out-of-stock guard: either inStock is false OR stockQuantity is 0
  const outOfStock = !product.inStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    toast.success(t("cart.added"));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!wishlisted) {
      toast.success("تمت إضافة المنتج إلى المفضلة ❤️", {
        style: { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 72% 51% / 0.3)", color: "hsl(0 0% 95%)" },
      });
    } else {
      toast.info("تمت إزالة المنتج من المفضلة");
    }
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setCheckoutOpen(true);
  };

  const productId = product.id || product._id;

  return (
    <>
      <Link to={`/product/${productId}`} className="block group">
        <div
          className={`rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${outOfStock ? "opacity-60 grayscale" : "hover:-translate-y-1"}`}
          style={{
            background: "hsl(0 0% 7%)",
            border: outOfStock ? "1px solid hsla(0,0%,100%,0.04)" : "1px solid hsla(0,0%,100%,0.07)",
            boxShadow: "0 4px 24px -6px rgba(0,0,0,0.5)",
          }}
        >
          {/* ── Image area ── */}
          <div className="relative bg-[hsl(0,0%,10%)] overflow-hidden">
            {/* Badge — top left */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {outOfStock && (
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white"
                  style={{ background: "hsl(0 0% 30%)" }}
                >
                  نفذ من المخزون
                </span>
              )}
              {!outOfStock && product.isPromo && (
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white"
                  style={{ background: "hsl(0 72% 51%)" }}
                >
                  PROMO
                </span>
              )}
              {!outOfStock && product.isNew && (
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white"
                  style={{ background: "hsl(0 72% 45%)" }}
                >
                  NEW
                </span>
              )}
            </div>

            {/* Wishlist heart — top right */}
            <button
              onClick={handleToggleWishlist}
              aria-label="أضف للمفضلة"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 btn-press"
              style={{
                background: wishlisted ? "hsl(0 72% 51% / 0.15)" : "hsla(0,0%,0%,0.4)",
                backdropFilter: "blur(6px)",
                border: wishlisted ? "1px solid hsl(0 72% 51% / 0.5)" : "1px solid hsla(0,0%,100%,0.1)",
              }}
            >
              <Heart
                size={14}
                className="transition-all duration-200"
                style={{
                  color: wishlisted ? "hsl(0 72% 51%)" : "rgba(255,255,255,0.7)",
                  fill: wishlisted ? "hsl(0 72% 51%)" : "transparent",
                  transform: wishlisted ? "scale(1.15)" : "scale(1)",
                }}
              />
            </button>

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

            {/* Short description */}
            {(product.descriptionAr || product.description) && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed -mt-1">
                {product.descriptionAr || product.description}
              </p>
            )}

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

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {/* Cart icon button */}
              <button
                onClick={handleAddToCart}
                aria-label="أضف للسلة"
                disabled={outOfStock}
                className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                  outOfStock ? "cursor-not-allowed opacity-40" : "hover:scale-105 btn-press"
                }`}
                style={{
                  borderColor: outOfStock ? "hsla(0,0%,50%,0.3)" : "hsla(0,72%,51%,0.4)",
                  color: outOfStock ? "hsl(0 0% 50%)" : "hsl(0 72% 51%)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!outOfStock) (e.currentTarget as HTMLElement).style.background = "hsl(0 72% 51% / 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <ShoppingCart size={16} />
              </button>

              {/* Order Now button */}
              <button
                onClick={handleOrderNow}
                disabled={outOfStock}
                className={`flex-1 h-10 rounded-lg text-sm font-bold text-white transition-all duration-200 ${
                  outOfStock ? "cursor-not-allowed" : "hover:opacity-90 btn-press"
                }`}
                style={{
                  background: outOfStock ? "hsl(0 0% 25%)" : "hsl(0 72% 51%)",
                  boxShadow: outOfStock ? "none" : "0 4px 14px hsl(0 72% 51% / 0.3)",
                  color: outOfStock ? "hsl(0 0% 55%)" : "#fff",
                }}
              >
                {outOfStock ? "غير متوفر" : "اطلب الآن"}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Render modal via portal so it doesn't affect page layout */}
      {checkoutOpen && createPortal(
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={product}
        />,
        document.body
      )}
    </>
  );
};

export default ProductCard;
