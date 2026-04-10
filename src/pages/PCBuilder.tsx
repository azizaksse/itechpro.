import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, MonitorDot, HardDrive, CircuitBoard, Battery, Box, Fan,
  Trash2, Zap, Keyboard, Mouse, Headphones, ShoppingCart,
  RotateCcw, ChevronLeft, CheckCircle2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { products, formatPrice } from "@/data/products";

interface BuildSlot {
  id: string;
  nameAr: string;
  subtitleAr: string;
  icon: any;
  category: string;
  selected: string | null;
}

const initialSlots: BuildSlot[] = [
  { id: "cpu",         nameAr: "المعالج",        subtitleAr: "اختر معالجك المفضل",          icon: Cpu,        category: "processors",     selected: null },
  { id: "gpu",         nameAr: "كرت الشاشة",     subtitleAr: "اختر بطاقة الرسومات",         icon: Zap,        category: "graphics-cards", selected: null },
  { id: "ram",         nameAr: "الذاكرة العشوائية", subtitleAr: "اختر سعة الرام",            icon: HardDrive,  category: "ram",            selected: null },
  { id: "storage",     nameAr: "وحدة التخزين",   subtitleAr: "SSD أو HDD أو كليهما",        icon: HardDrive,  category: "storage",        selected: null },
  { id: "motherboard", nameAr: "اللوحة الأم",    subtitleAr: "اختر لوحتك الأم",              icon: CircuitBoard, category: "motherboards", selected: null },
  { id: "psu",         nameAr: "مزود الطاقة",    subtitleAr: "اختر وحدة الطاقة المناسبة",    icon: Battery,    category: "power-supplies", selected: null },
  { id: "case",        nameAr: "الصندوق",         subtitleAr: "اختر هيكل الحاسوب",           icon: Box,        category: "cases",          selected: null },
  { id: "cooling",     nameAr: "نظام التبريد",    subtitleAr: "اختر نظام تبريد فعّال",        icon: Fan,        category: "cooling",        selected: null },
  { id: "monitor",     nameAr: "الشاشة",          subtitleAr: "اختر شاشتك المثالية",          icon: MonitorDot, category: "monitors",       selected: null },
  { id: "keyboard",    nameAr: "لوحة المفاتيح",   subtitleAr: "اختر لوحة المفاتيح المناسبة", icon: Keyboard,   category: "keyboards",      selected: null },
  { id: "mouse",       nameAr: "الفأرة",           subtitleAr: "اختر الفأرة المناسبة",         icon: Mouse,      category: "mice",           selected: null },
  { id: "headset",     nameAr: "سماعة الرأس",     subtitleAr: "اختر سماعتك المفضلة",          icon: Headphones, category: "headsets",       selected: null },
];

const PCBuilder = () => {
  const [slots, setSlots] = useState<BuildSlot[]>(initialSlots);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const totalPrice = useMemo(() => {
    return slots.reduce((sum, slot) => {
      if (slot.selected) {
        const p = products.find((pr) => pr.id === slot.selected);
        return sum + (p?.price || 0);
      }
      return sum;
    }, 0);
  }, [slots]);

  const selectedCount = slots.filter((s) => s.selected).length;

  const activeSlotData = slots.find((s) => s.id === activeSlot);
  const availableProducts = activeSlotData
    ? products.filter((p) => p.category === activeSlotData.category)
    : [];

  const selectProduct = (productId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === activeSlot ? { ...s, selected: productId } : s))
    );
    setActiveSlot(null);
  };

  const removeProduct = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, selected: null } : s))
    );
  };

  const resetBuild = () => {
    setSlots(initialSlots.map((s) => ({ ...s, selected: null })));
    setActiveSlot(null);
  };

  const totalWattage = useMemo(() => {
    let w = 0;
    slots.forEach((s) => {
      if (s.selected) {
        const p = products.find((pr) => pr.id === s.selected);
        const power = p?.specs?.["الطاقة"] || p?.specs?.["القدرة"];
        if (power) {
          const num = parseInt(power);
          if (!isNaN(num)) w += num;
        }
      }
    });
    return w;
  }, [slots]);

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-border/30">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, hsl(0 72% 20% / 0.25), transparent 65%), radial-gradient(ellipse at 10% 80%, hsl(0 72% 15% / 0.15), transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container relative z-10 py-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-2"
          >
            ابنِ <span className="text-gradient">حاسوبك</span> بطريقتك
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-base max-w-lg mx-auto"
          >
            اختر القطع المتوافقة واحصل على أفضل تجميعة بأسعار لا تُنافس
          </motion.p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ───── Left: Component Cards ───── */}
          <div>
            <AnimatePresence mode="wait">
              {activeSlot && availableProducts.length > 0 ? (
                <motion.div
                  key="picker"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => setActiveSlot(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>العودة للقائمة</span>
                  </button>

                  <h2 className="text-lg font-bold mb-4">
                    اختر {activeSlotData?.nameAr}
                  </h2>

                  <div className="space-y-3">
                    {availableProducts.map((p) => (
                      <motion.button
                        key={p.id}
                        layout
                        onClick={() => selectProduct(p.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl text-right glass-card glass-card-hover transition-all"
                        whileTap={{ scale: 0.98 }}
                      >
                        <img
                          src={p.image}
                          alt={p.nameAr}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{p.nameAr}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.brand}</p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">
                          {formatPrice(p.price)}
                        </span>
                      </motion.button>
                    ))}

                    {availableProducts.length === 0 && (
                      <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
                        لا توجد منتجات في هذه الفئة حالياً
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="slots"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {slots.map((slot, i) => {
                    const selectedProduct = slot.selected
                      ? products.find((p) => p.id === slot.selected)
                      : null;
                    const Icon = slot.icon;
                    const isSelected = !!selectedProduct;

                    return (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className={`relative rounded-2xl border transition-all duration-200 p-5 flex flex-col gap-4
                          ${isSelected
                            ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_hsl(0_72%_51%/0.08)]"
                            : "border-border/40 bg-card hover:border-primary/30 hover:bg-card/80"
                          }`}
                      >
                        {/* Status dot */}
                        {isSelected && (
                          <CheckCircle2
                            size={16}
                            className="absolute top-4 left-4 text-primary"
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                            ${isSelected ? "bg-primary/15" : "bg-secondary"}`}
                        >
                          <Icon
                            size={26}
                            className={isSelected ? "text-primary" : "text-muted-foreground"}
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <h3 className="font-bold text-base leading-tight">{slot.nameAr}</h3>
                          {selectedProduct ? (
                            <p className="text-xs text-primary mt-1 font-medium truncate">
                              {selectedProduct.nameAr}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-1">
                              {slot.subtitleAr}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 mt-auto">
                          {selectedProduct && (
                            <span className="text-sm font-bold text-primary">
                              {formatPrice(selectedProduct.price)}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mr-auto">
                            {selectedProduct && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeProduct(slot.id);
                                }}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => setActiveSlot(slot.id)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                ${isSelected
                                  ? "border-primary/50 text-primary hover:bg-primary/10"
                                  : "border-border/60 text-foreground hover:border-primary/50 hover:text-primary"
                                }`}
                            >
                              {isSelected ? "تغيير" : "اختر"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ───── Right: Sticky Summary Sidebar ───── */}
          <div className="sticky top-20 space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-border/40">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold">تجميعتك</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {selectedCount} / {slots.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-secondary rounded-full mb-5 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${(selectedCount / slots.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Selected components list */}
              <div className="space-y-2 mb-5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                {slots.map((s) => {
                  const p = s.selected ? products.find((pr) => pr.id === s.selected) : null;
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <Icon
                        size={13}
                        className={p ? "text-primary shrink-0" : "text-muted-foreground/40 shrink-0"}
                      />
                      <span
                        className={`flex-1 truncate ${p ? "text-foreground" : "text-muted-foreground/50"}`}
                      >
                        {p ? p.nameAr : s.nameAr}
                      </span>
                      {p && (
                        <span className="font-semibold text-primary shrink-0">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-border/30 pt-4 space-y-2 mb-5">
                {totalWattage > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>الطاقة التقديرية</span>
                    <span className="font-mono">{totalWattage} W</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">المجموع</span>
                  <span className="text-xl font-bold text-primary">
                    {totalPrice > 0 ? formatPrice(totalPrice) : "—"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="hero"
                  className="w-full pulse-glow"
                  disabled={selectedCount === 0}
                >
                  <ShoppingCart size={15} className="ml-2" />
                  اطلب التجميعة
                </Button>
                <button
                  onClick={resetBuild}
                  className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors py-2"
                >
                  <RotateCcw size={12} />
                  إعادة تعيين التجميعة
                </button>
              </div>
            </div>

            {/* Tips card */}
            <div className="rounded-2xl border border-border/30 p-4 bg-primary/5">
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                💡 انقر على أي بطاقة أو زر <strong className="text-foreground">"اختر"</strong> لتحديد القطعة المناسبة
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PCBuilder;
