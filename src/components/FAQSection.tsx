import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Truck, Clock, ShieldCheck, Award, Banknote, Cpu, Package, Headphones, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  { icon: Truck, q: "هل توفرون التوصيل لجميع ولايات الجزائر؟", a: "نعم، نوصل إلى جميع الـ 58 ولاية عبر شركاء توصيل موثوقين لضمان وصول طلبك بأمان." },
  { icon: Clock, q: "كم تستغرق مدة التوصيل؟", a: "عادة ما يستغرق التوصيل بين 24 إلى 72 ساعة حسب الولاية والمنطقة." },
  { icon: ShieldCheck, q: "هل الحواسيب والقطع أصلية؟", a: "نعم، جميع المنتجات أصلية 100% ومستوردة من علامات تجارية وموردين معتمدين." },
  { icon: Award, q: "هل المنتجات تأتي مع ضمان؟", a: "نعم، جميع المنتجات تشمل ضماناً. مدة الضمان تختلف حسب نوع المنتج والعلامة التجارية." },
  { icon: Banknote, q: "هل يمكنني الدفع عند الاستلام؟", a: "نعم، خدمة الدفع عند الاستلام متوفرة في معظم ولايات الجزائر." },
  { icon: Cpu, q: "هل يمكنني طلب تجميع حاسوب مخصص؟", a: "نعم، يمكن للعملاء اختيار القطع وطلب تجميع حاسوب ألعاب أو حاسوب احترافي حسب الطلب." },
  { icon: Package, q: "ماذا لو وصل المنتج تالفاً؟", a: "تواصل معنا فوراً خلال 24 ساعة وسنساعدك في الاستبدال أو الإرجاع." },
  { icon: Headphones, q: "هل توفرون دعماً تقنياً؟", a: "نعم، فريقنا يساعد العملاء في اختيار القطع المناسبة ويوفر دعماً تقنياً بعد البيع." },
];

const FAQSection = ({ showCta = true }: { showCta?: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            الأسئلة الشائعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            الأسئلة <span className="text-primary">الشائعة</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            اعثر على إجابات سريعة حول الطلبات، التوصيل، الضمان، الدفع، ومعلومات المنتجات.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const Icon = faq.icon;
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
                    {faq.q}
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
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
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
                <h3 className="text-xl font-bold mb-2">لا تزال لديك أسئلة؟</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  فريقنا جاهز لمساعدتك. تواصل معنا عبر واتساب للحصول على إجابات فورية.
                </p>
                <Button variant="hero" size="lg" asChild className="pulse-glow">
                  <a href="https://wa.me/213000000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} />
                    تواصل معنا عبر واتساب
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
