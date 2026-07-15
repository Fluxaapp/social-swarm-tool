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

export const CATEGORIES: Category[] = [
  { id: "identidade", name: "Identidade Visual", description: "Marcas, logos e sistemas visuais completos." },
  { id: "templates", name: "Templates", description: "Kits prontos para acelerar seu projeto." },
  { id: "software", name: "Software & Licenças", description: "Ferramentas e chaves de ativação." },
  { id: "servicos", name: "Serviços Sob Medida", description: "Projetos personalizados criados pela nossa equipe." },
];

// Fallback products used as initial state if DB fails to read or load
export const STATIC_PRODUCTS: Product[] = [
  {
    slug: "identidade-visual-premium",
    name: "Identidade Visual Premium",
    shortDescription: "Sistema completo de marca com manual, aplicações e assets.",
    description: "Um projeto de identidade visual completo, pensado para marcas que querem parecer maiores e serem lembradas. Inclui pesquisa de posicionamento, criação de logo, paleta, tipografia, manual de marca e kit de aplicações prontas para uso.",
    price: 4900,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    categoryId: "servicos",
    type: "servico",
    status: "publicado",
    featured: true,
    createdAt: "2025-11-01",
    deliveryTime: "15 dias úteis",
    displayOrder: 1,
    seoTitle: "Identidade Visual Premium | Glass Maind",
    seoDescription: "Desenvolvimento completo de marca pela Glass Maind."
  }
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
