import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const promoParam = searchParams.get("promo");

  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.nameAr.includes(search) || p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (promoParam) result = result.filter((p) => p.isPromo);
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, selectedCategory, selectedBrand, sortBy, promoParam]);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">
            {promoParam ? "العروض الخاصة" : selectedCategory ? categories.find(c => c.id === selectedCategory)?.nameAr || "المنتجات" : "جميع المنتجات"}
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
              {categories.map((c) => (
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
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={32} /></div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} منتج</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">لا توجد منتجات مطابقة</div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
