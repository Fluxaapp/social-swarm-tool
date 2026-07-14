import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/shop/cart";
import { CONTACT } from "@/lib/contact";

export const Route = createFileRoute("/loja")({
  component: LojaLayout,
});

function LojaHeader() {
  const { itemCount } = useCart();
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-soft border-b border-line">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink/55 hover:text-ink transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Site
          </Link>
          <span className="hidden md:inline h-4 w-px bg-line" />
          <Link to="/loja" className="flex items-center leading-none">
            <span className="text-[17px] tracking-tight text-ink">
              <span className="font-light">Loja</span>
              <span className="mx-2 text-ink/30 font-light">|</span>
              <span className="font-semibold">Glass Maind</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-9 text-[14px] text-ink/60">
          <Link to="/loja" className="hover:text-ink transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-ink" }}>Início</Link>
          <a href="#categorias" className="hover:text-ink transition-colors">Categorias</a>
          <a href="#produtos" className="hover:text-ink transition-colors">Produtos</a>
        </nav>

        <Link
          to="/loja/carrinho"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-paper text-[12px] tracking-[0.14em] uppercase hover:bg-ink/90 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Carrinho
          {itemCount > 0 && (
            <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-paper text-ink text-[11px] font-medium inline-flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function LojaFooter() {
  return (
    <footer className="border-t border-line bg-soft mt-24">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-ink/55">
        <div>
          © {new Date().getFullYear()} Glass Maind — Loja Digital.
        </div>
        <div className="flex items-center gap-6">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-ink transition-colors">
            {CONTACT.email}
          </a>
          <Link to="/" className="hover:text-ink transition-colors">Voltar ao site</Link>
        </div>
      </div>
    </footer>
  );
}

function LojaLayout() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <LojaHeader />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <LojaFooter />
    </div>
  );
}
