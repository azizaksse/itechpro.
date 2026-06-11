import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowRight, Check, ChevronLeft, ChevronRight, Loader2, ZoomIn } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";

const ProductDetail = () => {
  const { id } = useParams();
  const [relatedPage, setRelatedPage] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Track selected variants
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { products, loading } = useProducts();
  const product = products.find((p) => (p._id || p.id) === id);
  const wishlisted = isWishlisted(id || "");

  // Normalize colors from old or new structure
  const rawColors = (product as any)?.colors || [];
  const normalizedColors = rawColors.map((c: any) => {
    if (typeof c === "string") {
      const parts = c.split("|");
      return { hex: parts[0] || c, label: parts[1] || c, imageId: undefined };
    }
    return c;
  });

  const sizes = (product as any)?.sizes || [];

  // Build gallery: main image + any extra images array
  const extraImages: string[] = (product as any)?.images || [];
  const gallery: string[] = product?.image
    ? [product.image, ...extraImages.filter((img) => img !== product.image)]
    : extraImages;

  // Which image is currently shown in main view
  const displayImage =
    normalizedColors.length > 0 &&
    normalizedColors[selectedColorIndex] &&
    normalizedColors[selectedColorIndex].imageId
      ? normalizedColors[selectedColorIndex].imageId
      : gallery[selectedImageIndex] || product?.image;

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Button asChild variant="hero"><Link to="/products">العودة للمنتجات</Link></Button>
        </div>
      </Layout>
    );
  }

  const pId = product._id || product.id;
  const related = products.filter((p) => p.category === product.category && (p._id || p.id) !== pId);
  const perPage = 3;
  const totalPages = Math.ceil(related.length / perPage);
  const visibleRelated = related.slice(relatedPage * perPage, relatedPage * perPage + perPage);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("تمت إضافة المنتج إلى السلة بنجاح", {
      style: { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 72% 51% / 0.3)", color: "hsl(0 0% 95%)" },
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ArrowRight size={12} className="rotate-180" />
          <Link to="/products" className="hover:text-primary transition-colors">المنتجات</Link>
          <ArrowRight size={12} className="rotate-180" />
          <span className="text-foreground">{product.nameAr}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* ── Image Gallery ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3">
            {/* Main Image */}
            <div
              className="glass-card rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 relative group"
              style={{ border: "1px solid hsla(0,0%,100%,0.08)" }}
            >
              <ItemImage
                src={displayImage}
                alt={product.nameAr}
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {/* Zoom hint */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white" style={{ background: "hsl(0 72% 45%)" }}>NEW</span>
                )}
                {product.isPromo && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide text-white" style={{ background: "hsl(0 72% 51%)" }}>PROMO</span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {(gallery.length > 1 || normalizedColors.filter((c: any) => c.imageId).length > 0) && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    id={`gallery-thumb-${i}`}
                    onClick={() => {
                      setSelectedImageIndex(i);
                      setSelectedColorIndex(0);
                    }}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImageIndex === i && !normalizedColors[selectedColorIndex]?.imageId
                        ? "border-primary shadow-[0_0_12px_hsl(0_72%_51%/0.4)]"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{ background: "hsl(0,0%,10%)" }}
                  >
                    <ItemImage src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
                {/* Color variant thumbnails (only those with their own image) */}
                {normalizedColors
                  .filter((c: any) => c.imageId)
                  .map((c: any, i: number) => {
                    const originalIdx = normalizedColors.findIndex(
                      (col: any) => col.hex === c.hex && col.imageId === c.imageId
                    );
                    return (
                      <button
                        key={c.hex + "img" + i}
                        id={`color-gallery-thumb-${i}`}
                        onClick={() => setSelectedColorIndex(originalIdx)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          selectedColorIndex === originalIdx
                            ? "border-primary shadow-[0_0_12px_hsl(0_72%_51%/0.4)]"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ background: "hsl(0,0%,10%)" }}
                      >
                        <ItemImage src={c.imageId} alt={c.label} className="w-full h-full object-contain p-1" />
                      </button>
                    );
                  })}
              </div>
            )}
          </motion.div>

          {/* ── Info ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">{product.brand}</span>
              {product.isNew && <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">جديد</span>}
              {product.isPromo && <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-[10px] font-bold">عرض</span>}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.nameAr}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating || 5) ? "fill-primary text-primary" : "text-muted-foreground"} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews || 0} تقييم)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
              {product.oldPrice && (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold text-white" style={{ background: "hsl(142 72% 38%)" }}>
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 stock-pulse" />
                  <span className="text-sm text-green-400 font-medium">متوفر في المخزون</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">غير متوفر</span>
              )}
            </div>

            {/* Description */}
            {((product as any).descriptionAr || (product as any).description) && (
              <div className="mb-6 p-4 rounded-xl bg-secondary/20 border border-border/50">
                <h3 className="text-sm font-bold mb-2 text-muted-foreground">وصف المنتج</h3>
                <p className="text-sm leading-7 text-foreground/80 whitespace-pre-line">
                  {(product as any).descriptionAr || (product as any).description}
                </p>
              </div>
            )}

            {/* Colors variant picker */}
            {normalizedColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  اللون:
                  <span className="text-muted-foreground font-normal">
                    {normalizedColors[selectedColorIndex]?.label}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {normalizedColors.map((c: any, i: number) => (
                    <button
                      key={c.hex + i}
                      id={`color-swatch-${i}`}
                      onClick={() => setSelectedColorIndex(i)}
                      title={c.label}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColorIndex === i
                          ? "border-primary ring-4 ring-primary/20 scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes variant picker */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">المقاس / الأبعاد</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      id={`size-btn-${s}`}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        selectedSize === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/30 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-3">
              <Button
                id="add-to-cart-btn"
                variant="hero"
                size="lg"
                className="flex-1 pulse-glow btn-press"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} className="ml-2" /> أضف إلى السلة
              </Button>
              <Button
                id="wishlist-btn"
                variant="heroOutline"
                size="lg"
                className="btn-press"
                onClick={() => {
                  if (product) {
                    toggleItem(product);
                    toast[wishlisted ? "info" : "success"](
                      wishlisted ? "تمت إزالة المنتج من المفضلة" : "تمت إضافة المنتج إلى المفضلة ❤️",
                      wishlisted ? {} : { style: { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 72% 51% / 0.3)", color: "hsl(0 0% 95%)" } }
                    );
                  }
                }}
                style={wishlisted ? { borderColor: "hsl(0 72% 51% / 0.6)", background: "hsl(0 72% 51% / 0.08)" } : {}}
              >
                <Heart
                  size={18}
                  style={{
                    fill: wishlisted ? "hsl(0 72% 51%)" : "transparent",
                    color: wishlisted ? "hsl(0 72% 51%)" : undefined,
                  }}
                />
              </Button>
            </div>
            {/* Buy Now — green to distinguish from red Add-to-Cart */}
            <button
              id="buy-now-btn"
              onClick={() => setCheckoutOpen(true)}
              className="w-full h-11 mb-8 rounded-md text-sm font-bold transition-all duration-200 btn-press hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, hsl(142 72% 33%), hsl(142 72% 26%))",
                boxShadow: "0 4px 20px hsl(142 72% 33% / 0.3)",
                color: "#fff",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.92"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              🛒 اشتري الآن
            </button>

            {/* Perks */}
            <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck size={16} className="text-primary" />
                <span>توصيل سريع لجميع الولايات</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield size={16} className="text-primary" />
                <span>ضمان على المنتج</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check size={16} className="text-primary" />
                <span>منتج أصلي 100%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specs Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-4">المواصفات التقنية</h2>
            <div className="glass-card rounded-xl overflow-hidden bg-grid">
              {Object.entries(product.specs).map(([key, val], i) => (
                <div key={key} className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-secondary' : ''}`}>
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium font-mono">{val as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">منتجات مشابهة</h2>
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    id="related-prev-btn"
                    onClick={() => setRelatedPage((p) => Math.max(0, p - 1))}
                    disabled={relatedPage === 0}
                    className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    id="related-next-btn"
                    onClick={() => setRelatedPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={relatedPage === totalPages - 1}
                    className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleRelated.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </Layout>
  );
};

export default ProductDetail;
