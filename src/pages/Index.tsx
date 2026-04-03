import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Truck, Shield, Headphones, Award, BadgePercent, Monitor, Laptop, Cpu, Zap, HardDrive, CircuitBoard, Battery, Box, Fan, Keyboard, Mouse as MouseIcon, Headphones as HeadphonesIcon, Cable, Video, MonitorDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/Layout";
import FAQSection from "@/components/FAQSection";
import UsageCategorySection from "@/components/UsageCategorySection";
import ScrollReveal from "@/components/ScrollReveal";
import HeroParticles from "@/components/HeroParticles";

import { useLanguage } from "@/contexts/LanguageContext";
import { products, categories } from "@/data/products";
import heroImg from "@/assets/hero-pc.png";

const categoryIcons: Record<string, any> = {
  Monitor, Laptop, Cpu, Zap, HardDrive, CircuitBoard, Battery, Box, Fan, MonitorDot, Keyboard, Mouse: MouseIcon, Headphones: HeadphonesIcon, Cable, Video, MemoryStick: HardDrive,
};

const featureKeys = ["feat.delivery", "feat.original", "feat.support", "feat.warranty", "feat.prices"];
const featureIcons = [Truck, Shield, Headphones, Award, BadgePercent];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Index = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(4);
  const [visibleNewCount, setVisibleNewCount] = useState(4);
  const [visiblePromoCount, setVisiblePromoCount] = useState(4);
  const allNewProducts = products.filter((p) => p.isNew);
  const newProducts = allNewProducts.slice(0, visibleNewCount);
  const allPromoProducts = products.filter((p) => p.isPromo);
  const promoProducts = allPromoProducts.slice(0, isMobile ? visiblePromoCount : allPromoProducts.length);
  const visibleProducts = products.slice(0, isMobile ? visibleCount : Math.max(visibleCount, products.length));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, hsl(0 72% 20% / 0.4), transparent 70%), radial-gradient(ellipse at 80% 80%, hsl(0 72% 15% / 0.15), transparent 50%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 8s ease-in-out infinite',
          }}
        />
        <HeroParticles />
        
        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 text-center lg:text-right"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6"
              style={{ textWrap: 'balance' }}
            >
              {t("hero.title")} <span className="text-gradient">{t("hero.country")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" asChild className="pulse-glow btn-press hover-neon">
                <Link to="/products">{t("hero.browse")}</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="btn-press hover-neon">
                <Link to="/pc-builder">{t("hero.build")}</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 max-w-lg lg:max-w-xl animate-float"
          >
            <img
              src={heroImg}
              alt="Gaming PC"
              className="w-full rounded-2xl"
              style={{ filter: 'drop-shadow(0 0 60px hsl(0 72% 51% / 0.25))' }}
            />
          </motion.div>
        </div>
      </section>


      {/* Features */}
      <section className="py-12 overflow-hidden">
        <div className="container hidden sm:block">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="flex flex-col items-center text-center gap-2 p-4 rounded-xl hover:bg-secondary/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{t(key)}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        <div className="sm:hidden overflow-hidden py-3" style={{ direction: 'ltr' }}>
          <div className="flex w-max animate-marquee-ltr gap-6">
            {[...featureKeys, ...featureKeys].map((key, i) => {
              const Icon = featureIcons[i % featureKeys.length];
              return (
                <div key={i} className="flex items-center gap-2 px-3 shrink-0" style={{ direction: 'rtl' }}>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t(key)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* New Products */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{t("section.newProducts")}</h2>
              <Link to="/products" className="text-sm text-primary hover:underline">{t("section.viewAll")}</Link>
            </div>
          </ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {newProducts.map((p, i) => (
              <motion.div key={p.id} variants={staggerItem}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
          {visibleNewCount < allNewProducts.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="btn-press" onClick={() => setVisibleNewCount((c) => Math.min(c + 6, allNewProducts.length))}>
                {t("section.loadMore")} ({allNewProducts.length - visibleNewCount} {t("section.remaining")})
              </Button>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-8 text-center">{t("section.categories")}</h2>
          </ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {categories.filter((cat) => !isMobile || cat.id !== "streaming").map((cat, i) => {
              const Icon = categoryIcons[cat.icon] || Monitor;
              return (
                <motion.div key={cat.id} variants={staggerItem}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="glass-card glass-card-hover glow-border-hover rounded-xl p-4 flex flex-col items-center gap-2 text-center group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{cat.nameAr}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* All Products */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{t("section.allProducts")} <span className="text-primary">{t("section.allProductsSuffix")}</span></h2>
              <Link to="/products" className="text-sm text-primary hover:underline">{t("section.viewAll")}</Link>
            </div>
          </ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {visibleProducts.map((p, i) => (
              <motion.div key={p.id} variants={staggerItem}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
          {visibleCount < products.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="btn-press" onClick={() => setVisibleCount((c) => Math.min(c + 8, products.length))}>
                {t("section.loadMore")} ({products.length - visibleCount} {t("section.remaining")})
              </Button>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Promo Products */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{t("section.specialOffers")} <span className="text-primary">{t("section.specialOffersSuffix")}</span></h2>
              <Link to="/products?promo=true" className="text-sm text-primary hover:underline">{t("section.viewAll")}</Link>
            </div>
          </ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {promoProducts.map((p, i) => (
              <motion.div key={p.id} variants={staggerItem}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
          {isMobile && visiblePromoCount < allPromoProducts.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="btn-press" onClick={() => setVisiblePromoCount((c) => Math.min(c + 4, allPromoProducts.length))}>
                {t("section.loadMore")} ({allPromoProducts.length - visiblePromoCount} {t("section.remaining")})
              </Button>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Usage Category */}
      <UsageCategorySection />

      <SectionDivider />

      {/* FAQ */}
      <FAQSection />

      <SectionDivider />

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, hsl(0 72% 15% / 0.3), transparent 70%)' }} />
        <div className="container relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
            <Button variant="hero" size="lg" asChild className="pulse-glow btn-press hover-neon">
              <Link to="/pc-builder">{t("cta.buildNow")}</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
