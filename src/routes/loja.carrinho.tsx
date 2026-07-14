import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/shop/cart";
import { formatBRL, typeLabel } from "@/lib/shop/products";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/loja/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Loja Glass Maind" },
      { name: "description", content: "Revise seus itens e finalize a compra." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, subtotal, itemCount, setQuantity, remove, clear } = useCart();

  const message =
    detailed.length === 0
      ? ""
      : `Olá! Quero finalizar a compra dos itens abaixo:\n\n${detailed
          .map((d) => `• ${d.product.name} — ${d.quantity}x ${formatBRL(d.product.price)}`)
          .join("\n")}\n\nSubtotal: ${formatBRL(subtotal)}`;

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-ink/30" />
        <h1 className="mt-6 text-3xl font-light text-ink">Seu carrinho está vazio</h1>
        <p className="mt-3 text-ink/60">Explore a loja e adicione seus primeiros itens.</p>
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 mt-8 h-11 px-5 rounded-full bg-ink text-paper text-[12px] tracking-[0.16em] uppercase"
        >
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-6 md:px-10 py-10 md:py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink/55 mb-4">
        <span>01</span>
        <span className="h-px w-6 bg-ink/30" />
        Carrinho
      </div>
      <h1 className="text-3xl md:text-5xl font-light text-ink tracking-tight">
        Revise seu pedido
      </h1>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Itens */}
        <div className="border border-line rounded-2xl overflow-hidden divide-y divide-line">
          {detailed.map(({ product, quantity, lineTotal }) => (
            <div key={product.slug} className="p-5 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-soft border border-line shrink-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50">
                  {typeLabel(product.type)}
                </div>
                <Link
                  to="/loja/produto/$slug"
                  params={{ slug: product.slug }}
                  className="block mt-1 text-[15px] font-medium text-ink hover:underline"
                >
                  {product.name}
                </Link>
                <div className="mt-1 text-[13px] text-ink/60">{formatBRL(product.price)}</div>

                <div className="mt-3 inline-flex items-center border border-line rounded-full">
                  <button
                    type="button"
                    onClick={() => setQuantity(product.slug, quantity - 1)}
                    className="h-8 w-8 inline-flex items-center justify-center text-ink/70 hover:text-ink"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[28px] text-center text-[13px] tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.slug, quantity + 1)}
                    className="h-8 w-8 inline-flex items-center justify-center text-ink/70 hover:text-ink"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-3">
                <div className="text-[15px] font-semibold text-ink">{formatBRL(lineTotal)}</div>
                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="inline-flex items-center gap-1 text-[11px] tracking-[0.16em] uppercase text-ink/50 hover:text-ink transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <aside className="border border-line rounded-2xl p-6 h-fit bg-soft/50 sticky top-24">
          <div className="text-[10px] tracking-[0.2em] uppercase text-ink/50">Resumo</div>
          <div className="mt-4 flex items-center justify-between text-[14px] text-ink/70">
            <span>Itens</span>
            <span className="tabular-nums">{itemCount}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[14px] text-ink/70">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatBRL(subtotal)}</span>
          </div>
          <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
            <span className="text-[13px] tracking-[0.16em] uppercase text-ink/60">Total</span>
            <span className="text-2xl font-semibold text-ink">{formatBRL(subtotal)}</span>
          </div>

          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 h-12 rounded-full bg-ink text-paper text-[12px] tracking-[0.16em] uppercase hover:bg-ink/90 transition-colors"
          >
            Finalizar pelo WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
              "Pedido — Loja Glass Maind",
            )}&body=${encodeURIComponent(message)}`}
            className="mt-3 inline-flex w-full items-center justify-center h-11 rounded-full border border-line text-ink text-[12px] tracking-[0.16em] uppercase hover:border-ink/40 transition-colors"
          >
            Enviar por email
          </a>
          <button
            type="button"
            onClick={clear}
            className="mt-4 w-full text-[11px] tracking-[0.18em] uppercase text-ink/50 hover:text-ink transition-colors"
          >
            Esvaziar carrinho
          </button>
          <p className="mt-4 text-[11px] text-ink/50 leading-relaxed">
            O pagamento será combinado no atendimento. Em breve, checkout automático com Stripe / Mercado Pago.
          </p>
        </aside>
      </div>
    </div>
  );
}
