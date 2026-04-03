import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLanguage();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0 [&>button.absolute]:hidden">
        <SheetHeader className="p-4 border-b border-secondary">
          <SheetTitle className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>
            <span className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              {t("cart.title")} ({totalItems})
            </span>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t("cart.clear")}
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag size={48} className="opacity-30" />
            <p className="text-sm">{t("cart.empty")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.nameAr}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
                      {item.product.nameAr}
                    </h4>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mr-auto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.total")}</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button variant="hero" size="lg" className="w-full pulse-glow">
                {t("cart.checkout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
