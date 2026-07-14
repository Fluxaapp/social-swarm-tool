// ============================================================================
// Glass Maind — Catálogo da Loja
// Edite os produtos aqui. Trocar por Supabase depois é só reescrever este arquivo
// mantendo os mesmos tipos exportados.
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
  image: string;
  gallery?: string[];
  categoryId: string;
  type: ProductType;
  status: ProductStatus;
  featured?: boolean;
  bestSeller?: boolean;
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

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80";

export const PRODUCTS: Product[] = [
  {
    slug: "identidade-visual-premium",
    name: "Identidade Visual Premium",
    shortDescription: "Sistema completo de marca com manual, aplicações e assets.",
    description:
      "Um projeto de identidade visual completo, pensado para marcas que querem parecer maiores e serem lembradas. Inclui pesquisa de posicionamento, criação de logo, paleta, tipografia, manual de marca e kit de aplicações prontas para uso.",
    price: 4900,
    image: PLACEHOLDER,
    categoryId: "servicos",
    type: "servico",
    status: "publicado",
    featured: true,
    createdAt: "2025-11-01",
    deliveryTime: "15 dias úteis",
  },
  {
    slug: "template-pitch-deck",
    name: "Template Pitch Deck Premium",
    shortDescription: "20 slides editáveis para apresentar sua empresa como pro.",
    description:
      "Deck editorial em preto e branco, com tipografia premium e layouts orientados a conversão. Editável no Figma e Keynote. Inclui variações claras e escuras.",
    price: 189,
    image: PLACEHOLDER,
    categoryId: "templates",
    type: "digital",
    status: "publicado",
    featured: true,
    bestSeller: true,
    createdAt: "2025-10-20",
    files: [{ name: "pitch-deck.zip", size: "42 MB" }],
  },
  {
    slug: "kit-social-media",
    name: "Kit Social Media Editorial",
    shortDescription: "60 posts editáveis com estética minimalista premium.",
    description:
      "Kit completo para posicionar sua marca no Instagram com estética editorial. 60 layouts editáveis, guia de uso e paleta pronta.",
    price: 249,
    image: PLACEHOLDER,
    categoryId: "templates",
    type: "digital",
    status: "publicado",
    bestSeller: true,
    createdAt: "2025-10-05",
    files: [{ name: "social-kit.zip", size: "88 MB" }],
  },
  {
    slug: "licenca-glass-ui-pro",
    name: "Licença Glass UI Pro",
    shortDescription: "Biblioteca de componentes premium — licença anual.",
    description:
      "Acesso completo à biblioteca Glass UI Pro por 12 meses, com atualizações contínuas, novos componentes e suporte por email.",
    price: 590,
    image: PLACEHOLDER,
    categoryId: "software",
    type: "licenca",
    status: "publicado",
    featured: true,
    createdAt: "2025-09-15",
    license: { duration: "12 meses", version: "2.4" },
  },
  {
    slug: "landing-page-conversao",
    name: "Landing Page Alta Conversão",
    shortDescription: "Projeto sob medida de landing focada em resultado.",
    description:
      "Landing page desenvolvida do zero, com copy, design e estrutura otimizada para conversão. Inclui integração com formulário e analytics.",
    price: 2900,
    image: PLACEHOLDER,
    categoryId: "servicos",
    type: "servico",
    status: "publicado",
    createdAt: "2025-09-01",
    deliveryTime: "10 dias úteis",
  },
  {
    slug: "template-portfolio",
    name: "Template Portfólio Editorial",
    shortDescription: "Site portfolio pronto em Framer + Figma.",
    description:
      "Template completo de portfólio editorial. Editável, responsivo e otimizado. Inclui arquivos Figma e projeto Framer.",
    price: 149,
    image: PLACEHOLDER,
    categoryId: "templates",
    type: "digital",
    status: "publicado",
    createdAt: "2025-08-12",
    files: [{ name: "portfolio-template.zip", size: "24 MB" }],
  },
];

// ---- Helpers ----------------------------------------------------------------

export const listProducts = (opts?: { categoryId?: string }) =>
  PRODUCTS.filter((p) => p.status === "publicado")
    .filter((p) => !opts?.categoryId || p.categoryId === opts.categoryId);

export const findProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug && p.status === "publicado");

export const findCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export const featuredProducts = () => listProducts().filter((p) => p.featured);
export const bestSellers = () => listProducts().filter((p) => p.bestSeller);
export const recentProducts = () =>
  [...listProducts()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const typeLabel = (t: ProductType) =>
  t === "digital" ? "Produto Digital" : t === "licenca" ? "Licença" : "Serviço";
