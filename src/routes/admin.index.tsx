import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, CheckCircle, XCircle, DollarSign, Plus, ArrowRight } from "lucide-react";
import { getProducts, formatBRL, typeLabel } from "@/lib/shop/products";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    try {
      const products = await getProducts();
      return { products: products || [] };
    } catch (error) {
      console.error("Error loading products in admin dashboard loader", error);
      return { products: [] };
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products } = Route.useLoaderData();

  // Calculations
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "publicado").length;
  const inactiveProducts = products.filter((p) => p.status !== "publicado").length;
  const featuredCount = products.filter((p) => p.featured).length;

  const avgPrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
      : 0;

  // Safe sorting to prevent crashes if createdAt is missing
  const recentProducts = [...products]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 5);

  const stats = [
    {
      label: "Total de Produtos",
      value: totalProducts,
      desc: `${featuredCount} em destaque`,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50/50 border-blue-100",
    },
    {
      label: "Produtos Ativos",
      value: activeProducts,
      desc: "Visíveis na loja",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50/50 border-emerald-100",
    },
    {
      label: "Produtos Inativos",
      value: inactiveProducts,
      desc: "Rascunho ou ocultados",
      icon: XCircle,
      color: "text-amber-600 bg-amber-50/50 border-amber-100",
    },
    {
      label: "Preço Médio",
      value: formatBRL(avgPrice),
      desc: "Média do catálogo",
      icon: DollarSign,
      color: "text-indigo-600 bg-indigo-50/50 border-indigo-100",
    },
  ];

  return (
    <div className="space-y-10 font-sans text-ink">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Dashboard</h1>
          <p className="text-xs text-dim mt-1">Visão geral do catálogo da loja e estatísticas gerais.</p>
        </div>
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-paper font-semibold text-[12px] uppercase hover:bg-ink/90 active:scale-[0.99] transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Novo Produto
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${s.color.split(" ")[2]} ${s.color.split(" ")[1]} flex items-start justify-between bg-paper`}
            >
              <div className="space-y-2">
                <span className="block text-[10px] uppercase tracking-wider text-dim font-bold">
                  {s.label}
                </span>
                <span className="block text-2xl font-semibold text-ink tracking-tight font-mono">
                  {s.value}
                </span>
                <span className="block text-xs text-dim">
                  {s.desc}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${s.color.split(" ")[2]} bg-soft/50 ${s.color.split(" ")[0]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent products list */}
        <div className="lg:col-span-8 bg-soft/30 border border-line rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Adicionados Recentemente</h2>
              <p className="text-xs text-dim mt-0.5">Últimos produtos inseridos no catálogo.</p>
            </div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-dim hover:text-ink font-semibold transition-colors"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-dim font-bold">
                  <th className="py-3 pr-4">Produto</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-right">Preço</th>
                  <th className="py-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentProducts.length > 0 ? (
                  recentProducts.map((p) => (
                    <tr key={p.slug} className="hover:bg-soft/20 transition-colors">
                      <td className="py-3.5 pr-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-soft border border-line overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-semibold text-ink truncate max-w-[200px]">{p.name}</span>
                          <span className="block text-[10px] text-dim mt-0.5 truncate max-w-[200px]">{p.shortDescription}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink/75 font-medium">
                        {typeLabel(p.type)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-ink font-mono">
                        {p.promoPrice && p.promoPrice > 0 ? (
                          <div className="space-y-0.5">
                            <span className="block">{formatBRL(p.promoPrice)}</span>
                            <span className="block text-[10px] text-dim line-through">{formatBRL(p.price)}</span>
                          </div>
                        ) : (
                          <span>{formatBRL(p.price)}</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.status === "publicado"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : p.status === "rascunho"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-soft border-line text-dim"
                        }`}>
                          {p.status === "publicado" ? "Ativo" : p.status === "rascunho" ? "Rascunho" : "Oculto"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-dim">
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick info / guide */}
        <div className="lg:col-span-4 bg-soft/30 border border-line rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-[15px] font-semibold text-ink">Guia Rápido</h2>
            <div className="space-y-3.5 text-xs text-dim leading-relaxed">
              <p>
                <strong>Preços Promocionais:</strong> Se configurado, o preço promocional substitui o preço normal no checkout e risca o preço antigo na loja.
              </p>
              <p>
                <strong>Badges:</strong> Use badges como "Novo", "Destaque" ou "Mais Vendido" para dar ênfase visual nos cards da loja.
              </p>
              <p>
                <strong>Botão de Compra Externo:</strong> Se você definir uma URL de compra externa, os botões da loja redirecionarão diretamente para lá, ignorando o fluxo do carrinho local.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-line">
            <Link
              to="/loja"
              target="_blank"
              className="inline-flex items-center justify-center w-full h-10 border border-line bg-paper rounded-full text-xs font-semibold uppercase tracking-wider text-ink hover:bg-soft transition-all"
            >
              Visualizar Loja ao Vivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
