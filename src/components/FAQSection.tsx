import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Truck, Clock, ShieldCheck, Award, Banknote, Cpu, Package, Headphones, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const faqIcons = [Truck, Clock, ShieldCheck, Award, Banknote, Cpu, Package, Headphones];
const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8];

const FAQSection = ({ showCta = true }: { showCta?: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20">
      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            {t("faq.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t("faq.title")} <span className="text-primary">{t("faq.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqKeys.map((num, i) => {
            const isOpen = openIndex === i;
            const Icon = faqIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`rounded-2xl border transition-colors duration-200 ${
                  isOpen
                    ? "bg-card border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.08)]"
                    : "bg-card/50 border-secondary hover:border-primary/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-4 sm:p-5 text-right"
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`flex-1 font-medium text-sm sm:text-base text-right transition-colors duration-200 ${isOpen ? "text-foreground" : "text-foreground/80"}`}>
                    {t(`faq.q${num}`)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pr-16 sm:pr-[4.5rem]">
                        <p className="text-sm text-muted-foreground leading-relaxed">{t(`faq.a${num}`)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-14 text-center"
          >
            <div className="rounded-2xl bg-card border border-secondary p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(0 72% 15% / 0.2), transparent 70%)" }} />
              <div className="relative z-10">
                <MessageCircle size={32} className="text-primary mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">{t("faq.ctaTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  {t("faq.ctaSubtitle")}
                </p>
                <Button variant="hero" size="lg" asChild className="pulse-glow">
                  <a href="https://wa.me/213000000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} />
                    {t("faq.ctaButton")}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
