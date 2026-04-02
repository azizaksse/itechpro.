import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Truck, Shield, Headphones, Award, BadgePercent, Monitor, Laptop, Cpu, Zap, HardDrive, CircuitBoard, Battery, Box, Fan, Keyboard, Mouse as MouseIcon, Headphones as HeadphonesIcon, Cable, Video, MonitorDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/Layout";
import { products, categories } from "@/data/products";
import heroImg from "@/assets/hero-pc.png";

const categoryIcons: Record<string, any> = {
  Monitor, Laptop, Cpu, Zap, HardDrive, CircuitBoard, Battery, Box, Fan, MonitorDot, Keyboard, Mouse: MouseIcon, Headphones: HeadphonesIcon, Cable, Video, MemoryStick: HardDrive,
};

const features = [
  { icon: Truck, text: "توصيل سريع إلى جميع الولايات" },
  { icon: Shield, text: "منتجات أصلية 100%" },
  { icon: Headphones, text: "دعم تقني قبل وبعد الشراء" },
  { icon: Award, text: "ضمان على المنتجات" },
  { icon: BadgePercent, text: "أفضل أسعار في السوق" },
];

const Index = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [visibleNewCount, setVisibleNewCount] = useState(6);
  const allNewProducts = products.filter((p) => p.isNew);
  const newProducts = allNewProducts.slice(0, visibleNewCount);
  const promoProducts = products.filter((p) => p.isPromo).slice(0, 8);
  const visibleProducts = products.slice(0, visibleCount);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -20%, hsl(0 72% 20% / 0.4), transparent 70%)' }} />
        
        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 py-16">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-right"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6" style={{ textWrap: 'balance' }}>
              أفضل متجر لبيع الحواسيب وقطع الكمبيوتر في <span className="text-gradient">الجزائر</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              اكتشف أحدث الحواسيب وقطع الكمبيوتر الأصلية بأفضل الأسعار مع توصيل سريع لكل الولايات.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button variant="hero" size="lg" asChild className="pulse-glow">
                <Link to="/products">تصفح المنتجات</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/pc-builder">ابنِ حاسوبك الآن</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-lg lg:max-w-xl"
          >
            <img src={heroImg} alt="Gaming PC" className="w-full rounded-2xl" style={{ filter: 'drop-shadow(0 0 40px hsl(0 72% 51% / 0.2))' }} />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-secondary overflow-hidden">
        {/* Desktop: grid */}
        <div className="container hidden sm:block">
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-2 p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <f.icon size={18} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Mobile: auto-scrolling marquee */}
        <div className="sm:hidden overflow-hidden py-3" style={{ direction: 'ltr' }}>
          <div className="flex w-max animate-marquee-ltr gap-6">
            {[...features, ...features].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 shrink-0" style={{ direction: 'rtl' }}>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">منتجات جديدة</h2>
            <Link to="/products" className="text-sm text-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {visibleNewCount < allNewProducts.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => setVisibleNewCount((c) => Math.min(c + 6, allNewProducts.length))}>
                تحميل المزيد ({allNewProducts.length - visibleNewCount} متبقي)
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">الأصناف</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.icon] || Monitor;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="glass-card glass-card-hover rounded-xl p-4 flex flex-col items-center gap-2 text-center group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{cat.nameAr}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">جميع <span className="text-primary">المنتجات</span></h2>
            <Link to="/products" className="text-sm text-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {visibleCount < products.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => Math.min(c + 8, products.length))}>
                تحميل المزيد ({products.length - visibleCount} متبقي)
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Promo Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">عروض <span className="text-primary">خاصة</span></h2>
            <Link to="/products?promo=true" className="text-sm text-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {promoProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, hsl(0 72% 15% / 0.3), transparent 70%)' }} />
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لبناء حاسوبك المثالي؟</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">اختر القطع المتوافقة وابدأ ببناء حاسوب أحلامك بأفضل الأسعار</p>
          <Button variant="hero" size="lg" asChild className="pulse-glow">
            <Link to="/pc-builder">ابدأ البناء الآن</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
