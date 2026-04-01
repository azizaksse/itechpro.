import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";

const faqs = [
  { q: "هل المنتجات أصلية؟", a: "نعم، جميع منتجاتنا أصلية 100% ومستوردة من مصادر معتمدة مع ضمان الجودة." },
  { q: "هل يوجد ضمان؟", a: "نعم، جميع المنتجات تأتي مع ضمان يختلف حسب نوع المنتج والعلامة التجارية." },
  { q: "كم مدة التوصيل؟", a: "عادة ما يستغرق التوصيل من 2 إلى 5 أيام عمل حسب الولاية." },
  { q: "هل يمكن استبدال المنتج؟", a: "نعم، يمكن استبدال أو إرجاع المنتج خلال 7 أيام من الاستلام بشرط أن يكون في حالته الأصلية." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عند الاستلام والتحويل البنكي وبريدي موب." },
  { q: "هل تتوفرون على خدمة التجميع؟", a: "نعم، نوفر خدمة تجميع الحواسيب مع اختبار شامل قبل الإرسال." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Layout>
      <div className="container py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">الأسئلة الشائعة</h1>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-right"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default FAQ;
