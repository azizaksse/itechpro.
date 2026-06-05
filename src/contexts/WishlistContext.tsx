import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

interface WishlistContextType {
  items: Product[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
  totalItems: number;
}

const WISHLIST_KEY = "propc-wishlist";

const loadWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
};

const saveWishlist = (items: Product[]) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {}
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getPId = (p: Product) => p._id || p.id;

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(loadWishlist);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const toggleItem = useCallback((product: Product) => {
    const productId = getPId(product);
    setItems((prev) => {
      const exists = prev.some((p) => getPId(p) === productId);
      if (exists) return prev.filter((p) => getPId(p) !== productId);
      return [...prev, product];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => getPId(p) !== productId));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const isWishlisted = useCallback(
    (productId: string) => items.some((p) => getPId(p) === productId),
    [items]
  );

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, isOpen, setIsOpen, toggleItem, removeItem, clearWishlist, isWishlisted, totalItems }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
