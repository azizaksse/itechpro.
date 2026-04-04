import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Truck, Building2, MapPin, Phone, User, ChevronDown, Package, CheckCircle2, MessageCircle, PartyPopper, Gift, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";
import { wilayas, getWilayaByCode } from "@/data/algerianWilayas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CheckoutItem {
  product: Product;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  cartItems?: CheckoutItem[];
  onOrderSuccess?: () => void;
}

type DeliveryMethod = "home" | "office";

const ADMIN_PHONE = "213772061398";

const CheckoutModal = ({ isOpen, onClose, product, cartItems, onOrderSuccess }: CheckoutModalProps) => {
  const [singleQuantity, setSingleQuantity] = useState(1);
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
  const customerWhatsAppRef = useRef<string | null>(null);

  // Determine items to checkout
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    if (cartItems && cartItems.length > 0) return cartItems;
    if (product) return [{ product, quantity: singleQuantity }];
    return [];
  }, [cartItems, product, singleQuantity]);

  const isSingleProduct = !cartItems || cartItems.length === 0;

  const wilaya = useMemo(() => getWilayaByCode(selectedWilaya), [selectedWilaya]);
  const communes = wilaya?.communes || [];
  const deliveryFee = wilaya
    ? deliveryMethod === "home" ? wilaya.deliveryHome : wilaya.deliveryOffice
    : 0;
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const validatePhone = (value: string): boolean => {
    const algerianPhoneRegex = /^0[567]\d{8}$/;
    return algerianPhoneRegex.test(value);
  };

  const handlePhoneChange = (value: string) => {
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
    (deliveryMethod === "home" || officeName.trim()) &&
    checkoutItems.length > 0;

  const generateWhatsAppMessage = () => {
    const wilayaName = wilaya?.name || "";
    const deliveryText = deliveryMethod === "home" ? "إلى المنزل" : `إلى مكتب التوصيل: ${officeName}`;
    
    const itemsText = checkoutItems.map(item => 
      `📦 ${item.product.nameAr} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
    ).join("\n");

    const msg = `🛒 *طلب جديد*
━━━━━━━━━━━━━━━
${itemsText}
━━━━━━━━━━━━━━━
💰 *المجموع الفرعي:* ${formatPrice(subtotal)}
🚚 *رسوم التوصيل:* ${formatPrice(deliveryFee)}
💵 *المجموع الكلي:* ${formatPrice(total)}
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

    try {
      const orderId = crypto.randomUUID();
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          customer_first_name: firstName,
          customer_last_name: lastName,
          phone,
          wilaya: wilaya?.name || selectedWilaya,
          commune: selectedCommune,
          address,
          delivery_method: deliveryMethod as any,
          office_name: deliveryMethod === "office" ? officeName : null,
          subtotal,
          delivery_fee: deliveryFee,
          total,
        });

      if (orderError) throw orderError;

      // Save all order items
      const orderItems = checkoutItems.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.nameAr,
        product_image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemError) throw itemError;

      // Open WhatsApp to admin
      const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${generateWhatsAppMessage()}`;
      window.open(whatsappUrl, "_blank");

      // Generate customer confirmation WhatsApp link
      const customerPhone = phone.startsWith("0") ? `213${phone.slice(1)}` : phone;
      const confirmMsg = encodeURIComponent(
`✅ *تأكيد الطلب - PRO PC DZ*
━━━━━━━━━━━━━━━
مرحباً ${firstName} ${lastName}! 🎉

تم استلام طلبك بنجاح!

📦 *تفاصيل الطلب:*
${checkoutItems.map(item => `• ${item.product.nameAr} × ${item.quantity}`).join("\n")}

💵 *المجموع:* ${formatPrice(total)}
🏙️ *التوصيل إلى:* ${wilaya?.name || ""} - ${selectedCommune}

سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.

شكراً لثقتك بنا! ❤️
━━━━━━━━━━━━━━━`
      );
      customerWhatsAppRef.current = `https://wa.me/${customerPhone}?text=${confirmMsg}`;

      // Auto-open customer confirmation
      setTimeout(() => {
        if (customerWhatsAppRef.current) {
          window.open(customerWhatsAppRef.current, "_blank");
        }
      }, 1500);

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("تم إرسال الطلب بنجاح!");
    } catch (err) {
      setIsSubmitting(false);
      toast.error("حدث خطأ أثناء إرسال الطلب");
      console.error(err);
    }
  };

  const handleClose = () => {
    if (isSuccess && onOrderSuccess) {
      onOrderSuccess();
    }
    setIsSuccess(false);
    setSingleQuantity(1);
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

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
                  className="p-8 text-center space-y-5"
                >
                  {/* Animated celebration */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, delay: 0.1 }}
                      className="w-20 h-20 mx-auto rounded-full bg-primary/15 flex items-center justify-center"
                    >
                      <CheckCircle2 size={48} className="text-primary" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-2 -right-2"
                    >
                      <PartyPopper size={24} className="text-yellow-500" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-2 -left-2"
                    >
                      <Gift size={24} className="text-primary" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-2">شكراً لك! 🎉</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-4 text-sm space-y-2"
                  >
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Heart size={16} />
                      <span>نقدّر ثقتك بنا</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      تم إرسال تأكيد الطلب إلى واتساب الخاص بك
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                  >
                    <Button variant="hero" onClick={handleClose} className="w-full pulse-glow">
                      متابعة التسوق
                    </Button>
                  </motion.div>
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
                  <div className="glass-card rounded-xl p-4 space-y-3">
                    {checkoutItems.map((item, index) => (
                      <div key={item.product.id} className={index > 0 ? "pt-3 border-t border-secondary" : ""}>
                        <div className="flex gap-3">
                          <img src={item.product.image} alt={item.product.nameAr} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold line-clamp-2">{item.product.nameAr}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.product.brand}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm font-bold text-primary">{formatPrice(item.product.price)}</p>
                              {isSingleProduct ? (
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={() => setSingleQuantity(Math.max(1, singleQuantity - 1))} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold">{singleQuantity}</span>
                                  <button type="button" onClick={() => setSingleQuantity(singleQuantity + 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">× {item.quantity}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    {checkoutItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1">{item.product.nameAr} × {item.quantity}</span>
                        <span className="mr-2">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
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
