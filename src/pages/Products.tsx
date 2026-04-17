import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, Loader2, ChevronDown, PackageSearch } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Skeleton card for loading state
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden flex flex-col animate-pulse"
    style={{
      background: "hsl(0 0% 7%)",
      border: "1px solid hsla(0,0%,100%,0.07)",
    }}
  >
    <div className="aspect-[4/3] bg-secondary/40" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3 w-16 bg-secondary/40 rounded" />
      <div className="h-4 w-full bg-secondary/40 rounded" />
      <div className="h-4 w-3/4 bg-secondary/40 rounded" />
      <div className="h-5 w-24 bg-secondary/40 rounded mt-1" />
      <div className="flex gap-2 pt-1">
        <div className="w-10 h-10 bg-secondary/40 rounded-lg" />
        <div className="flex-1 h-10 bg-secondary/40 rounded-lg" />
      </div>
    </div>
  </div>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const promoParam = searchParams.get("promo");

  const { products, loading } = useProducts();
  const convexCategories = useQuery(api.categories.getActiveCategories);
  
  // Only fall back to static categories when Convex data is confirmed empty (not while loading)
  const displayCategories = convexCategories && convexCategories.length > 0
    ? convexCategories.map(c => ({
        id: c.slug,
        nameAr: c.nameAr,
      }))
    : categories;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16);

  // Sync category param changes (e.g. navigating from categories section)
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
  }, [categoryParam]);

  // Reset visible count whenever filters or search change
  useEffect(() => {
    setVisibleCount(16);
  }, [search, selectedCategory, selectedBrand, sortBy, promoParam]);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.nameAr.includes(search) || (p.name || "").toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (promoParam) result = result.filter((p) => p.isPromo);
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    return result;
  }, [products, search, selectedCategory, selectedBrand, sortBy, promoParam]);

  const pageTitle = promoParam
    ? "العروض الخاصة"
    : selectedCategory
    ? displayCategories.find(c => c.id === selectedCategory)?.nameAr || "المنتجات"
    : "جميع المنتجات";

  return (
    <Layout>
      <div className="container py-8 min-h-[60vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">
            {pageTitle}
            {!loading && <span className="text-sm font-normal text-muted-foreground mr-2">({filtered.length} منتج)</span>}
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث..."
                className="h-9 pr-9 pl-3 rounded-md bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/30 w-48"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline mr-1">تصفية</span>
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-md bg-secondary text-sm text-foreground outline-none border border-transparent"
            >
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: منخفض</option>
              <option value="price-high">السعر: مرتفع</option>
              <option value="rating">التقييم</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="glass-card rounded-xl p-4 mb-6 overflow-hidden">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-muted-foreground ml-2">الصنف:</span>
              <button onClick={() => setSelectedCategory("")} className={`px-2.5 py-1 rounded-md text-xs transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>الكل</button>
              {displayCategories.map((c) => (
                <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-2.5 py-1 rounded-md text-xs transition-colors ${selectedCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{c.nameAr}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground ml-2">العلامة:</span>
              <button onClick={() => setSelectedBrand("")} className={`px-2.5 py-1 rounded-md text-xs transition-colors ${!selectedBrand ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>الكل</button>
              {brands.map((b) => (
                <button key={b} onClick={() => setSelectedBrand(b)} className={`px-2.5 py-1 rounded-md text-xs transition-colors ${selectedBrand === b ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{b}</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          /* Skeleton loading grid — looks like real products loading */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <PackageSearch size={56} className="text-muted-foreground/30" />
            <p className="text-lg font-semibold text-muted-foreground">لا توجد منتجات مطابقة</p>
            {(selectedCategory || selectedBrand || search) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedBrand("");
                  setSearch("");
                }}
              >
                إزالة الفلاتر
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              عرض {Math.min(visibleCount, filtered.length)} من {filtered.length} منتج
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.slice(0, visibleCount).map((p, i) => (
                <ProductCard key={p._id || p.id} product={p} index={i} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((v) => v + 16)}
                  className="group flex items-center gap-2 px-8 py-3 rounded-2xl bg-secondary border border-border hover:border-primary/40 hover:bg-primary/10 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>عرض المزيد</span>
                  <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  <span className="text-xs text-muted-foreground">({filtered.length - visibleCount} متبقي)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
