import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, PackageSearch } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ItemImage from "./ItemImage";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const { totalItems, setIsOpen } = useCart();
  const { totalItems: wishlistCount, setIsOpen: setWishlistOpen } = useWishlist();
  const { t } = useLanguage();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchValue("");
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchValue("");
      }
    };
    if (searchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleSearchSubmit = () => {
    const q = searchValue.trim();
    if (!q) {
      setSearchOpen(false);
      return;
    }
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchValue("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const handleSearchToggle = () => {
    if (searchOpen && searchValue.trim()) {
      handleSearchSubmit();
    } else if (searchOpen) {
      setSearchOpen(false);
      setSearchValue("");
    } else {
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  // Fetch all active products for live search
  const allProducts = useQuery(api.products.getActiveProducts) ?? [];

  // Filter products by search value (max 6 results)
  const searchResults = searchValue.trim().length > 0
    ? allProducts
        .filter((p) => {
          const q = searchValue.trim().toLowerCase();
          return (
            p.name?.toLowerCase().includes(q) ||
            p.nameAr?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/pc-builder", label: t("nav.pcBuilder") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/delivery", label: t("nav.delivery") },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 glass-card border-b-0 transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
      style={{ borderBottom: "1px solid hsla(0,0%,100%,0.06)" }}
    >
      <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img src={logo} alt="ITECHPRO" className="h-10 w-10 rounded-lg transition-transform duration-300 group-hover:scale-105" />
          <span className="text-lg font-bold text-foreground hidden sm:block">ITECHPRO</span>
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

          {/* ── Search with Live Dropdown ── */}
          <div ref={searchWrapperRef} className="relative">
            <div className="flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <input
                      ref={searchInputRef}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={t("nav.search")}
                      className="w-full h-9 px-3 rounded-md bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                id="navbar-search-btn"
                onClick={handleSearchToggle}
                title="بحث"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Live Dropdown */}
            <AnimatePresence>
              {searchOpen && searchValue.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-full mt-2 left-0 w-[340px] rounded-xl overflow-hidden shadow-2xl z-50"
                  style={{
                    background: "hsl(0 0% 8%)",
                    border: "1px solid hsla(0,0%,100%,0.1)",
                  }}
                >
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/5">
                        <p className="text-xs text-muted-foreground">
                          {searchResults.length} نتيجة لـ &ldquo;{searchValue}&rdquo;
                        </p>
                      </div>
                      <ul className="py-1 max-h-[400px] overflow-y-auto">
                        {searchResults.map((product) => (
                          <li key={product._id}>
                            <Link
                              to={`/product/${product._id}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchValue("");
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
                            >
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary/50 border border-white/5">
                                <ItemImage
                                  src={product.image}
                                  alt={product.nameAr || product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              {/* Product Info */}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {product.nameAr || product.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {product.brand} · {product.category}
                                </p>
                                <p className="text-xs font-semibold text-primary mt-0.5">
                                  {product.price.toLocaleString("ar-DZ")} دج
                                </p>
                              </div>
                              {/* Out of stock badge */}
                              {!product.inStock && (
                                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">
                                  نفذ
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-xs text-primary hover:text-primary/80 py-1.5 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                        >
                          عرض كل النتائج ←
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                      <PackageSearch size={32} className="opacity-40" />
                      <p className="text-sm">لا توجد نتائج لـ &ldquo;{searchValue}&rdquo;</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LanguageSwitcher />

          {/* Wishlist */}
          <button
            id="navbar-wishlist-btn"
            onClick={() => setWishlistOpen(true)}
            title="المفضلة"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press relative"
          >
            <Heart size={18} className={wishlistCount > 0 ? "fill-primary text-primary" : ""} />
            {wishlistCount > 0 && (
              <motion.span
                key={wishlistCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 500, damping: 15 }}
                className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold"
              >
                {wishlistCount}
              </motion.span>
            )}
          </button>

          {/* Cart */}
          <button
            id="navbar-cart-btn"
            onClick={() => setIsOpen(true)}
            title="سلة التسوق"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press relative"
          >
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

          {/* Account */}
          <button
            id="navbar-account-btn"
            onClick={() => toast.info("تسجيل الدخول قريباً ✨")}
            title="حسابي"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 btn-press hidden sm:block"
          >
            <User size={18} />
          </button>

          {/* Mobile menu toggle */}
          <button
            id="navbar-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            title="القائمة"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground lg:hidden btn-press"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-secondary"
          >
            {/* Mobile Search */}
            <div className="container pt-3 pb-1">
              <div className="relative">
                <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = searchValue.trim();
                      if (q) {
                        navigate(`/products?search=${encodeURIComponent(q)}`);
                        setMobileOpen(false);
                        setSearchValue("");
                      }
                    }
                  }}
                  placeholder="ابحث عن منتج..."
                  className="w-full h-9 pr-9 pl-3 rounded-md bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 transition-colors"
                />
              </div>

              {/* Mobile live results */}
              <AnimatePresence>
                {searchValue.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 rounded-xl overflow-hidden"
                    style={{ border: "1px solid hsla(0,0%,100%,0.08)", background: "hsl(0 0% 8%)" }}
                  >
                    {searchResults.length > 0 ? (
                      <ul className="py-1 max-h-[280px] overflow-y-auto">
                        {searchResults.map((product) => (
                          <li key={product._id}>
                            <Link
                              to={`/product/${product._id}`}
                              onClick={() => {
                                setMobileOpen(false);
                                setSearchValue("");
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-secondary/50">
                                <ItemImage
                                  src={product.image}
                                  alt={product.nameAr || product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {product.nameAr || product.name}
                                </p>
                                <p className="text-xs text-primary font-semibold">
                                  {product.price.toLocaleString("ar-DZ")} دج
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">لا توجد نتائج</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Nav Links */}
            <div className="container py-3 flex flex-col gap-1">
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
