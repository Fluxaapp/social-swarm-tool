import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldAlert, LayoutDashboard, ShoppingCart, LogOut, ArrowLeft, Key } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const AUTH_KEY = "glassmaind_admin_auth";

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(token === "authenticated");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default credentials
    if (username === "admin" && password === "admin") {
      localStorage.setItem(AUTH_KEY, "authenticated");
      setIsAuthenticated(true);
      setError("");
      // Force reload router state
      router.invalidate();
    } else {
      setError("Credenciais inválidas. Tente admin / admin.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    navigate({ to: "/admin" });
  };

  // Wait for hydration/check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render login portal
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow ambient */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neutral-800/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-neutral-800/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[420px] bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-neutral-800 border border-neutral-700/50 flex items-center justify-center mb-4 text-neutral-200">
              <Key className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-medium text-neutral-100 tracking-tight">Área Administrativa</h1>
            <p className="text-xs text-neutral-500 mt-1">Acesse para gerenciar os produtos da sua loja.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-[13px] text-red-400 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-1.5 font-medium">Usuário</label>
              <input
                id="user"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin"
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 text-[14px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="pass" className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-1.5 font-medium">Senha</label>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 text-[14px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-neutral-100 text-neutral-950 rounded-lg font-medium text-[13px] tracking-[0.05em] uppercase hover:bg-neutral-200 active:scale-[0.99] transition-all mt-6"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
            <Link to="/loja" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Voltar para a Loja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Render Authenticated Admin Layout
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
        <div className="h-16 border-b border-neutral-800 px-6 flex items-center">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-neutral-200 text-neutral-950 flex items-center justify-center font-bold text-xs">GM</span>
            <span className="font-semibold text-[14px] uppercase tracking-wider text-neutral-100">Painel Admin</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-neutral-800 text-neutral-100" }}
            className="flex items-center gap-3 h-10 px-3.5 rounded-lg text-[13px] text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            activeProps={{ className: "bg-neutral-800 text-neutral-100" }}
            className="flex items-center gap-3 h-10 px-3.5 rounded-lg text-[13px] text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Produtos</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-1">
          <Link
            to="/loja"
            className="flex items-center gap-3 h-10 px-3.5 rounded-lg text-[13px] text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ver Loja</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 h-10 px-3.5 rounded-lg text-[13px] text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-neutral-800 px-8 flex items-center justify-between shrink-0 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="text-[13px] text-neutral-500 font-medium">
            Agência Glass Maind • Sistema Administrativo
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400 font-medium bg-neutral-800 border border-neutral-700/30 px-3 py-1 rounded-full">
              Sessão Ativa
            </span>
          </div>
        </header>

        {/* CONTENT ROUTE */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
