import { motion } from "framer-motion";
import { Shield, Award, Headphones, Truck, Users } from "lucide-react";
import Layout from "@/components/Layout";

const reasons = [
  { icon: Shield, text: "منتجات أصلية مضمونة" },
  { icon: Award, text: "أسعار تنافسية" },
  { icon: Users, text: "خبرة في مجال الحواسيب" },
  { icon: Headphones, text: "دعم تقني احترافي" },
  { icon: Truck, text: "توصيل سريع" },
];

const About = () => {
  return (
    <Layout>
      <div className="container py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-6">من نحن</h1>
          <p className="text-muted-foreground leading-relaxed mb-12 text-lg">
            نحن متجر متخصص في بيع الحواسيب وقطع الكمبيوتر الأصلية في الجزائر. هدفنا هو توفير أحدث التقنيات بأسعار تنافسية مع خدمة احترافية ودعم تقني حقيقي للعملاء.
          </p>

          <h2 className="text-2xl font-bold mb-6">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <r.icon size={18} className="text-primary" />
                </div>
                <span className="font-medium text-sm">{r.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;
