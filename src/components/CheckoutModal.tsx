import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Truck, Building2, MapPin, Phone, User, ChevronDown, Package, CheckCircle2, MessageCircle, PartyPopper, Gift, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";
import { wilayas, getWilayaByCode } from "@/data/algerianWilayas";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import ItemImage from "./ItemImage";

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

  const checkoutItems: CheckoutItem[] = useMemo(() => {
    if (cartItems && cartItems.length > 0) return cartItems;
    if (product) return [{ product, quantity: singleQuantity }];
    return [];
  }, [cartItems, product, singleQuantity]);

  const isSingleProduct = !cartItems || cartItems.length === 0;
  const wilaya = useMemo(() => getWilayaByCode(selectedWilaya), [selectedWilaya]);
  const communes = wilaya?.communes || [];
  const deliveryFee = wilaya ? (deliveryMethod === "home" ? wilaya.deliveryHome : wilaya.deliveryOffice) : 0;
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
    const itemsText = checkoutItems.map(item => `📦 ${item.product.nameAr} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`).join("\n");
    const msg = `🛒 *طلب جديد*\n━━━━━━━━━━━━━━━\n${itemsText}\n━━━━━━━━━━━━━━━\n💰 *المجموع الفرعي:* ${formatPrice(subtotal)}\n🚚 *رسوم التوصيل:* ${formatPrice(deliveryFee)}\n💵 *المجموع الكلي:* ${formatPrice(total)}\n━━━━━━━━━━━━━━━\n👤 *الاسم:* ${firstName} ${lastName}\n📱 *الهاتف:* ${phone}\n🏙️ *الولاية:* ${wilaya?.name || ""}\n🏘️ *البلدية:* ${selectedCommune}\n📍 *العنوان:* ${address}\n🚛 *التوصيل:* ${deliveryMethod === "home" ? "إلى المنزل" : `إلى مكتب: ${officeName}`}\n━━━━━━━━━━━━━━━`;
    return encodeURIComponent(msg);
  };

  const createOrder = useMutation(api.orders.createOrder);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await createOrder({
        customerFirstName: firstName,
        customerLastName: lastName,
        phone,
        wilaya: wilaya?.name || "",
        commune: selectedCommune,
        address,
        deliveryMethod,
        officeName: deliveryMethod === "office" ? officeName : undefined,
        status: "معلق",
        subtotal,
        deliveryFee,
        total,
        items: checkoutItems.map(item => ({
          productId: item.product._id || (item.product as any).id || "mock",
          productName: item.product.nameAr,
          productImage: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      window.open(`https://wa.me/${ADMIN_PHONE}?text=${generateWhatsAppMessage()}`, "_blank");
      setIsSuccess(true);
      toast.success("تم إرسال الطلب بنجاح!");
    } catch (error) {
      toast.error("فشل في إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSuccess && onOrderSuccess) onOrderSuccess();
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg max-h-[90vh] flex flex-col glass-card rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package size={20} className="text-primary" />
                إتمام الطلب
              </h2>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20" data-lenis-prevent>
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 size={48} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">تم الطلب بنجاح! 🎉</h3>
                      <p className="text-muted-foreground text-sm">سيتم التواصل معك عبر الهاتف لتأكيد الطلب</p>
                    </div>
                    <Button variant="hero" onClick={handleClose} className="w-full">متابعة التسوق</Button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Products Summary */}
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      {checkoutItems.map((item) => (
                        <div key={item.product._id || item.product.id} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
                            <ItemImage src={item.product.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold line-clamp-1">{item.product.nameAr}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-primary font-bold text-sm">{formatPrice(item.product.price)}</span>
                              <span className="text-xs text-muted-foreground">الكمية: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><input placeholder="الاسم" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm"/></div>
                        <div className="space-y-1.5"><input placeholder="اللقب" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm"/></div>
                      </div>
                      <div className="relative">
                        <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input placeholder="رقم الهاتف (05/06/07)" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className="w-full h-11 pr-10 pl-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm" dir="ltr"/>
                        {phoneError && <p className="text-[10px] text-destructive mt-1 pr-1">{phoneError}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <select value={selectedWilaya} onChange={(e) => {setSelectedWilaya(e.target.value); setSelectedCommune("");}} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm">
                          <option value="">الولاية</option>
                          {wilayas.map(w => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                        </select>
                        <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm" disabled={!selectedWilaya}>
                          <option value="">البلدية</option>
                          {communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <input placeholder="العنوان بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm"/>
                    </div>

                    {/* Methods */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setDeliveryMethod("home")} className={`p-4 rounded-xl border transition-all text-center space-y-2 ${deliveryMethod === "home" ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}>
                        <Truck className={deliveryMethod === "home" ? "text-primary mx-auto" : "mx-auto"} />
                        <p className="text-xs font-bold">توصيل للمنزل</p>
                      </button>
                      <button onClick={() => setDeliveryMethod("office")} className={`p-4 rounded-xl border transition-all text-center space-y-2 ${deliveryMethod === "office" ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}>
                        <Building2 className={deliveryMethod === "office" ? "text-primary mx-auto" : "mx-auto"} />
                        <p className="text-xs font-bold">مكتب التوصيل</p>
                      </button>
                    </div>
                    {deliveryMethod === "office" && (
                      <input placeholder="اسم مكتب التوصيل (Yalidine..)" value={officeName} onChange={(e) => setOfficeName(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary/50 transition-all text-sm"/>
                    )}

                    {/* Totals */}
                    <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>المجموع:</span><span>{formatPrice(subtotal)}</span></div>
                      <div className="flex justify-between text-xs text-muted-foreground"><span>التوصيل:</span><span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "اختر الولاية"}</span></div>
                      <div className="flex justify-between font-bold pt-2 border-t border-border/50"><span>الإجمالي:</span><span className="text-primary">{formatPrice(total)}</span></div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed Footer */}
            {!isSuccess && (
              <div className="p-5 border-t border-border bg-card shrink-0">
                <Button onClick={handleSubmit} variant="hero" size="lg" className="w-full pulse-glow" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><MessageCircle className="ml-2" size={18} /> إتمام الطلب عبر واتساب</>}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Loader2 = ({ className }: {className?: string}) => <div className={`tech-loader !w-5 !h-5 ${className}`} />;

export default CheckoutModal;
