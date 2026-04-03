import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Truck, Building2, MapPin, Phone, User, ChevronDown, Package, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";
import { wilayas, getWilayaByCode } from "@/data/algerianWilayas";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

type DeliveryMethod = "home" | "office";

const ADMIN_PHONE = "213XXXXXXXXX"; // Replace with actual admin phone

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [officeName, setOfficeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const wilaya = useMemo(() => getWilayaByCode(selectedWilaya), [selectedWilaya]);
  const communes = wilaya?.communes || [];
  const deliveryFee = wilaya
    ? deliveryMethod === "home" ? wilaya.deliveryHome : wilaya.deliveryOffice
    : 0;
  const subtotal = product.price * quantity;
  const total = subtotal + deliveryFee;

  const validatePhone = (value: string): boolean => {
    // Algerian mobile: 05, 06, 07 followed by 8 digits
    const algerianPhoneRegex = /^0[567]\d{8}$/;
    return algerianPhoneRegex.test(value);
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
    if (cleaned.length > 0 && cleaned.length < 10) {
      setPhoneError("رقم الهاتف يجب أن يكون 10 أرقام");
    } else if (cleaned.length === 10 && !validatePhone(cleaned)) {
      setPhoneError("رقم هاتف جزائري غير صحيح (05/06/07)");
    } else {
      setPhoneError("");
    }
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    validatePhone(phone) &&
    selectedWilaya &&
    selectedCommune &&
    address.trim() &&
    (deliveryMethod === "home" || officeName.trim());

  const generateWhatsAppMessage = () => {
    const wilayaName = wilaya?.name || "";
    const deliveryText = deliveryMethod === "home" ? "إلى المنزل" : `إلى مكتب التوصيل: ${officeName}`;
    
    const msg = `🛒 *طلب جديد*
━━━━━━━━━━━━━━━
📦 *المنتج:* ${product.nameAr}
💰 *السعر:* ${formatPrice(product.price)}
🔢 *الكمية:* ${quantity}
🚚 *رسوم التوصيل:* ${formatPrice(deliveryFee)}
💵 *المجموع:* ${formatPrice(total)}
━━━━━━━━━━━━━━━
👤 *الاسم:* ${firstName} ${lastName}
📱 *الهاتف:* ${phone}
🏙️ *الولاية:* ${wilayaName}
🏘️ *البلدية:* ${selectedCommune}
📍 *العنوان:* ${address}
🚛 *التوصيل:* ${deliveryText}
━━━━━━━━━━━━━━━`;

    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate submit delay
    await new Promise((r) => setTimeout(r, 1500));

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setQuantity(1);
    setFirstName("");
    setLastName("");
    setPhone("");
    setSelectedWilaya("");
    setSelectedCommune("");
    setAddress("");
    setDeliveryMethod("home");
    setOfficeName("");
    setPhoneError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-primary/20 shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-secondary bg-card/95 backdrop-blur-md rounded-t-2xl">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package size={20} className="text-primary" />
                إتمام الطلب
              </h2>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
                <X size={16} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  >
                    <CheckCircle2 size={64} className="mx-auto text-primary mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">تم إرسال الطلب بنجاح</h3>
                  <p className="text-muted-foreground mb-6">سنتواصل معك قريبًا لتأكيد الطلب</p>
                  <Button variant="hero" onClick={handleClose} className="w-full">
                    إغلاق
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="p-5 space-y-5"
                >
                  {/* Product Summary */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex gap-3">
                      <img src={product.image} alt={product.nameAr} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-2">{product.nameAr}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary">
                      <span className="text-sm text-muted-foreground">الكمية</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <User size={14} className="text-primary" /> المعلومات الشخصية
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="الاسم"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        required
                        maxLength={50}
                      />
                      <input
                        type="text"
                        placeholder="اللقب"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="relative">
                      <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="رقم الهاتف (مثال: 0551234567)"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`w-full pr-9 pl-3 py-2.5 rounded-lg bg-secondary/50 border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${phoneError ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-secondary focus:border-primary/50 focus:ring-primary/20"}`}
                        required
                        dir="ltr"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-destructive">{phoneError}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} className="text-primary" /> عنوان التوصيل
                    </h3>
                    {/* Wilaya */}
                    <div className="relative">
                      <select
                        value={selectedWilaya}
                        onChange={(e) => { setSelectedWilaya(e.target.value); setSelectedCommune(""); }}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        required
                      >
                        <option value="">اختر الولاية</option>
                        {wilayas.map((w) => (
                          <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    {/* Commune */}
                    <div className="relative">
                      <select
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                        required
                        disabled={!selectedWilaya}
                      >
                        <option value="">اختر البلدية</option>
                        {communes.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    {/* Full Address */}
                    <input
                      type="text"
                      placeholder="العنوان الكامل"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      required
                      maxLength={200}
                    />
                  </div>

                  {/* Delivery Method */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <Truck size={14} className="text-primary" /> طريقة التوصيل
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("home")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                          deliveryMethod === "home"
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-secondary bg-secondary/30 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Truck size={20} className={deliveryMethod === "home" ? "text-primary" : ""} />
                        <span>إلى المنزل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("office")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                          deliveryMethod === "office"
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-secondary bg-secondary/30 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Building2 size={20} className={deliveryMethod === "office" ? "text-primary" : ""} />
                        <span>إلى مكتب التوصيل</span>
                      </button>
                    </div>
                    {deliveryMethod === "office" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <input
                          type="text"
                          placeholder="اسم مكتب التوصيل"
                          value={officeName}
                          onChange={(e) => setOfficeName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                          required
                          maxLength={100}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="glass-card rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">سعر المنتج</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الكمية</span>
                      <span>× {quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">رسوم التوصيل</span>
                      <span className={deliveryFee > 0 ? "text-foreground" : "text-muted-foreground"}>
                        {deliveryFee > 0 ? formatPrice(deliveryFee) : "اختر الولاية"}
                      </span>
                    </div>
                    <div className="border-t border-secondary pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">المجموع الكلي</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full pulse-glow"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="tech-loader !w-5 !h-5 !border-2" />
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <MessageCircle size={18} />
                        تأكيد الطلب عبر واتساب
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
