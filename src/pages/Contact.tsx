import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const addMessage = useMutation(api.messages.addMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      await addMessage({
        name,
        phone: phone || undefined,
        email: email || undefined,
        message,
        isRead: false,
      });
      toast.success("تم إرسال رسالتك بنجاح ✅");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8 text-center sm:text-right">اتصل بنا</h1>

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
              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  placeholder="الاسم *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30"
                  required
                  maxLength={100}
                />
                <input
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30"
                  maxLength={15}
                />
                <input
                  placeholder="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30"
                  maxLength={255}
                />
                <textarea
                  placeholder="رسالتك *"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 resize-none"
                  required
                  maxLength={1000}
                />
                <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "إرسال"}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
