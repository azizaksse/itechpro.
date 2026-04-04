import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            nameAr: p.name_ar,
            price: p.price,
            oldPrice: p.old_price ?? undefined,
            category: p.category,
            brand: p.brand,
            image: p.image || "",
            specs: (p.specs as Record<string, string>) || {},
            inStock: p.in_stock,
            isNew: p.is_new,
            isPromo: p.is_promo,
            rating: Number(p.rating),
            reviews: p.reviews,
          }))
        );
      }
      if (error) console.error("Failed to fetch products:", error);
      setLoading(false);
    };

    fetchProducts();

    // Realtime subscription
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading };
};
