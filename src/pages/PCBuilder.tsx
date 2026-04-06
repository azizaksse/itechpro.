import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Cpu, MonitorDot, HardDrive, CircuitBoard, Battery, Box, Fan, Plus, Trash2, Zap, Keyboard, Mouse, Headphones } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { products, formatPrice } from "@/data/products";

interface BuildSlot {
  id: string;
  nameAr: string;
  icon: any;
  category: string;
  selected: string | null;
}

const initialSlots: BuildSlot[] = [
  { id: "cpu", nameAr: "المعالج", icon: Cpu, category: "processors", selected: null },
  { id: "gpu", nameAr: "كرت الشاشة", icon: Zap, category: "graphics-cards", selected: null },
  { id: "ram", nameAr: "الرام", icon: HardDrive, category: "ram", selected: null },
  { id: "storage", nameAr: "التخزين", icon: HardDrive, category: "storage", selected: null },
  { id: "motherboard", nameAr: "اللوحة الأم", icon: CircuitBoard, category: "motherboards", selected: null },
  { id: "psu", nameAr: "مزود الطاقة", icon: Battery, category: "power-supplies", selected: null },
  { id: "case", nameAr: "الصندوق", icon: Box, category: "cases", selected: null },
  { id: "cooling", nameAr: "التبريد", icon: Fan, category: "cooling", selected: null },
  { id: "monitor", nameAr: "الشاشة", icon: MonitorDot, category: "monitors", selected: null },
  { id: "keyboard", nameAr: "لوحة المفاتيح", icon: Keyboard, category: "keyboards", selected: null },
  { id: "mouse", nameAr: "الفأرة", icon: Mouse, category: "mice", selected: null },
  { id: "headset", nameAr: "سماعة الرأس", icon: Headphones, category: "headsets", selected: null },
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

  const activeSlotData = slots.find((s) => s.id === activeSlot);
  const availableProducts = activeSlotData ? products.filter((p) => p.category === activeSlotData.category) : [];

  const selectProduct = (productId: string) => {
    setSlots((prev) => prev.map((s) => s.id === activeSlot ? { ...s, selected: productId } : s));
    setActiveSlot(null);
  };

  const removeProduct = (slotId: string) => {
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, selected: null } : s));
  };

  const totalWattage = useMemo(() => {
    let w = 0;
    slots.forEach((s) => {
      if (s.selected) {
        const p = products.find((pr) => pr.id === s.selected);
        const power = p?.specs["الطاقة"] || p?.specs["القدرة"];
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
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">ابنِ حاسوبك</h1>
          <p className="text-muted-foreground mb-8">اختر القطع المتوافقة واحصل على أفضل تجميعة</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slots */}
          <div className="lg:col-span-2 space-y-3">
            {slots.map((slot, i) => {
              const selectedProduct = slot.selected ? products.find((p) => p.id === slot.selected) : null;
              const Icon = slot.icon;
              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-150 ${activeSlot === slot.id ? 'ring-1 ring-primary shadow-[0_0_15px_hsl(0_72%_51%/0.2)]' : 'hover:ring-1 hover:ring-primary/20'}`}
                  onClick={() => setActiveSlot(slot.id)}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${selectedProduct ? 'bg-primary/10' : 'bg-secondary'}`}>
                    <Icon size={20} className={selectedProduct ? 'text-primary' : 'text-muted-foreground'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{slot.nameAr}</p>
                    {selectedProduct ? (
                      <p className="text-sm font-medium truncate">{selectedProduct.nameAr}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">اختر {slot.nameAr}</p>
                    )}
                  </div>
                  {selectedProduct ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-primary">{formatPrice(selectedProduct.price)}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeProduct(slot.id); }} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <Plus size={16} className="text-muted-foreground shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Summary / Product Selection */}
          <div className="space-y-4">
            {activeSlot && availableProducts.length > 0 ? (
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-bold mb-3">اختر {activeSlotData?.nameAr}</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {availableProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProduct(p.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 transition-all text-right"
                    >
                      <img src={p.image} alt={p.nameAr} className="w-10 h-10 rounded-md object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{p.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 sticky top-20">
                <h3 className="text-lg font-bold mb-4">ملخص التجميعة</h3>
                <div className="space-y-2 mb-4">
                  {slots.filter(s => s.selected).map((s) => {
                    const p = products.find(pr => pr.id === s.selected);
                    return (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{s.nameAr}</span>
                        <span className="font-medium">{p ? formatPrice(p.price) : '-'}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-secondary pt-3 mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">استهلاك الطاقة</span>
                    <span className="font-mono text-sm">{totalWattage}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">المجموع</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <Button variant="hero" className="w-full mt-4 pulse-glow" disabled={totalPrice === 0}>
                  اطلب التجميعة
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PCBuilder;
