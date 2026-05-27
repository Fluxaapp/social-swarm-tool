import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Plane,
  Camera,
  Award,
  Share2,
  ShieldCheck,
  Sparkles,
  Clapperboard,
  MapPin,
  Building2,
  Home as HomeIcon,
  CalendarDays,
  Megaphone,
  Film,
  Image as ImageIcon,
  Video,
  ChevronLeft,
} from "lucide-react";

import aerialHero from "@/assets/aerial-hero.jpg";
import aerial1 from "@/assets/aerial-portfolio-1.jpg";
import aerial2 from "@/assets/aerial-portfolio-2.jpg";
import aerial3 from "@/assets/aerial-portfolio-3.jpg";
import aerial4 from "@/assets/aerial-portfolio-4.jpg";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { whatsappLink } from "@/lib/contact";
import { ProposalModal } from "@/components/ProposalModal";

export const Route = createFileRoute("/captacao-aerea")({
  head: () => ({
    meta: [
      { title: "Captação Aérea Cinematográfica — Glass Maind" },
      {
        name: "description",
        content:
          "Filmagens e fotografias aéreas cinematográficas para empresas, empreendimentos e eventos. Produção audiovisual premium com drones profissionais.",
      },
      {
        property: "og:title",
        content: "Captação Aérea Cinematográfica — Glass Maind",
      },
      {
        property: "og:description",
        content:
          "Imagens aéreas cinematográficas que transformam apresentações comuns em experiências visuais de alto impacto.",
      },
    ],
  }),
  component: CaptacaoAereaPage,
});

const WhatsAppMessage =
  "Olá! Tenho interesse no serviço de Captação Aérea Cinematográfica da Glass Maind.";

function Benefit({
  Icon,
  title,
  desc,
  delay,
}: {
  Icon: typeof Plane;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06] sr sr-d${delay}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
      />
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-paper">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="relative mt-6 text-lg font-medium tracking-[-0.01em] text-paper">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-paper/60">{desc}</p>
    </div>
  );
}

function CaptacaoAereaPage() {
  useScrollReveal();
  const [proposalOpen, setProposalOpen] = useState(false);

  const benefits = [
    {
      Icon: Plane,
      title: "Visão Aérea Exclusiva",
      desc: "Mostre seu negócio por ângulos impossíveis de serem capturados do solo.",
    },
    {
      Icon: Clapperboard,
      title: "Produção Cinematográfica",
      desc: "Movimentos suaves, enquadramentos profissionais e acabamento premium.",
    },
    {
      Icon: Award,
      title: "Mais Autoridade",
      desc: "Empresas que utilizam imagens aéreas transmitem mais profissionalismo e valor.",
    },
    {
      Icon: Share2,
      title: "Conteúdo para Redes Sociais",
      desc: "Material ideal para Instagram, Facebook, YouTube, sites e campanhas.",
    },
  ];

  const services = [
    { Icon: Film, t: "Filmagem aérea institucional" },
    { Icon: Camera, t: "Fotografias aéreas profissionais" },
    { Icon: Building2, t: "Captação para empreendimentos" },
    { Icon: HomeIcon, t: "Conteúdo para imobiliárias" },
    { Icon: CalendarDays, t: "Cobertura de eventos" },
    { Icon: Share2, t: "Conteúdo para redes sociais" },
    { Icon: Megaphone, t: "Produção para campanhas" },
    { Icon: Video, t: "Vídeos promocionais" },
  ];

  const differentials = [
    "Equipamentos profissionais",
    "Captação em alta resolução",
    "Planejamento de voo",
    "Segurança operacional",
    "Entrega otimizada para marketing",
    "Edição profissional",
    "Correção de cor cinematográfica",
  ];

  const portfolio = [
    { src: aerial1, t: "Drone profissional · Empresarial", k: "Institucional" },
    { src: aerial2, t: "Litoral · Captação cinematográfica", k: "Paisagem" },
    { src: aerial3, t: "Cobertura de evento ao vivo", k: "Evento" },
    { src: aerial4, t: "Empreendimento residencial premium", k: "Imobiliário" },
  ];

  return (
    <main className="bg-ink text-paper min-h-screen overflow-x-hidden">
      {/* ===== TOP BAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 sm:px-6 md:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-paper/90 hover:text-paper transition">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[13px] tracking-tight">
              <span className="font-light">Agencia</span>
              <span className="mx-2 text-paper/30 font-light">|</span>
              <span className="font-semibold">Glass Maind</span>
            </span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-paper/50">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            Captação Aérea
          </span>
          <a
            href={whatsappLink(WhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-[12px] font-medium text-ink hover:scale-[1.02] transition"
          >
            Falar agora
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={aerialHero}
            alt="Captação aérea cinematográfica de cidade ao anoitecer"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-60"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.85) 75%, #000 100%), radial-gradient(60% 50% at 50% 40%, rgba(56,189,248,0.10), transparent 70%)",
            }}
          />
        </div>

        {/* HUD lines */}
        <svg
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-50"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line x1="0" y1="120" x2="1440" y2="120" stroke="currentColor" strokeWidth="0.6" className="text-paper/15 dash-flow" />
          <line x1="0" y1="780" x2="1440" y2="780" stroke="currentColor" strokeWidth="0.6" className="text-paper/15 dash-flow" />
          <line x1="120" y1="0" x2="120" y2="900" stroke="currentColor" strokeWidth="0.6" className="text-paper/10" />
          <line x1="1320" y1="0" x2="1320" y2="900" stroke="currentColor" strokeWidth="0.6" className="text-paper/10" />
        </svg>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1480px] flex-col justify-center px-5 sm:px-6 md:px-10 py-24 md:py-32">
          <div className="reveal reveal-d1 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/70">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.7)]" />
            Drone · Cinematic · 4K
            <span className="hidden md:inline h-px w-10 bg-paper/30" />
            <span className="hidden md:inline">REC · 24.000 fps capable</span>
          </div>

          <h1
            className="reveal reveal-d2 mt-7 max-w-[18ch] font-medium tracking-[-0.045em] text-paper"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 6rem)", lineHeight: 0.98 }}
          >
            Agora sua marca pode ser vista de outro nível.
          </h1>

          <p className="reveal reveal-d3 mt-7 max-w-2xl text-[15px] sm:text-base leading-relaxed text-paper/70">
            Produções aéreas cinematográficas para empresas, empreendimentos,
            eventos e projetos que desejam transmitir autoridade, modernidade e
            impacto visual.
          </p>

          <div className="reveal reveal-d4 mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setProposalOpen(true)}
              className="group btn-shine inline-flex items-center gap-3 rounded-full bg-paper pl-6 pr-2 py-2 text-ink transition-transform duration-500 hover:scale-[1.02]"
            >
              <span className="text-[13px] font-medium">Solicitar Orçamento</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
            <a
              href={whatsappLink(WhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-white/5 px-5 py-2.5 text-[13px] text-paper/90 backdrop-blur-md transition hover:bg-white/10"
            >
              Falar no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* HUD telemetry */}
          <div className="reveal reveal-d5 mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "ALT", v: "120m" },
              { k: "RES", v: "4K · 60" },
              { k: "GPS", v: "LOCK" },
              { k: "MODE", v: "CINEMATIC" },
            ].map((t) => (
              <div
                key={t.k}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">{t.k}</div>
                <div className="mt-1 font-mono text-sm text-paper">{t.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="relative bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="max-w-3xl sr">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/50">
              <span className="h-px w-8 bg-paper/30" />
              Por que captação aérea
            </div>
            <h2 className="mt-6 font-medium leading-[1.05] tracking-[-0.035em] text-paper text-[clamp(2rem,4.5vw,3.75rem)]">
              Imagens que mudam como sua marca é percebida.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Benefit
                key={b.title}
                Icon={b.Icon}
                title={b.title}
                desc={b.desc}
                delay={Math.min(i + 1, 5)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative bg-[#04060a] py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 40% at 20% 20%, rgba(30,64,175,0.18), transparent 60%), radial-gradient(40% 30% at 80% 80%, rgba(56,189,248,0.10), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between sr">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/50">
                <span className="h-px w-8 bg-paper/30" />
                Serviços oferecidos
              </div>
              <h2 className="mt-6 font-medium leading-[1.05] tracking-[-0.035em] text-paper text-[clamp(2rem,4.5vw,3.75rem)]">
                Um único drone. Inúmeras possibilidades.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-paper/60">
              Captação adaptada à narrativa de cada projeto — institucional,
              imobiliário, eventos ou campanhas publicitárias.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => {
              const Icon = s.Icon;
              return (
                <div
                  key={s.t}
                  className={`group flex h-[180px] flex-col justify-between bg-[#04060a] p-6 transition-colors duration-500 hover:bg-white/[0.04] sr sr-d${Math.min((i % 4) + 1, 5)}`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-paper/90 transition group-hover:border-sky-400/40 group-hover:text-sky-300">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">
                      0{i + 1}
                    </div>
                    <div className="mt-1 text-[15px] font-medium leading-snug text-paper">
                      {s.t}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== DIFFERENTIALS ===== */}
      <section className="relative bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 sr">
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/50">
                <span className="h-px w-8 bg-paper/30" />
                Diferenciais
              </div>
              <h2 className="mt-6 font-medium leading-[1.05] tracking-[-0.035em] text-paper text-[clamp(2rem,4.2vw,3.5rem)]">
                Padrão de produtora. Entregue como agência.
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/60">
                Da decolagem ao master final, cada etapa é executada com
                planejamento técnico e direção criativa premium.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-paper/70">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-300" />
                Operação ANAC homologada
              </div>
            </div>

            <div className="lg:col-span-7 sr sr-d2">
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {differentials.map((d, i) => (
                  <li
                    key={d}
                    className="flex items-center gap-4 bg-ink px-6 py-5 text-[14px] text-paper/85"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[10px] tracking-widest text-paper/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-sky-300/80" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section className="relative bg-[#04060a] py-24 md:py-32">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between sr">
            <div>
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/50">
                <span className="h-px w-8 bg-paper/30" />
                Portfólio
              </div>
              <h2 className="mt-6 font-medium leading-[1.05] tracking-[-0.035em] text-paper text-[clamp(2rem,4.5vw,3.75rem)]">
                Histórias capturadas do alto.
              </h2>
            </div>
            <p className="max-w-sm text-[14px] text-paper/55">
              Galeria em preparação para vídeos, reels e fotos aéreas. Em breve
              integrações com YouTube e Vimeo.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-4 md:gap-6">
            {portfolio.map((p, i) => {
              const big = i === 0 || i === 3;
              return (
                <figure
                  key={p.t}
                  className={`group relative col-span-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sr sr-d${Math.min(i + 1, 5)} ${
                    big ? "md:col-span-7" : "md:col-span-5"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.src}
                      alt={p.t}
                      width={1280}
                      height={896}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-paper/60">
                          {p.k}
                        </div>
                        <div className="mt-1 text-[15px] font-medium text-paper">
                          {p.t}
                        </div>
                      </div>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-paper backdrop-blur-md transition group-hover:bg-paper group-hover:text-ink">
                        <ImageIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative overflow-hidden bg-ink py-28 md:py-40">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={aerialHero}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.6) 50%, #000 100%)",
            }}
          />
        </div>
        <div className="ambient-glow" aria-hidden />

        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 md:px-10 text-center">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/50 sr">
            <span className="h-px w-8 bg-paper/40" />
            <MapPin className="h-3 w-3" />
            Captação · Brasil
            <span className="h-px w-8 bg-paper/40" />
          </div>
          <h2 className="mt-10 font-medium leading-[0.98] tracking-[-0.04em] text-paper text-[clamp(2.25rem,6vw,5.25rem)] text-balance sr sr-d1">
            Algumas histórias não foram feitas para serem vistas do chão.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-paper/65 sr sr-d2">
            Eleve a apresentação da sua empresa com imagens aéreas
            cinematográficas produzidas para impressionar.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sr sr-d3">
            <button
              type="button"
              onClick={() => setProposalOpen(true)}
              className="group btn-shine inline-flex items-center gap-3 rounded-full bg-paper pl-7 pr-2 py-2 text-ink transition-transform duration-500 hover:scale-[1.02]"
            >
              <span className="text-[13px] font-medium">Solicitar Captação Aérea</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
            <a
              href={whatsappLink(WhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-paper/80 hover:text-paper underline-offset-4 hover:underline transition-colors"
            >
              Falar no WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER LINK ===== */}
      <footer className="border-t border-white/10 bg-ink">
        <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-4 px-5 sm:px-6 md:px-10 py-10 md:flex-row md:items-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-paper/40">
            © {new Date().getFullYear()} Glass Maind · Captação Aérea
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] text-paper/80 transition hover:text-paper"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao site principal
          </Link>
        </div>
      </footer>

      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
    </main>
  );
}
