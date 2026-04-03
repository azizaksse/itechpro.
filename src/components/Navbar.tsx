import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/pc-builder", label: t("nav.pcBuilder") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faq", label: t("nav.faq") },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 glass-card border-b-0 transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
      style={{ borderBottom: '1px solid hsla(0,0%,100%,0.06)' }}
    >
      <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img src={logo} alt="ITECHPRO" className="h-10 w-10 rounded-lg transition-transform duration-300 group-hover:scale-105" />
          <span className="text-lg font-bold text-foreground hidden sm:block">{`ITECHPRO`}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 nav-underline ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  placeholder={t("nav.search")}
                  className="w-full h-9 px-3 rounded-md bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press">
            <Search size={18} />
          </button>
          <LanguageSwitcher />
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press relative">
            <Heart size={18} />
          </button>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press relative">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 500, damping: 15 }}
                className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press hidden sm:block">
            <User size={18} />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md text-muted-foreground hover:text-foreground lg:hidden btn-press">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-secondary"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
