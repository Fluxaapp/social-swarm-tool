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

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: "Total de Produtos",
      value: totalProducts,
      desc: `${featuredCount} em destaque`,
      icon: ShoppingBag,
      color: "text-blue-400 bg-blue-950/30 border-blue-900/50",
    },
    {
      label: "Produtos Ativos",
      value: activeProducts,
      desc: "Visíveis na loja",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-950/30 border-emerald-900/50",
    },
    {
      label: "Produtos Inativos",
      value: inactiveProducts,
      desc: "Rascunho ou ocultados",
      icon: XCircle,
      color: "text-amber-400 bg-amber-950/30 border-amber-900/50",
    },
    {
      label: "Preço Médio",
      value: formatBRL(avgPrice),
      desc: "Média do catálogo",
      icon: DollarSign,
      color: "text-indigo-400 bg-indigo-950/30 border-indigo-900/50",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-1">Visão geral do catálogo da loja e estatísticas gerais.</p>
        </div>
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-neutral-100 text-neutral-950 font-medium text-[13px] hover:bg-neutral-200 transition-all"
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
              className={`p-6 rounded-xl border ${s.color.split(" ")[2]} ${s.color.split(" ")[1]} flex items-start justify-between`}
            >
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                  {s.label}
                </span>
                <span className="block text-2xl font-semibold text-neutral-100 tracking-tight">
                  {s.value}
                </span>
                <span className="block text-xs text-neutral-500">
                  {s.desc}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${s.color.split(" ")[2]} bg-neutral-950/40 ${s.color.split(" ")[0]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent products list */}
        <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-medium text-neutral-100">Adicionados Recentemente</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Últimos produtos inseridos no catálogo.</p>
            </div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  <th className="py-3 pr-4">Produto</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-right">Preço</th>
                  <th className="py-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {recentProducts.length > 0 ? (
                  recentProducts.map((p) => (
                    <tr key={p.slug} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="py-3.5 pr-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-neutral-800 border border-neutral-700/30 overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-medium text-neutral-200 truncate max-w-[200px]">{p.name}</span>
                          <span className="block text-[10px] text-neutral-500 mt-0.5 truncate max-w-[200px]">{p.shortDescription}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 font-medium">
                        {typeLabel(p.type)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-neutral-200">
                        {p.promoPrice && p.promoPrice > 0 ? (
                          <div className="space-y-0.5">
                            <span className="block">{formatBRL(p.promoPrice)}</span>
                            <span className="block text-[10px] text-neutral-500 line-through">{formatBRL(p.price)}</span>
                          </div>
                        ) : (
                          <span>{formatBRL(p.price)}</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.status === "publicado"
                            ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
                            : p.status === "rascunho"
                            ? "bg-amber-950/20 border-amber-900/40 text-amber-400"
                            : "bg-neutral-800 border-neutral-700/60 text-neutral-400"
                        }`}>
                          {p.status === "publicado" ? "Ativo" : p.status === "rascunho" ? "Rascunho" : "Oculto"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-500">
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick info / guide */}
        <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-[15px] font-medium text-neutral-100">Guia Rápido</h2>
            <div className="space-y-3.5 text-xs text-neutral-400 leading-relaxed">
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

          <div className="pt-6 border-t border-neutral-800/80">
            <Link
              to="/loja"
              target="_blank"
              className="inline-flex items-center justify-center w-full h-10 border border-neutral-800 hover:border-neutral-700 bg-neutral-950/30 rounded-lg text-xs font-medium text-neutral-300 hover:text-neutral-100 transition-all"
            >
              Visualizar Loja ao Vivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
