import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  CATEGORIES,
  bestSellersSync,
  featuredProductsSync,
  formatBRL,
  listProductsSync,
  recentProductsSync,
  typeLabel,
  getProducts,
  getLayout,
  type Product,
} from "@/lib/shop/products";

export const Route = createFileRoute("/loja/")({
  head: () => ({
    meta: [
      { title: "Loja — Glass Maind" },
      { name: "description", content: "Templates, licenças e serviços premium da Glass Maind. Estética editorial, entrega direta." },
      { property: "og:title", content: "Loja — Glass Maind" },
      { property: "og:description", content: "Templates, licenças e serviços premium da Glass Maind." },
    ],
  }),
  loader: async () => {
    try {
      const products = await getProducts();
      const layout = await getLayout();
      return { products: products || [], layout };
    } catch (error) {
      console.error("Error loading products or layout in shop loader", error);
      return { products: [], layout: { heroTitle: "Produtos digitais e serviços.", heroDescription: "Templates e licenças." } };
    }
  },
  component: LojaHome,
});

function ProductCard({ product }: { product: Product }) {
  const hasPromo = product.promoPrice && product.promoPrice > 0;
  
  return (
    <Link
      to="/loja/produto/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col bg-paper border border-line rounded-2xl overflow-hidden hover:border-ink/40 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-soft overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-[10px] tracking-[0.2em] uppercase bg-ink text-paper px-2.5 py-1 rounded-full">
            {typeLabel(product.type)}
          </span>
          {product.badge && (
            <span className="text-[10px] tracking-[0.15em] uppercase bg-paper border border-line text-ink px-2.5 py-1 rounded-full font-medium shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="text-[15px] font-medium text-ink leading-snug">{product.name}</h3>
        <p className="text-[13px] text-ink/60 line-clamp-2">{product.shortDescription}</p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasPromo ? (
              <>
                <span className="text-[15px] font-semibold text-ink">{formatBRL(product.promoPrice!)}</span>
                <span className="text-[12px] text-ink/40 line-through">{formatBRL(product.price)}</span>
              </>
            ) : (
              <span className="text-[15px] font-semibold text-ink">{formatBRL(product.price)}</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase text-ink/60 group-hover:text-ink transition-colors">
            Ver <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink/55 mb-6">
      <span>{index}</span>
      <span className="h-px w-6 bg-ink/30" />
      {title}
    </div>
  );
}

function LojaHome() {
  const { products, layout } = Route.useLoaderData();
  
  const featured = featuredProductsSync(products);
  const best = bestSellersSync(products);
  const recent = recentProductsSync(products);

  return (
    <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
      {/* HERO */}
      <section className="relative py-16 md:py-24 border-b border-line">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink/55 mb-6">
          <span>01</span>
          <span className="h-px w-6 bg-ink/30" />
          Loja Glass Maind
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-ink leading-[1.05] tracking-tight max-w-4xl whitespace-pre-line">
          {layout.heroTitle}
        </h1>
        <p className="mt-6 max-w-xl text-[15px] text-ink/60 leading-relaxed">
          {layout.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#produtos"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink text-paper text-[12px] tracking-[0.16em] uppercase hover:bg-ink/90 transition-colors"
          >
            Ver produtos <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#categorias"
            className="inline-flex items-center h-11 px-5 rounded-full border border-line text-ink text-[12px] tracking-[0.16em] uppercase hover:border-ink/40 transition-colors"
          >
            Explorar categorias
          </a>
        </div>
      </section>

      {/* DYNAMIC PROMO BANNER */}
      {layout.bannerUrl && (
        <section className="my-12 relative aspect-[3/1] md:aspect-[4/1] rounded-2xl overflow-hidden border border-line bg-soft select-none">
          <img src={layout.bannerUrl} alt="Banner Promocional" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-transparent flex flex-col justify-center px-8 sm:px-12 md:px-16 text-paper">
            {layout.bannerText && (
              <h2 className="text-xl sm:text-2xl md:text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-snug tracking-tight max-w-2xl text-balance">
                {layout.bannerText}
              </h2>
            )}
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20">
          <SectionLabel index="02" title="Em destaque" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIAS */}
      <section id="categorias" className="py-16 md:py-20 border-t border-line">
        <SectionLabel index="03" title="Categorias" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => {
            const count = listProductsSync(products, { categoryId: c.id }).length;
            return (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-line hover:border-ink/40 transition-colors bg-paper min-h-[160px]"
              >
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50">
                    {count} {count === 1 ? "item" : "itens"}
                  </div>
                  <h3 className="mt-2 text-[17px] font-medium text-ink">{c.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink/60 group-hover:text-ink transition-colors">
                  Ver <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      {best.length > 0 && (
        <section className="py-16 md:py-20 border-t border-line">
          <SectionLabel index="04" title="Mais vendidos" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {best.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* RECENTES + POR CATEGORIA */}
      <section id="produtos" className="py-16 md:py-20 border-t border-line">
        <SectionLabel index="05" title="Todos os produtos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {CATEGORIES.map((c) => {
          const items = listProductsSync(products, { categoryId: c.id });
          if (items.length === 0) return null;
          return (
            <div key={c.id} id={`cat-${c.id}`} className="mt-16 pt-12 border-t border-line">
              <div className="flex items-end justify-between mb-6 gap-6">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-2">Categoria</div>
                  <h3 className="text-2xl md:text-3xl font-light text-ink">{c.name}</h3>
                </div>
                <span className="text-[12px] text-ink/50">{items.length} {items.length === 1 ? "item" : "itens"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
