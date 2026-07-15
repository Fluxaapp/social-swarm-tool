import { createServerFn } from "@tanstack/react-start";

// ============================================================================
// Glass Maind — Catálogo da Loja (Dinâmico via JSON DB)
// ============================================================================

export type ProductType = "digital" | "licenca" | "servico";
export type ProductStatus = "publicado" | "rascunho" | "oculto";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  image: string;
  gallery?: string[];
  categoryId: string;
  type: ProductType;
  status: ProductStatus;
  featured?: boolean;
  bestSeller?: boolean;
  badge?: string;
  displayOrder?: number;
  purchaseUrl?: string;
  demoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string; // ISO
  license?: {
    duration: string;
    version?: string;
  };
  files?: { name: string; size?: string }[];
  deliveryTime?: string;
}

export interface ShopLayout {
  heroTitle: string;
  heroDescription: string;
  bannerUrl?: string;
  bannerText?: string;
}

export const CATEGORIES: Category[] = [
  { id: "identidade", name: "Identidade Visual", description: "Marcas, logos e sistemas visuais completos." },
  { id: "templates", name: "Templates", description: "Kits prontos para acelerar seu projeto." },
  { id: "software", name: "Software & Licenças", description: "Ferramentas e chaves de ativação." },
  { id: "servicos", name: "Serviços Sob Medida", description: "Projetos personalizados criados pela nossa equipe." },
];

// ---- Server Functions --------------------------------------------------------

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { readDb } = await import("./products.server");
    return readDb();
  });

export const saveProduct = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: Product }) => {
    const { readDb, writeDb } = await import("./products.server");
    const products = readDb();
    const idx = products.findIndex((p) => p.slug === data.slug);
    
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString().split("T")[0];
    }
    
    if (idx >= 0) {
      products[idx] = data;
    } else {
      products.push(data);
    }
    
    // Sort by display order
    products.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    
    writeDb(products);
    return { success: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .handler(async ({ data: slug }: { data: string }) => {
    const { readDb, writeDb } = await import("./products.server");
    const products = readDb();
    const filtered = products.filter((p) => p.slug !== slug);
    writeDb(filtered);
    return { success: true };
  });

export const getLayout = createServerFn({ method: "GET" })
  .handler(async () => {
    const { readLayout } = await import("./products.server");
    return readLayout();
  });

export const saveLayout = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: ShopLayout }) => {
    const { writeLayout } = await import("./products.server");
    writeLayout(data);
    return { success: true };
  });

// ---- Helpers ----------------------------------------------------------------

export const listProductsSync = (products: Product[], opts?: { categoryId?: string }) =>
  products.filter((p) => p.status === "publicado")
    .filter((p) => !opts?.categoryId || p.categoryId === opts.categoryId);

export const findProductSync = (products: Product[], slug: string) =>
  products.find((p) => p.slug === slug && p.status === "publicado");

export const findCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export const featuredProductsSync = (products: Product[]) => 
  listProductsSync(products).filter((p) => p.featured);

export const bestSellersSync = (products: Product[]) => 
  listProductsSync(products).filter((p) => p.bestSeller || p.badge === "Mais Vendido");

export const recentProductsSync = (products: Product[]) =>
  [...listProductsSync(products)].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const typeLabel = (t: ProductType) =>
  t === "digital" ? "Produto Digital" : t === "licenca" ? "Licença" : "Serviço";
