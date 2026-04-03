import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import gamingImg from "@/assets/category-gaming.jpg";
import designImg from "@/assets/category-design.jpg";
import workImg from "@/assets/category-work.jpg";
import proImg from "@/assets/category-pro.jpg";

const cards = [
  {
    image: gamingImg,
    title: "قسم الألعاب",
    description: "أجهزة قوية للألعاب الحديثة مع أداء FPS عالي",
    specs: "RTX 4060 | 16GB RAM | 1TB SSD",
    button: "استكشف أجهزة الألعاب",
    link: "/products?category=gaming",
  },
  {
    image: designImg,
    title: "التصميم والمونتاج",
    description: "أجهزة مخصصة للمونتاج، التصميم الجرافيكي وصناعة المحتوى",
    specs: "RTX 3060 | 32GB RAM | 1TB NVMe",
    button: "عرض أجهزة التصميم",
    link: "/products?category=creator",
  },
  {
    image: workImg,
    title: "الدراسة والعمل",
    description: "أجهزة سريعة وموثوقة للدراسة، البرمجة والعمل المكتبي",
    specs: "Intel i5 | 16GB RAM | 512GB SSD",
    button: "تصفح أجهزة العمل",
    link: "/products?category=office",
  },
  {
    image: proImg,
    title: "احترافي",
    description: "حلول قوية للبرمجة، الذكاء الاصطناعي والرندر",
    specs: "RTX 4070 | 32GB RAM | 2TB SSD",
    button: "استكشف الفئة الاحترافية",
    link: "/products?category=workstation",
  },
];

const UsageCategorySection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(0 72% 15% / 0.2), transparent 60%)",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            اختر جهازك حسب{" "}
            <span className="text-gradient">الاستخدام</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base"
          >
            اختر الفئة التي تناسب احتياجك، وسنقترح لك أفضل المكونات والأجهزة
            المناسبة
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={card.link}
                className="group block rounded-2xl overflow-hidden relative bg-card border border-border hover:border-primary/50 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 32px hsl(0 0% 0% / 0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px hsl(0 72% 51% / 0.2), 0 0 0 1px hsl(0 72% 51% / 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px hsl(0 0% 0% / 0.4)";
                }}
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {card.description}
                  </p>

                  {/* Specs badge */}
                  <div className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/60 border border-border w-fit">
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-wide" style={{ direction: "ltr" }}>
                      {card.specs}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full mt-2 text-xs pulse-glow"
                    asChild
                  >
                    <span>{card.button}</span>
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsageCategorySection;
