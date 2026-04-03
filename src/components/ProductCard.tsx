import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(t("cart.added"));
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="glass-card glass-card-hover glow-border-hover rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-secondary/30 img-zoom-container">
          <img
            src={product.image}
            alt={product.nameAr}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">{t("product.new")}</span>
            )}
            {product.isPromo && (
              <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-[10px] font-bold">{t("product.promo")}</span>
            )}
          </div>
          {/* Quick actions */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-8 h-8 rounded-md bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 btn-press">
              <Heart size={14} />
            </button>
            <button onClick={handleAddToCart} className="w-8 h-8 rounded-md bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 btn-press">
              <ShoppingCart size={14} />
            </button>
          </div>
          {/* Stock */}
          {product.inStock && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 stock-pulse" />
              <span className="text-[10px] text-green-400 font-medium">{t("product.inStock")}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">{product.nameAr}</h3>

          {/* Specs strip */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <span key={key} className="shrink-0 px-2 py-0.5 rounded bg-secondary text-[10px] text-muted-foreground">
                {val}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
