import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-secondary bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ITECHPRO" className="h-10 w-10 rounded-lg" />
              <span className="text-lg font-bold">ITECHPRO</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              متجر متخصص في بيع الحواسيب وقطع الكمبيوتر الأصلية في الجزائر. عتاد احترافي تم اختباره لأقصى أداء.
            </p>
          </div>

          {/* Links */}
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
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4 text-sm">الأصناف</h4>
            <div className="flex flex-col gap-2">
              {["حواسيب الألعاب", "كروت الشاشة", "المعالجات", "الشاشات", "الإكسسوارات"].map((c) => (
                <Link key={c} to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">{c}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-sm">تواصل معنا</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>📞 0555 00 00 00</span>
              <span>📱 واتساب: 0555 00 00 00</span>
              <span>📧 contact@itechpro.dz</span>
              <span>📍 الجزائر</span>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-sm">FB</a>
              <a href="#" className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-sm">IG</a>
              <a href="#" className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-sm">WA</a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2026 ITECHPRO. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
