import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import {
  findCategory,
  findProduct,
  formatBRL,
  typeLabel,
} from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

export const Route = createFileRoute("/loja/produto/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produto não encontrado — Loja Glass Maind" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Loja Glass Maind` },
        { name: "description", content: p.shortDescription },
        { property: "og:title", content: `${p.name} — Loja Glass Maind` },
        { property: "og:description", content: p.shortDescription },
        { property: "og:image", content: p.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-[900px] px-6 py-24 text-center">
      <h1 className="text-3xl font-light text-ink">Produto não encontrado</h1>
      <p className="mt-3 text-ink/60">Este produto não existe ou foi removido.</p>
      <Link to="/loja" className="inline-flex items-center gap-2 mt-8 h-11 px-5 rounded-full bg-ink text-paper text-[12px] tracking-[0.16em] uppercase">
        Voltar à loja
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = findCategory(product.categoryId);
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    add(product.slug, 1);
    navigate({ to: "/loja/carrinho" });
  };

  return (
    <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-10 md:py-16">
      <Link to="/loja" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink/55 hover:text-ink transition-colors mb-8">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar à loja
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Imagens */}
        <div>
          <div className="aspect-[4/3] bg-soft rounded-2xl overflow-hidden border border-line">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.gallery && product.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((src) => (
                <div key={src} className="aspect-square bg-soft rounded-lg overflow-hidden border border-line">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink/55 mb-4">
            <span className="px-2.5 py-1 border border-line rounded-full">{typeLabel(product.type)}</span>
            {category && <span className="text-ink/50">{category.name}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-ink leading-[1.05] tracking-tight">
            {product.name}
          </h1>
          <p className="mt-5 text-[15px] text-ink/70 leading-relaxed">
            {product.description}
          </p>

          {/* Detalhes específicos */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {product.license && (
              <>
                <Detail label="Duração" value={product.license.duration} />
                {product.license.version && <Detail label="Versão" value={product.license.version} />}
              </>
            )}
            {product.deliveryTime && <Detail label="Prazo de entrega" value={product.deliveryTime} />}
            {product.files && product.files.length > 0 && (
              <Detail label="Arquivos" value={product.files.map((f) => f.name).join(", ")} />
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-line">
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50">Preço</div>
            <div className="mt-1 text-4xl font-semibold text-ink">{formatBRL(product.price)}</div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink text-paper text-[12px] tracking-[0.16em] uppercase hover:bg-ink/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" /> Comprar agora
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-line text-ink text-[12px] tracking-[0.16em] uppercase hover:border-ink/40 transition-colors"
              >
                {added ? (
                  <><Check className="h-4 w-4" /> Adicionado</>
                ) : (
                  <>Adicionar ao carrinho</>
                )}
              </button>
            </div>
            <p className="mt-4 text-[12px] text-ink/50">
              Pagamento seguro • Entrega imediata após confirmação (produtos digitais)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50">{label}</div>
      <div className="mt-1 text-[14px] text-ink">{value}</div>
    </div>
  );
}
