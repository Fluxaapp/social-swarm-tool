import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldAlert, LayoutDashboard, ShoppingBag, LogOut, ArrowLeft, Key, Inbox, UserRoundPlus, Loader2 } from "lucide-react";
import { bootstrapAdmin, getBootstrapStatus, restoreAdminSession, signInAdmin, signOutAdmin, type FluxaSession } from "../lib/fluxa";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

export function AdminLayout() {
  const [session, setSession] = useState<FluxaSession | null | undefined>(undefined);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bootstrapCode, setBootstrapCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        window.localStorage.removeItem("glassmaind_admin_auth_v2");
        const restored = await restoreAdminSession();
        if (!active) return;
        setSession(restored);
        if (restored) {
          setIsConfigured(true);
          return;
        }
        const status = await getBootstrapStatus();
        if (active) setIsConfigured(status.bootstrapped);
      } catch {
        if (active) {
          setSession(null);
          setIsConfigured(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const next = await signInAdmin(email, password);
      setSession(next);
      setIsConfigured(true);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar no painel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBootstrap = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await bootstrapAdmin(email, password, bootstrapCode);
      const next = await signInAdmin(email, password);
      setSession(next);
      setIsConfigured(true);
      setBootstrapCode("");
    } catch (bootstrapError) {
      setError(bootstrapError instanceof Error ? bootstrapError.message : "Não foi possível ativar o acesso administrativo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setSession(null);
    navigate({ to: "/admin" });
  };

  if (session === undefined || isConfigured === null) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-dim" />
      </div>
    );
  }

  if (!session) {
    const firstAccess = isConfigured === false;
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="pointer-events-none absolute inset-0 opacity-[0.4] z-[1]" aria-hidden>
          <div className="absolute top-0 bottom-0 left-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
          <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gradient-to-b from-transparent via-ink/8 to-transparent" />
          <div className="absolute top-0 bottom-0 right-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
        </div>

        <div className="w-full max-w-[440px] bg-paper border border-line p-8 rounded-2xl shadow-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-full bg-soft border border-line flex items-center justify-center mb-4 text-ink/75">
              {firstAccess ? <UserRoundPlus className="h-5 w-5" /> : <Key className="h-5 w-5" />}
            </div>
            <h1 className="text-xl font-medium text-ink tracking-tight">{firstAccess ? "Ativar painel Fluxa" : "Área Administrativa"}</h1>
            <p className="text-xs text-dim mt-1 max-w-[320px] leading-5">
              {firstAccess
                ? "Crie o primeiro acesso administrativo protegido pelo Supabase Auth. Esta etapa só pode ser concluída uma vez."
                : "Entre com o acesso administrativo da Glass Maind."}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50/50 border border-red-200 text-[13px] text-red-700 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={firstAccess ? handleBootstrap : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-[10px] uppercase tracking-[0.2em] text-dim mb-1.5 font-semibold">E-mail</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@glassmaind.com"
                className="w-full h-11 bg-soft border border-line rounded-xl px-3.5 text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-[10px] uppercase tracking-[0.2em] text-dim mb-1.5 font-semibold">Senha</label>
              <input
                id="admin-password"
                type="password"
                autoComplete={firstAccess ? "new-password" : "current-password"}
                minLength={firstAccess ? 12 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 bg-soft border border-line rounded-xl px-3.5 text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
              />
              {firstAccess && <p className="mt-1.5 text-[10px] text-dim">Use pelo menos 12 caracteres.</p>}
            </div>

            {firstAccess && (
              <div>
                <label htmlFor="bootstrap-code" className="block text-[10px] uppercase tracking-[0.2em] text-dim mb-1.5 font-semibold">Código de ativação</label>
                <input
                  id="bootstrap-code"
                  type="password"
                  autoComplete="off"
                  required
                  value={bootstrapCode}
                  onChange={(event) => setBootstrapCode(event.target.value)}
                  placeholder="FLUXA-••••••••••••••••"
                  className="w-full h-11 bg-soft border border-line rounded-xl px-3.5 text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-ink text-paper rounded-full font-medium text-[12px] tracking-[0.16em] uppercase hover:bg-ink/90 active:scale-[0.99] transition-all mt-6 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {firstAccess ? "Ativar acesso" : "Entrar no painel"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-dim hover:text-ink transition-colors">
              <ArrowLeft className="h-3 w-3" /> Voltar para o site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex font-sans antialiased">
      <aside className="w-[260px] bg-soft border-r border-line flex flex-col shrink-0">
        <div className="h-16 md:h-20 border-b border-line px-6 flex items-center">
          <Link to="/" className="flex items-center leading-none">
            <span className="text-[15px] tracking-tight text-ink">
              <span className="font-light">Glass Maind</span>
              <span className="mx-1 text-ink/30 font-light">|</span>
              <span className="font-semibold text-xs tracking-wider uppercase bg-ink text-paper px-2 py-0.5 rounded ml-1">Fluxa</span>
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
            to="/admin/reports"
            activeProps={{ className: "bg-paper text-ink border border-line" }}
            className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-ink/65 hover:bg-paper/40 hover:text-ink transition-all border border-transparent"
          >
            <Inbox className="h-4 w-4" />
            <span className="font-medium">Reports</span>
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
          <div className="px-4 pb-2 text-[10px] text-dim truncate">{session.user.email}</div>
          <Link
            to="/"
            className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] text-ink/65 hover:bg-paper/40 hover:text-ink transition-all border border-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Ir para o site</span>
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 border-b border-line px-8 flex items-center justify-between shrink-0 bg-paper sticky top-0 z-50">
          <div className="text-[12px] text-dim font-medium uppercase tracking-wider">Painel de Controle • Glass Maind</div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] tracking-[0.14em] uppercase text-dim bg-soft border border-line px-3 py-1 rounded-full font-medium">
              {session.staff?.role === "owner" ? "Proprietário" : "Equipe Fluxa"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-10 bg-paper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
