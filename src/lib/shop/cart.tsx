import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProducts, type Product } from "./products";

export interface CartLine {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  add: (slug: string, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  detailed: { product: Product; quantity: number; lineTotal: number }[];
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "glassmaind_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load products list from database
    getProducts()
      .then((res) => {
        if (res) setProducts(res);
      })
      .catch((err) => console.error("Error loading products for cart", err));

    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { slug, quantity }];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, quantity } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        if (!product) return null;
        // Use promotional price if available
        const price = product.promoPrice && product.promoPrice > 0 ? product.promoPrice : product.price;
        return { product, quantity: l.quantity, lineTotal: price * l.quantity };
      })
      .filter(Boolean) as { product: Product; quantity: number; lineTotal: number }[];
    const subtotal = detailed.reduce((sum, d) => sum + d.lineTotal, 0);
    const itemCount = detailed.reduce((sum, d) => sum + d.quantity, 0);
    return { lines, itemCount, subtotal, add, remove, setQuantity, clear, detailed };
  }, [lines, products, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
