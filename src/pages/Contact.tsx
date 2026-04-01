import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">اتصل بنا</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-4">
              {[
                { icon: Phone, label: "الهاتف", value: "0555 00 00 00" },
                { icon: MessageCircle, label: "واتساب", value: "0555 00 00 00" },
                { icon: Mail, label: "البريد الإلكتروني", value: "contact@itechpro.dz" },
                { icon: MapPin, label: "العنوان", value: "الجزائر" },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold mb-4">أرسل لنا رسالة</h3>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="الاسم" className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30" />
                <input placeholder="رقم الهاتف" className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30" />
                <input placeholder="البريد الإلكتروني" type="email" className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30" />
                <textarea placeholder="رسالتك" rows={4} className="w-full px-3 py-2 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 resize-none" />
                <Button variant="hero" className="w-full">إرسال</Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
