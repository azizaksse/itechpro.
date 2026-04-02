import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type Language = "ar" | "fr" | "en";

export const languageNames: Record<Language, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export const languageFlags: Record<Language, string> = {
  ar: "🇩🇿",
  fr: "🇫🇷",
  en: "🇬🇧",
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": { ar: "الرئيسية", fr: "Accueil", en: "Home" },
  "nav.products": { ar: "المنتجات", fr: "Produits", en: "Products" },
  "nav.pcBuilder": { ar: "ابنِ حاسوبك", fr: "Configurer un PC", en: "PC Builder" },
  "nav.about": { ar: "من نحن", fr: "À propos", en: "About" },
  "nav.contact": { ar: "اتصل بنا", fr: "Contact", en: "Contact" },
  "nav.faq": { ar: "الأسئلة الشائعة", fr: "FAQ", en: "FAQ" },
  "nav.search": { ar: "ابحث عن منتج...", fr: "Rechercher un produit...", en: "Search a product..." },

  // Hero
  "hero.title": {
    ar: "أفضل متجر لبيع الحواسيب وقطع الكمبيوتر في",
    fr: "La meilleure boutique d'ordinateurs et composants PC en",
    en: "The best computer and PC components store in",
  },
  "hero.country": { ar: "الجزائر", fr: "Algérie", en: "Algeria" },
  "hero.subtitle": {
    ar: "اكتشف أحدث الحواسيب وقطع الكمبيوتر الأصلية بأفضل الأسعار مع توصيل سريع لكل الولايات.",
    fr: "Découvrez les derniers PC et composants originaux aux meilleurs prix avec livraison rapide vers toutes les wilayas.",
    en: "Discover the latest PCs and original components at the best prices with fast delivery to all wilayas.",
  },
  "hero.browse": { ar: "تصفح المنتجات", fr: "Voir les produits", en: "Browse Products" },
  "hero.build": { ar: "ابنِ حاسوبك الآن", fr: "Configurez votre PC", en: "Build Your PC" },

  // Features
  "feat.delivery": { ar: "توصيل سريع إلى جميع الولايات", fr: "Livraison rapide vers toutes les wilayas", en: "Fast delivery to all wilayas" },
  "feat.original": { ar: "منتجات أصلية 100%", fr: "Produits 100% originaux", en: "100% Original products" },
  "feat.support": { ar: "دعم تقني قبل وبعد الشراء", fr: "Support technique avant et après achat", en: "Technical support before & after purchase" },
  "feat.warranty": { ar: "ضمان على المنتجات", fr: "Garantie sur les produits", en: "Product warranty" },
  "feat.prices": { ar: "أفضل أسعار في السوق", fr: "Meilleurs prix du marché", en: "Best prices on the market" },

  // Sections
  "section.newProducts": { ar: "منتجات جديدة", fr: "Nouveaux produits", en: "New Products" },
  "section.categories": { ar: "الأصناف", fr: "Catégories", en: "Categories" },
  "section.allProducts": { ar: "جميع", fr: "Tous les", en: "All" },
  "section.allProductsSuffix": { ar: "المنتجات", fr: "Produits", en: "Products" },
  "section.specialOffers": { ar: "عروض", fr: "Offres", en: "Special" },
  "section.specialOffersSuffix": { ar: "خاصة", fr: "Spéciales", en: "Offers" },
  "section.viewAll": { ar: "عرض الكل", fr: "Voir tout", en: "View All" },
  "section.loadMore": { ar: "تحميل المزيد", fr: "Charger plus", en: "Load More" },
  "section.remaining": { ar: "متبقي", fr: "restant(s)", en: "remaining" },

  // Product card
  "product.new": { ar: "جديد", fr: "Nouveau", en: "New" },
  "product.promo": { ar: "عرض", fr: "Promo", en: "Sale" },
  "product.inStock": { ar: "متوفر", fr: "En stock", en: "In Stock" },

  // CTA
  "cta.title": { ar: "جاهز لبناء حاسوبك المثالي؟", fr: "Prêt à construire votre PC idéal ?", en: "Ready to build your dream PC?" },
  "cta.subtitle": {
    ar: "اختر القطع المتوافقة وابدأ ببناء حاسوب أحلامك بأفضل الأسعار",
    fr: "Choisissez les composants compatibles et construisez le PC de vos rêves aux meilleurs prix",
    en: "Choose compatible components and build your dream PC at the best prices",
  },
  "cta.buildNow": { ar: "ابدأ البناء الآن", fr: "Commencer maintenant", en: "Start Building Now" },

  // FAQ
  "faq.badge": { ar: "الأسئلة الشائعة", fr: "FAQ", en: "FAQ" },
  "faq.title": { ar: "الأسئلة", fr: "Questions", en: "Frequently Asked" },
  "faq.titleHighlight": { ar: "الشائعة", fr: "Fréquentes", en: "Questions" },
  "faq.subtitle": {
    ar: "اعثر على إجابات سريعة حول الطلبات، التوصيل، الضمان، الدفع، ومعلومات المنتجات.",
    fr: "Trouvez des réponses rapides sur les commandes, la livraison, la garantie, le paiement et les produits.",
    en: "Find quick answers about orders, delivery, warranty, payment, and product information.",
  },
  "faq.q1": { ar: "هل توفرون التوصيل لجميع ولايات الجزائر؟", fr: "Livrez-vous dans toutes les wilayas d'Algérie ?", en: "Do you deliver to all Algerian wilayas?" },
  "faq.a1": { ar: "نعم، نوصل إلى جميع الـ 58 ولاية عبر شركاء توصيل موثوقين لضمان وصول طلبك بأمان.", fr: "Oui, nous livrons dans les 58 wilayas via des partenaires de livraison fiables.", en: "Yes, we deliver to all 58 wilayas through trusted delivery partners." },
  "faq.q2": { ar: "كم تستغرق مدة التوصيل؟", fr: "Combien de temps prend la livraison ?", en: "How long does delivery take?" },
  "faq.a2": { ar: "عادة ما يستغرق التوصيل بين 24 إلى 72 ساعة حسب الولاية والمنطقة.", fr: "La livraison prend généralement entre 24 et 72 heures selon la wilaya.", en: "Delivery usually takes between 24 to 72 hours depending on the wilaya." },
  "faq.q3": { ar: "هل الحواسيب والقطع أصلية؟", fr: "Les PC et composants sont-ils originaux ?", en: "Are the computers and components original?" },
  "faq.a3": { ar: "نعم، جميع المنتجات أصلية 100% ومستوردة من علامات تجارية وموردين معتمدين.", fr: "Oui, tous les produits sont 100% originaux et proviennent de marques et fournisseurs certifiés.", en: "Yes, all products are 100% original and sourced from trusted brands and suppliers." },
  "faq.q4": { ar: "هل المنتجات تأتي مع ضمان؟", fr: "Les produits sont-ils garantis ?", en: "Do products come with warranty?" },
  "faq.a4": { ar: "نعم، جميع المنتجات تشمل ضماناً. مدة الضمان تختلف حسب نوع المنتج والعلامة التجارية.", fr: "Oui, tous les produits incluent une garantie. La durée dépend du type de produit.", en: "Yes, all products include warranty. Duration depends on the product type." },
  "faq.q5": { ar: "هل يمكنني الدفع عند الاستلام؟", fr: "Puis-je payer à la livraison ?", en: "Can I pay on delivery?" },
  "faq.a5": { ar: "نعم، خدمة الدفع عند الاستلام متوفرة في معظم ولايات الجزائر.", fr: "Oui, le paiement à la livraison est disponible dans la plupart des wilayas.", en: "Yes, cash on delivery is available in most Algerian wilayas." },
  "faq.q6": { ar: "هل يمكنني طلب تجميع حاسوب مخصص؟", fr: "Puis-je commander un PC sur mesure ?", en: "Can I order a custom PC build?" },
  "faq.a6": { ar: "نعم، يمكن للعملاء اختيار القطع وطلب تجميع حاسوب ألعاب أو حاسوب احترافي حسب الطلب.", fr: "Oui, les clients peuvent choisir les composants et demander un montage PC gaming ou professionnel.", en: "Yes, customers can choose components and request a custom gaming or professional PC build." },
  "faq.q7": { ar: "ماذا لو وصل المنتج تالفاً؟", fr: "Que faire si le produit arrive endommagé ?", en: "What if the product arrives damaged?" },
  "faq.a7": { ar: "تواصل معنا فوراً خلال 24 ساعة وسنساعدك في الاستبدال أو الإرجاع.", fr: "Contactez-nous dans les 24 heures et nous vous aiderons pour le remplacement ou le retour.", en: "Contact us within 24 hours and we will assist with replacement or return." },
  "faq.q8": { ar: "هل توفرون دعماً تقنياً؟", fr: "Offrez-vous un support technique ?", en: "Do you provide technical support?" },
  "faq.a8": { ar: "نعم، فريقنا يساعد العملاء في اختيار القطع المناسبة ويوفر دعماً تقنياً بعد البيع.", fr: "Oui, notre équipe aide les clients à choisir les bons composants et offre un support après-vente.", en: "Yes, our team helps customers choose the right components and provides after-sales support." },
  "faq.ctaTitle": { ar: "لا تزال لديك أسئلة؟", fr: "Vous avez encore des questions ?", en: "Still have questions?" },
  "faq.ctaSubtitle": {
    ar: "فريقنا جاهز لمساعدتك. تواصل معنا عبر واتساب للحصول على إجابات فورية.",
    fr: "Notre équipe est prête à vous aider. Contactez-nous sur WhatsApp pour des réponses rapides.",
    en: "Our team is ready to help. Contact us on WhatsApp for instant answers.",
  },
  "faq.ctaButton": { ar: "تواصل معنا عبر واتساب", fr: "Contactez-nous sur WhatsApp", en: "Contact us on WhatsApp" },

  // Cart
  "cart.title": { ar: "سلة التسوق", fr: "Panier", en: "Cart" },
  "cart.empty": { ar: "سلة التسوق فارغة", fr: "Le panier est vide", en: "Your cart is empty" },
  "cart.clear": { ar: "إفراغ السلة", fr: "Vider le panier", en: "Clear cart" },
  "cart.total": { ar: "المجموع", fr: "Total", en: "Total" },
  "cart.checkout": { ar: "إتمام الطلب", fr: "Passer la commande", en: "Checkout" },
  "cart.added": { ar: "تمت إضافة المنتج إلى السلة", fr: "Produit ajouté au panier", en: "Product added to cart" },

  // Footer / general
  "general.viewAll": { ar: "عرض الكل", fr: "Voir tout", en: "View all" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-lang");
    return (saved as Language) || "ar";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("app-lang", newLang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] || entry.ar || key;
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
