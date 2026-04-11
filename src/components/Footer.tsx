import { Link, useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import logo from "@/assets/logo.png";

// ── Real SVG social icons ──────────────────────────────────────────
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ── Social links config — update hrefs when user provides real links ──
const socialLinks = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/18XVq6Mfwf/",
    icon: FacebookIcon,
    hoverColor: "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/itechpro19?igsh=ZHR3MnQ2Mm43Mnl1",
    icon: InstagramIcon,
    hoverColor: "hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/213551138781",
    icon: WhatsAppIcon,
    hoverColor: "hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/30",
  },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = window.prompt("أدخل رمز الدخول:");
    if (code?.trim().toUpperCase() === "ADMINITECH") {
      navigate("/admin-login");
    }
  };

  return (
    <footer className="border-t border-secondary bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <ScrollReveal delay={0}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="ITECHPRO" className="h-10 w-10 rounded-lg" />
                <span className="text-lg font-bold">ITECHPRO</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                متجر متخصص في بيع الحواسيب وقطع الكمبيوتر الأصلية في الجزائر. عتاد احترافي تم اختباره لأقصى أداء.
              </p>
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={0.1}>
            <div>
              <h4 className="font-bold mb-4 text-sm">روابط سريعة</h4>
              <div className="flex flex-col gap-2">
                {[
                  { to: "/", label: "الرئيسية" },
                  { to: "/products", label: "المنتجات" },
                  { to: "/pc-builder", label: "ابنِ حاسوبك" },
                  { to: "/about", label: "من نحن" },
                  { to: "/contact", label: "اتصل بنا" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 nav-underline w-fit"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Categories */}
          <ScrollReveal delay={0.2}>
            <div>
              <h4 className="font-bold mb-4 text-sm">الأصناف</h4>
              <div className="flex flex-col gap-2">
                {["حواسيب الألعاب", "كروت الشاشة", "المعالجات", "الشاشات", "الإكسسوارات", "الرامات", "التخزين SSD", "مزودات الطاقة"].map((c) => (
                  <Link
                    key={c}
                    to="/products"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 nav-underline w-fit"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Contact + Social */}
          <ScrollReveal delay={0.3}>
            <div>
              <h4 className="font-bold mb-4 text-sm">تواصل معنا</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-5">
                <a href="tel:0772061398" className="hover:text-primary transition-colors">📞 0772 06 13 98</a>
                <a href="https://wa.me/213551138781" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">📱 واتساب: +213 551 13 87 81</a>
                <a href="mailto:xdp51919@gmail.com" className="hover:text-primary transition-colors">📧 xdp51919@gmail.com</a>
                <span>📍 الجزائر</span>
              </div>

              {/* Social Media Icons */}
              <h4 className="font-bold mb-3 text-sm">تابعنا</h4>
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map(({ id, label, href, icon: Icon, hoverColor }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`w-9 h-9 rounded-lg border border-border/40 bg-secondary flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 btn-press ${hoverColor}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="border-t border-secondary mt-8 pt-6 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>© 2026 ITECHPRO. جميع الحقوق محفوظة.</span>
          <button
            onClick={handleAdminClick}
            className="opacity-30 hover:opacity-60 transition-opacity text-[10px] text-muted-foreground cursor-pointer"
            aria-label="admin"
          >
            الإدارة
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
