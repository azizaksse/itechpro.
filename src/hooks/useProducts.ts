import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Product } from "@/data/products";

export const useProducts = () => {
  const convexProducts = useQuery(api.products.getProducts);
  
  // Map convex products to match our Product interface expectations roughly
  // while ensuring we don't break strict typing if possible
  const products = (convexProducts || []).map((p: any) => ({
    ...p,
    id: p._id, // Map _id to id for components that expect .id
    rating: p.rating || 5,
    reviews: p.reviews || 0,
  })) as Product[];

  const loading = convexProducts === undefined;

  return { products, loading };
};
