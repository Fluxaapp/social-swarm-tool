import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldAlert, LayoutDashboard, ShoppingBag, LogOut, ArrowLeft, Key } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const AUTH_KEY = "glassmaind_admin_auth_v2";

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(token === "authenticated");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Agencia Glass Maind" && password === "GlassMinnds1!") {
      localStorage.setItem(AUTH_KEY, "authenticated");
      setIsAuthenticated(true);
      setError("");
      router.invalidate();
    } else {
      setError("Credenciais inválidas. Verifique o usuário e senha.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    navigate({ to: "/admin" });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-line border-t-ink rounded-full animate-spin"></div>
      </div>
    );
  }

  // Light Mode Login Portal (Matches Store aesthetics)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Editorial visual background grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.4] z-[1]" aria-hidden>
          <div className="absolute top-0 bottom-0 left-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
          <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gradient-to-b from-transparent via-ink/8 to-transparent" />
          <div className="absolute top-0 bottom-0 right-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
        </div>

        <div className="w-full max-w-[420px] bg-paper border border-line p-8 rounded-2xl shadow-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-full bg-soft border border-line flex items-center justify-center mb-4 text-ink/75">
              <Key className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-medium text-ink tracking-tight">Área Administrativa</h1>
            <p className="text-xs text-dim mt-1">Acesse para gerenciar os produtos da sua loja.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50/50 border border-red-200 text-[13px] text-red-700 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-[10px] uppercase tracking-[0.2em] text-dim mb-1.5 font-semibold">Usuário</label>
              <input
                id="user"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Agencia Glass Maind"
                className="w-full h-11 bg-soft border border-line rounded-xl px-3.5 text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="pass" className="block text-[10px] uppercase tracking-[0.2em] text-dim mb-1.5 font-semibold">Senha</label>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-soft border border-line rounded-xl px-3.5 text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-ink text-paper rounded-full font-medium text-[12px] tracking-[0.16em] uppercase hover:bg-ink/90 active:scale-[0.99] transition-all mt-6"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <Link to="/loja" className="inline-flex items-center gap-1.5 text-xs text-dim hover:text-ink transition-colors">
              <ArrowLeft className="h-3 w-3" /> Voltar para a Loja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Light Mode Layout matching Store/Site style
  return (
    <div className="min-h-screen bg-paper text-ink flex font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-soft border-r border-line flex flex-col shrink-0">
        <div className="h-16 md:h-20 border-b border-line px-6 flex items-center">
          <Link to="/" className="flex items-center leading-none">
            <span className="text-[15px] tracking-tight text-ink">
              <span className="font-light">Agencia</span>
              <span className="mx-1 text-ink/30 font-light">|</span>
              <span className="font-semibold text-xs tracking-wider uppercase bg-ink text-paper px-2 py-0.5 rounded ml-1">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-paper text-ink border border-line" }}
            className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-ink/65 hover:bg-paper/40 hover:text-ink transition-all border border-transparent"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            activeProps={{ className: "bg-paper text-ink border border-line" }}
            className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-ink/65 hover:bg-paper/40 hover:text-ink transition-all border border-transparent"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="font-medium">Produtos & Layout</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-line space-y-1.5">
          <Link
            to="/loja"
            className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-ink/65 hover:bg-paper/40 hover:text-ink transition-all border border-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Ir para Loja</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-all text-left border border-transparent font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 border-b border-line px-8 flex items-center justify-between shrink-0 bg-paper sticky top-0 z-50">
          <div className="text-[12px] text-dim font-medium uppercase tracking-wider">
            Painel de Controle • Glass Maind
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] tracking-[0.14em] uppercase text-dim bg-soft border border-line px-3 py-1 rounded-full font-medium">
              Sessão Administrativa
            </span>
          </div>
        </header>

        {/* CONTENT ROUTE */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10 bg-paper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
