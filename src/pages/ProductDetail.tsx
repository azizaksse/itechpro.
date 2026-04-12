import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowRight, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";

const ProductDetail = () => {
  const { id } = useParams();
  const [relatedPage, setRelatedPage] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Track selected variants
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { addItem } = useCart();
  const { products, loading } = useProducts();
  const product = products.find((p) => (p._id || p.id) === id);

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

  // Determine which image to show
  const displayImage =
    normalizedColors.length > 0 && 
    normalizedColors[selectedColorIndex] && 
    normalizedColors[selectedColorIndex].imageId 
      ? normalizedColors[selectedColorIndex].imageId 
      : product?.image;

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
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-4">
            <ItemImage src={displayImage} alt={product.nameAr} className="max-w-full max-h-full object-contain" />
          </motion.div>

          {/* Info */}
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
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-primary/70 stock-pulse" />
                  <span className="text-sm text-primary/80 font-medium">متوفر في المخزون</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">غير متوفر</span>
              )}
            </div>

            {/* Colors variant picker */}
            {normalizedColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  اللون: 
                  <span className="text-muted-foreground font-normal">
                    {normalizedColors[selectedColorIndex].label}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {normalizedColors.map((c: any, i: number) => (
                    <button
                      key={c.hex + i}
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

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <Button variant="hero" size="lg" className="flex-1 pulse-glow" onClick={handleAddToCart}>
                <ShoppingCart size={18} className="ml-2" /> أضف إلى السلة
              </Button>
              <Button variant="heroOutline" size="lg">
                <Heart size={18} />
              </Button>
            </div>
            <Button
              variant="cyber"
              size="lg"
              className="w-full mb-8 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all"
              onClick={() => setCheckoutOpen(true)}
            >
              اشتري الآن
            </Button>

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
                  <span className="text-sm font-medium font-mono">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">منتجات مشابهة</h2>
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setRelatedPage((p) => Math.max(0, p - 1))}
                    disabled={relatedPage === 0}
                    className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
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
