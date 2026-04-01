import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import Layout from "@/components/Layout";

const Delivery = () => {
  return (
    <Layout>
      <div className="container py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-6">التوصيل</h1>
          <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck size={28} className="text-primary" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              نوفر خدمة التوصيل إلى جميع ولايات الجزائر مع إمكانية الدفع عند الاستلام.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Delivery;
