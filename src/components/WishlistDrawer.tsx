import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, X, HeartOff } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";
import ItemImage from "@/components/ItemImage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const itemVariants = {
  initial: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, stiffness: 350, damping: 25 } },
  exit: { opacity: 0, x: -30, scale: 0.9, transition: { duration: 0.2 } },
};

const WishlistDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success("تمت إضافة المنتج إلى السلة 🛒", {
      style: { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 72% 51% / 0.3)", color: "hsl(0 0% 95%)" },
    });
  };

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    toast.info(`تم إزالة "${name}" من المفضلة`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0 [&>button.absolute]:hidden">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-secondary">
          <SheetTitle className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>
            <span className="flex items-center gap-2">
              <Heart size={20} className="text-primary fill-primary" />
              قائمة المفضلة ({totalItems})
            </span>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                مسح الكل
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground p-8"
            >
              <HeartOff size={56} className="opacity-20" />
              <p className="text-sm text-center">لا توجد منتجات في قائمة المفضلة بعد</p>
              <Button variant="heroOutline" size="sm" onClick={() => setIsOpen(false)} asChild>
                <Link to="/products">تصفح المنتجات</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
            >
              <AnimatePresence initial={false}>
                {items.map((product) => {
                  const productId = product._id || product.id;
                  return (
                    <motion.div
                      key={productId}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-colors"
                    >
                      {/* Product image — clickable */}
                      <Link
                        to={`/product/${productId}`}
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-secondary flex items-center justify-center"
                      >
                        <ItemImage
                          src={product.image}
                          alt={product.nameAr}
                          className="w-full h-full object-contain p-1"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${productId}`}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors block mb-1"
                        >
                          {product.nameAr}
                        </Link>
                        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                        <p className="text-sm font-bold text-primary">{formatPrice(product.price)}</p>
                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 btn-press"
                            style={{ background: "hsl(0 72% 51%)" }}
                          >
                            <ShoppingCart size={13} />
                            أضف للسلة
                          </button>
                          <button
                            onClick={() => handleRemove(productId, product.nameAr)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mr-auto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
