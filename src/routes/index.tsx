import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Star, Instagram, Facebook, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import workBranding from "@/assets/work-branding.jpg";
import workEditorial from "@/assets/work-editorial.jpg";
import workPackaging from "@/assets/work-packaging.jpg";
import workCampaign from "@/assets/work-campaign.jpg";
import { useParallax, useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { CONTACT, whatsappLink, mailtoLink } from "@/lib/contact";
import { ProposalModal } from "@/components/ProposalModal";


export const Route = createFileRoute("/")({
  component: Index,
});


/* =================== NAV =================== */
function Nav({ onOpenProposal }: { onOpenProposal: () => void }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        // Ignore tiny jitters
        if (Math.abs(delta) > 6) {
          if (delta > 0 && y > 80) {
            setHidden(true); // scrolling down
          } else if (delta < 0) {
            setHidden(false); // scrolling up
          }
          lastY.current = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[999] bg-soft border-b border-line will-change-transform"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.35s ease",
      }}
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-10 h-20 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center leading-none">
          <span className="text-[17px] tracking-tight text-ink">
            <span className="font-light">Agencia</span>
            <span className="mx-2 text-ink/30 font-light">|</span>
            <span className="font-semibold">Glass Maind</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9 text-[14px] text-ink/60">
          <a href="#top" className="text-ink">Início</a>
          <a href="#about" className="hover:text-ink transition-colors">Sobre</a>
          <a href="#services" className="hover:text-ink transition-colors">Serviços</a>
          <a href="#contact" className="hover:text-ink transition-colors">Contato</a>
        </nav>

        {/* Right side — search + micro-info */}
        <div className="hidden md:flex items-center gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink/40 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar"
              aria-label="Buscar"
              className="h-9 w-[180px] rounded-full bg-paper border border-line pl-9 pr-3 text-[13px] text-ink placeholder:text-ink/40 outline-none focus:border-ink/40 transition-colors"
            />
          </div>
          <span className="text-[11px] tracking-[0.18em] uppercase text-ink/55">Digital Studio</span>
        </div>

        <button
          type="button"
          onClick={onOpenProposal}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper"
          aria-label="Solicitar proposta"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

/* =================== HERO =================== */
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.35 11.1h-9.17v2.96h5.27c-.23 1.4-1.66 4.11-5.27 4.11a5.78 5.78 0 1 1 0-11.56c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.82 4.13 14.74 3.2 12.18 3.2 6.95 3.2 2.74 7.41 2.74 12.6s4.21 9.4 9.44 9.4c5.45 0 9.06-3.83 9.06-9.22 0-.62-.07-1.1-.16-1.68z"/>
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.05 4.91A10 10 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.9 9.9 0 0 0 4.72 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.23 8.23 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23Zm4.51-6.16c-.25-.13-1.46-.72-1.69-.8-.23-.08-.39-.13-.56.13-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.13-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.13.16 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z"/>
    </svg>
  );
}

const SOCIALS = [
  { name: "Instagram", href: CONTACT.instagram.url, Icon: Instagram },
  { name: "WhatsApp", href: whatsappLink("Olá! Vim pelo site da Glass Maind."), Icon: WhatsAppIcon },
  { name: "Facebook", href: CONTACT.facebook.url, Icon: Facebook },
  { name: "Google", href: CONTACT.google.url, Icon: GoogleIcon },
];


function Hero({ onOpenProposal }: { onOpenProposal: () => void }) {
  return (
    <section id="top" className="relative bg-soft overflow-hidden">

      <div
        data-parallax="0.08"
        className="pointer-events-none absolute inset-0 opacity-[0.5] z-[1]"
        aria-hidden
      >
        <div className="absolute top-0 bottom-0 left-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
        <div className="absolute top-0 bottom-0 left-[58%] w-px bg-gradient-to-b from-transparent via-ink/8 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
      </div>

      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="-50" y1="780" x2="1500" y2="120"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ink/15 dash-flow"
        />
      </svg>

      <div className="mx-auto max-w-[1480px] px-6 md:px-10 pt-18 md:pt-22 pb-12 md:pb-16 grid grid-cols-12 gap-8 md:gap-12 items-center min-h-[calc(100svh-5rem)] md:min-h-[calc(100vh-5rem)] relative z-10">
        {/* LEFT — text */}
        <div className="col-span-12 lg:col-span-7 relative z-10 flex flex-col items-start justify-center self-center">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-dim reveal reveal-d1">
            <span className="text-dim/70">05</span>
            <span className="h-px w-6 bg-ink/30" />
            Marketing Estratégico
          </div>

          <h1
            className="mt-6 font-medium text-ink max-w-[11ch] reveal reveal-d2"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 7rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block reveal reveal-d2">NOVA</span>
            <span className="block reveal reveal-d3">EXPERIÊNCIA</span>
            <span className="block reveal reveal-d4">DIGITAL</span>
          </h1>

          <p className="mt-8 max-w-[480px] text-[15px] leading-relaxed text-dim reveal reveal-d4">
            Criamos presença, posicionamento e percepção para marcas que querem
            crescer com autoridade.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5 reveal reveal-d5">
            <a
              href={whatsappLink("Olá! Quero entrar em contato com a Glass Maind.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-shine inline-flex items-center gap-3 bg-ink text-paper rounded-full pl-6 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
            >
              <span className="text-[13px] font-medium">Entrar em contato</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <button
              type="button"
              onClick={onOpenProposal}
              className="text-[13px] text-ink/80 hover:text-ink underline-offset-4 hover:underline transition-colors"
            >
              Solicitar proposta
            </button>
          </div>

          <div className="mt-14 flex items-center gap-8 md:gap-10 reveal reveal-d5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-dim mb-2.5">
                Clientes atendidos
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-soft bg-gradient-to-br from-ink/80 to-ink"
                    />
                  ))}
                </div>
                <span className="text-2xl font-medium text-ink tracking-tight">20+</span>
              </div>
            </div>
            <div className="h-12 w-px bg-line" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-dim mb-2.5">
                Resultados
              </div>
              <div className="text-2xl font-medium text-ink tracking-tight">47.2%</div>
            </div>
          </div>
        </div>

        {/* RIGHT — social icons rail (showcase lives behind, full-bleed) */}
        <div className="col-span-12 lg:col-span-5 relative reveal reveal-d3 min-h-[520px] lg:min-h-[620px]">
          {/* Social icons — vertical, with single subtle vertical line behind */}
          <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-7 md:gap-8">
            {SOCIALS.map((s) => {
              const Icon = s.Icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="social-tech group relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-soft text-ink/70 transition-all duration-500 hover:text-ink hover:scale-110"
                >
                  <Icon className="relative z-10 h-[18px] w-[18px] transition-transform duration-500" />

                  {/* Drawing circle outline */}
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 36 36"
                    aria-hidden
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.6"
                      className="text-ink/60 social-ring"
                    />
                  </svg>

                  {/* Social name on hover */}
                  <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] tracking-[0.08em] text-ink/70 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    {s.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Straight divider into the next dark section */}
      <div aria-hidden className="h-px w-full bg-ink/25" />
    </section>
  );
}


/* =================== INFO STRIP =================== */
function InfoStrip() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 shrink-0">
            <span className="block h-3 w-3 border border-paper/80 rotate-45" />
          </div>
          <p className="text-sm text-paper/80 max-w-md">
            Em um cenário futurista, marcas exploram ambientes visuais
            hiper-realistas conectados a sistemas inteligentes.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-paper/70">
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <span className="text-[12px] tracking-wide ml-2">3.000+ clientes</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-paper/40 hidden md:inline">
            · Role para baixo
          </span>
        </div>
      </div>
    </section>
  );
}

/* =================== ABOUT =================== */
function StatCard({
  end,
  suffix = "",
  label,
  desc,
  delay,
}: {
  end: number;
  suffix?: string;
  label: string;
  desc: string;
  delay: number;
}) {
  const [ref, value] = useCountUp(end, { duration: 1800 });
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ backgroundColor: "oklch(0.13 0 0)" }}
      className={`py-14 md:py-20 px-8 md:px-10 rounded-[2px] sr lift text-paper sr-d${delay}`}
    >
      <div className="font-medium text-[clamp(3.5rem,7vw,6rem)] leading-none tracking-[-0.05em] tabular-nums">
        {value}
        {suffix}
      </div>
      <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-paper/70">
        <span className="h-px w-6 bg-paper/60" />
        {label}
      </div>
      <p className="mt-3 text-sm max-w-xs text-paper/60">{desc}</p>
    </div>
  );
}

function About() {
  const pillars = [
    {
      t: "Estratégia visual",
      d: "Cada projeto começa com diagnóstico de marca e plano de posicionamento — não com decoração.",
    },
    {
      t: "Direção criativa unificada",
      d: "Branding, conteúdo e mídia conduzidos pelo mesmo eixo estético. Coerência total em todos os pontos de contato.",
    },
    {
      t: "Execução premium",
      d: "Acabamento editorial em cada peça entregue. Tipografia, espaço e cor tratados como ativos de marca.",
    },
    {
      t: "Performance com narrativa",
      d: "Conversão sustentada por uma história — não por gatilhos avulsos. Resultados que se acumulam.",
    },
  ];

  return (
    <section id="about" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.35em] text-dim inline-flex items-center gap-3 sr">
            <span className="h-px w-10 bg-ink/40" />
            Sobre nós
            <span className="h-px w-10 bg-ink/40" />
          </div>
          <h2 className="mt-10 font-medium text-ink leading-[1] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] text-balance sr sr-d1">
            Construindo presença de marca para a próxima geração de empresas.
          </h2>
          <p className="mt-8 text-base text-dim leading-relaxed max-w-2xl mx-auto sr sr-d2">
            A Glass Maind une design estratégico, comunicação visual e marketing
            para transformar empresas comuns em marcas com presença, consistência
            e desejo.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard end={20} suffix="+" label="Marcas atendidas" desc="Clientes ativos no Brasil e exterior" delay={1} />
          <StatCard end={47} suffix="%" label="Crescimento médio" desc="Aumento de presença em 90 dias" delay={2} />
          <StatCard end={3} suffix="" label="Pilares de atuação" desc="Design · Marketing · Gestão" delay={3} />
        </div>

        {/* Institutional content — diferenciais */}
        <div className="mt-28 md:mt-36 grid grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="col-span-12 md:col-span-5 sr">
            <div className="text-[11px] uppercase tracking-[0.3em] text-dim flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Como pensamos
            </div>
            <h3 className="mt-6 font-medium text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-ink">
              Marca não é estética.<br />
              É decisão estratégica.
            </h3>
            <p className="mt-6 text-[15px] leading-relaxed text-dim max-w-md">
              Acreditamos que percepção é precificação. Toda decisão visual
              influencia diretamente quanto sua marca pode cobrar e o tipo de
              cliente que ela atrai. Por isso operamos no cruzamento de design,
              negócio e tecnologia.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
            {pillars.map((p, i) => (
              <div
                key={p.t}
                className={`bg-paper p-8 sr sr-d${Math.min(i + 1, 5)}`}
              >
                <div className="text-[11px] uppercase tracking-[0.25em] text-dim">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="mt-3 font-medium text-[1.1rem] tracking-[-0.015em] text-ink">
                  {p.t}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Authority strip */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line sr">
          {[
            { k: "Fundada em", v: "Fortaleza · Brasil" },
            { k: "Atuação", v: "Brasil · LATAM · Europa" },
            { k: "Foco", v: "Marcas premium e em escala" },
          ].map((it) => (
            <div key={it.k} className="bg-paper px-8 py-7">
              <div className="text-[10px] uppercase tracking-[0.3em] text-dim">
                {it.k}
              </div>
              <div className="mt-2 text-[15px] font-medium text-ink">
                {it.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* =================== DARK / TECHNOLOGY =================== */
type CarouselDirection = -1 | 1;
type InfoPhase = "idle" | "out" | "in";

const CARD_CAROUSEL_MS = 1400;
const INFO_FADE_OUT_DELAY_MS = 400;
const INFO_SWAP_DELAY_MS = 680;

const wrapTechIndex = (index: number, total: number) => (index + total) % total;

const TECH_VIEWS = [
  {
    n: "01",
    label: "Branding",
    subtitle: "Identidade visual estratégica",
    title: "Identidade que se vê e se sente.",
    desc: "Sistemas visuais coerentes, do logotipo ao território de marca, construídos para durar e escalar.",
    highlight: "Sistema modular · 12 ativos",
    tech: "ENGINE V4.1 · 12 MÓDULOS",
    infos: ["Positioning", "Identity", "Authority"],
  },
  {
    n: "02",
    label: "Marketing",
    subtitle: "Performance com narrativa",
    title: "Performance com narrativa.",
    desc: "Campanhas pensadas para converter sem perder identidade. Estratégia, criativo e mídia integrados.",
    highlight: "ROI médio · 3.4x",
    tech: "PROTOCOL V2.3 · ROI 3.4x",
    infos: ["Strategy", "Funnel", "Conversion"],
  },
  {
    n: "03",
    label: "Design",
    subtitle: "Direção de arte premium",
    title: "Forma a serviço da marca.",
    desc: "Direção de arte premium para campanhas, materiais e produtos — do conceito ao acabamento.",
    highlight: "Direção · Editorial",
    tech: "GRID ALIGNED · 128 NODES",
    infos: ["Composition", "Typography", "Color"],
  },
  {
    n: "04",
    label: "Conteúdo",
    subtitle: "Narrativa editorial multiformato",
    title: "Narrativa que sustenta a marca.",
    desc: "Roteiros, copy e direção editorial para campanhas, social e materiais institucionais.",
    highlight: "Editorial · Multiformato",
    tech: "STREAM V1.8 · CHANNEL 04",
    infos: ["Voice", "Story", "Engagement"],
  },
  {
    n: "05",
    label: "Estratégia",
    subtitle: "Decisões guiadas por dados",
    title: "Decisões guiadas por dados.",
    desc: "Diagnóstico, posicionamento e roadmap de marca baseados em pesquisa e métricas reais.",
    highlight: "Insights · Roadmap",
    tech: "ENGINE V4.1 · 24 NODES",
    infos: ["Research", "Insight", "Roadmap"],
  },
] as const;

function Technology({ onOpenProposal }: { onOpenProposal: () => void }) {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [direction, setDirection] = useState<CarouselDirection>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [infoIndex, setInfoIndex] = useState(0);
  const [infoPhase, setInfoPhase] = useState<InfoPhase>("idle");
  const timersRef = useRef<number[]>([]);
  const total = TECH_VIEWS.length;
  const view = TECH_VIEWS[active];
  const dynamicView = TECH_VIEWS[infoIndex];
  const previewIdx = wrapTechIndex(active + 1, total);
  const visibleSecondary = TECH_VIEWS[incoming ?? previewIdx];
  // Card que será o próximo preview após a transição terminar
  // (já renderizado em background para evitar slot vazio)
  const upcomingPreviewIdx =
    incoming !== null ? wrapTechIndex(incoming + direction, total) : previewIdx;
  const upcomingPreviewView = TECH_VIEWS[upcomingPreviewIdx];
  const infoMotionClass =
    infoPhase === "out"
      ? "tech-copy-out"
      : infoPhase === "in"
        ? "tech-copy-in"
        : "tech-copy-idle";

  const clearTimers = () => {
    if (typeof window === "undefined") return;
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const startTransition = (targetIndex: number, nextDirection: CarouselDirection) => {
    if (isAnimating || targetIndex === active || typeof window === "undefined") return;

    clearTimers();
    setIncoming(targetIndex);
    setDirection(nextDirection);
    setIsAnimating(true);
    setInfoPhase("idle");

    timersRef.current.push(
      window.setTimeout(() => {
        setInfoPhase("out");
      }, INFO_FADE_OUT_DELAY_MS),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setInfoIndex(targetIndex);
        setInfoPhase("in");
      }, INFO_SWAP_DELAY_MS),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setActive(targetIndex);
        setIncoming(null);
        setIsAnimating(false);
        setInfoPhase("idle");
      }, CARD_CAROUSEL_MS),
    );
  };

  const goPrev = () => startTransition(wrapTechIndex(active - 1, total), -1);
  const goNext = () => startTransition(wrapTechIndex(active + 1, total), 1);

  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      <div className="ambient-glow" aria-hidden />

      <div className="mx-auto max-w-[1480px] px-6 md:px-10 py-24 md:py-36 relative">
        <div className="flex justify-center sr">
          <span className="inline-flex items-center gap-2 bg-paper text-ink rounded-full px-5 py-2 text-[12px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            Inteligência de Marca
          </span>
        </div>

        <h2 className="mt-10 text-center font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.25rem,5.5vw,5.25rem)] sr sr-d1 max-w-4xl mx-auto">
          Tecnologia em Cada Camada
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-center text-paper/60 text-[15px] leading-relaxed sr sr-d2">
          Cinco núcleos. Um único ecossistema de marca. Estratégia, design e
          performance girando em torno do mesmo eixo criativo.
        </p>

        {/* LEFT: cards · RIGHT: technical info */}
        <div className="mt-20 md:mt-24 grid grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT — Cards */}
          <div className="col-span-12 lg:col-span-7 sr sr-d3">
            <div
              className="relative flex items-center justify-center min-h-[390px] md:min-h-[500px]"
              style={{ perspective: "1400px" }}
            >
              <button
                type="button"
                onClick={goPrev}
                aria-label="Card anterior"
                disabled={isAnimating}
                className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 hover:bg-paper/20 border border-paper/15 backdrop-blur-md text-paper transition-all duration-300 hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                className="tech-card-clip relative mx-auto h-[390px] w-[360px] sm:w-[420px] md:h-[500px] md:w-[480px]"
              >
                {isAnimating && direction === 1 && (
                  <TechCard
                    view={upcomingPreviewView}
                    variant="preview"
                    motionClass="tech-card-motion-upcoming"
                  />
                )}

                <TechCard
                  view={visibleSecondary}
                  variant="preview"
                  motionClass={
                    isAnimating
                      ? direction === 1
                        ? "tech-card-motion-enter-next"
                        : "tech-card-motion-enter-prev"
                      : "tech-card-motion-preview"
                  }
                  onClick={!isAnimating ? goNext : undefined}
                />

                <TechCard
                  view={view}
                  variant="active"
                  motionClass={
                    isAnimating
                      ? direction === 1
                        ? "tech-card-motion-exit-next"
                        : "tech-card-motion-exit-prev"
                      : "tech-card-motion-active"
                  }
                />
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Próximo card"
                disabled={isAnimating}
                className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 hover:bg-paper/20 border border-paper/15 backdrop-blur-md text-paper transition-all duration-300 hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 flex justify-center gap-2">
              {TECH_VIEWS.map((v, i) => {
                const isActive = active === i;
                return (
                  <span
                    key={v.n}
                    aria-hidden
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive ? "w-8 bg-paper" : "w-1.5 bg-paper/30 hover:bg-paper/60"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 sr sr-d4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 flex items-center gap-3">
                <span className="h-px w-8 bg-paper/40" />
                <span className={infoMotionClass}>{dynamicView.n} · {dynamicView.label}</span>
              </div>

              <h3 className="mt-6 font-medium text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.03em] text-paper">
                <span className={infoMotionClass}>{dynamicView.title}</span>
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-paper/60 max-w-md">
                <span className={infoMotionClass}>{dynamicView.desc}</span>
              </p>
              <div className="mt-8 inline-flex items-center gap-3 bg-paper/5 border border-paper/10 rounded-full px-4 py-2 text-[12px] text-paper/80">
                <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                <span className={infoMotionClass}>{dynamicView.highlight}</span>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-paper/40">
                <span className="h-px w-6 bg-paper/30" />
                <span className={infoMotionClass}>{dynamicView.tech}</span>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={onOpenProposal}
                  className="group btn-shine inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-6 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
                >
                  <span className="text-[13px] font-medium">Solicitar proposta</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Single tech card — active or preview variant */
function TechCard({
  view,
  variant,
  motionClass,
  onClick,
}: {
  view: (typeof TECH_VIEWS)[number];
  variant: "active" | "preview";
  motionClass: string;
  onClick?: () => void;
}) {
  const isActive = variant === "active";
  return (
    <div
      onClick={onClick}
      className={[
        "tech-card-shell absolute left-1/2 top-1/2 w-[260px] sm:w-[300px] md:w-[360px] aspect-[3/4] rounded-2xl overflow-hidden",
        motionClass,
        isActive ? "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]" : "cursor-pointer",
      ].join(" ")}
      style={{
        background:
          "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.06), transparent 42%), linear-gradient(135deg, #0a0a0a 0%, #050505 55%, #000000 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: isActive
          ? "0 36px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Specular sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.10) 50%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Inner halo when active */}
      {isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.18), transparent 70%)",
          }}
        />
      )}

      <div className="relative h-full w-full p-7 md:p-9 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-paper/55">
              {view.n}
            </span>
            <span
              aria-hidden
              className="mt-1 font-medium text-paper/10 leading-none tracking-[-0.05em] select-none"
              style={{ fontSize: "clamp(2.5rem,5vw,3.75rem)" }}
            >
              {view.n}
            </span>
          </div>
          <span className="block h-2 w-2 rotate-45 bg-paper/70" />
        </div>
        <div>
          <div
            className="font-medium tracking-[-0.04em] text-paper"
            style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 0.95 }}
          >
            {view.label}
          </div>
          <p className={`mt-3 text-[12px] leading-relaxed max-w-[22ch] ${isActive ? "text-paper/55" : "text-paper/38"}`}>
            {view.subtitle}
          </p>
          <div className="mt-5 h-px w-12 bg-paper/40" />
          <div className="mt-3 text-[10px] tracking-[0.25em] uppercase text-paper/45">
            {view.tech}
          </div>
        </div>
      </div>
    </div>
  );
}


/* =================== SERVICES =================== */
function Services() {
  const services = [
    { n: "01", t: "Identidade Visual", d: "Sistemas completos: logo, tipografia, paleta e diretrizes." },
    { n: "02", t: "Social Media Design", d: "Conteúdo recorrente com direção de arte coerente." },
    { n: "03", t: "Marketing Digital", d: "Estratégia, performance e conteúdo para conversão real." },
    { n: "04", t: "Gestão de Marca", d: "Acompanhamento mensal de presença e narrativa visual." },
    { n: "05", t: "Materiais Gráficos", d: "Impressos, apresentações e papelaria com acabamento premium." },
    { n: "06", t: "Direção Criativa", d: "Curadoria visual e estratégica para campanhas e lançamentos." },
  ];

  return (
    <section id="services" className="bg-paper py-28 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-6 sr">
            <div className="text-[11px] uppercase tracking-[0.3em] text-dim flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Serviços
            </div>
            <h3 className="mt-6 font-medium text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-ink">
              Seis disciplinas.<br />
              Um único ecossistema.
            </h3>
          </div>
          <p className="col-span-12 md:col-span-5 md:col-start-8 text-base text-dim self-end max-w-md sr sr-d2">
            Cada serviço opera como módulo dentro de uma engrenagem visual única
            — coerência total entre estratégia, design e execução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {services.map((s, i) => {
            const isDark = i % 2 === 1;
            return (
              <article
                key={s.n}
                className={[
                  "group relative p-10 md:p-12 min-h-[290px] flex flex-col justify-between transition-all duration-500 lift sr",
                  `sr-d${Math.min((i % 3) + 1, 5)}`,
                  isDark ? "bg-ink text-paper" : "bg-paper text-ink",
                  "hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[11px] uppercase tracking-[0.3em] ${isDark ? "text-paper/60" : "text-dim"}`}>
                    {s.n}
                  </span>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 ${isDark ? "border-paper/30 group-hover:border-paper/60" : "border-line group-hover:border-ink/40"}`}>
                    <Plus className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90" />
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-2xl md:text-[1.75rem] tracking-[-0.02em] leading-tight">
                    {s.t}
                  </h4>
                  <p className={`mt-3 text-sm leading-relaxed max-w-xs ${isDark ? "text-paper/70" : "text-dim"}`}>
                    {s.d}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* =================== PORTFOLIO =================== */
function Portfolio() {
  const works = [
    { src: workBranding, n: "01 / Branding", t: "Studio Noir — Identidade", span: "md:col-span-7", aspect: "aspect-[5/4]" },
    { src: workEditorial, n: "02 / Editorial", t: "Maison — Brand Book", span: "md:col-span-5", aspect: "aspect-[4/5]" },
    { src: workPackaging, n: "03 / Packaging", t: "Lumière — Linha Premium", span: "md:col-span-5", aspect: "aspect-[4/5]" },
    { src: workCampaign, n: "04 / Campanha", t: "Aurora — Marketing Digital", span: "md:col-span-7", aspect: "aspect-[5/4]" },
  ];

  return (
    <section id="portfolio" className="bg-soft py-28 md:py-40">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-dim flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Trabalhos Selecionados
            </div>
            <h2 className="mt-6 font-medium text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] tracking-[-0.03em] text-ink">
              Trabalhos que vendem.
            </h2>
          </div>
          <a href="#contact" className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-ink border-b border-ink pb-1 self-start">
            Todos os projetos
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {works.map((w, i) => (
            <figure key={w.n} className={`col-span-12 ${w.span} group sr ${i > 0 ? `sr-d${Math.min(i + 1, 5)}` : ""}`}>
              <div className={`overflow-hidden rounded-[2px] bg-card ${w.aspect} light-sweep`}>
                <img
                  src={w.src}
                  alt={w.t}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-dim">{w.n}</div>
                  <div className="mt-1 text-xl text-ink font-medium">{w.t}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== CTA =================== */
function CTA({ onOpenProposal }: { onOpenProposal: () => void }) {
  return (
    <section id="contact" className="bg-ink text-paper relative overflow-hidden">
      <div className="ambient-glow" aria-hidden />
      <span className="light-dot" style={{ top: "30%", left: "15%" }} aria-hidden />
      <span className="light-dot" style={{ top: "70%", right: "18%", animationDelay: "4s" }} aria-hidden />

      <div className="mx-auto max-w-[1480px] px-6 md:px-10 py-32 md:py-44 text-center relative">
        <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 inline-flex items-center gap-3 sr">
          <span className="h-px w-8 bg-paper/40" />
          Vamos conversar
          <span className="h-px w-8 bg-paper/40" />
        </div>
        <h2 className="mt-12 font-medium leading-[0.95] tracking-[-0.04em] text-[clamp(2.25rem,6.5vw,6rem)] max-w-5xl mx-auto text-balance sr sr-d1">
          Sua marca merece crescer, mas primeiro ela precisa parecer que merece.
        </h2>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sr sr-d2">
          <button
            type="button"
            onClick={onOpenProposal}
            className="group btn-shine inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-7 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
          >
            <span className="text-[13px] font-medium">Solicitar proposta</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
          <a
            href={whatsappLink("Olá! Quero conversar com a Glass Maind.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-paper/80 hover:text-paper underline-offset-4 hover:underline transition-colors"
          >
            Falar no WhatsApp →
          </a>
        </div>

        {/* Contact grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/10 border border-paper/10 sr sr-d3 max-w-4xl mx-auto text-left">
          <a
            href={whatsappLink("Olá!")}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-ink p-6 hover:bg-paper/5 transition-colors"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">WhatsApp</div>
            <div className="mt-2 text-paper text-[15px] font-medium">{CONTACT.phoneDisplay}</div>
            <div className="mt-1 text-[12px] text-paper/50 group-hover:text-paper/70 transition-colors">Resposta rápida →</div>
          </a>
          <a
            href={mailtoLink("Contato pelo site Glass Maind")}
            className="group bg-ink p-6 hover:bg-paper/5 transition-colors"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">E-mail</div>
            <div className="mt-2 text-paper text-[15px] font-medium break-all">{CONTACT.email}</div>
            <div className="mt-1 text-[12px] text-paper/50 group-hover:text-paper/70 transition-colors">Enviar mensagem →</div>
          </a>
          <a
            href="https://maps.google.com/?q=Av.+Des.+Moreira,+1300+-+Aldeota,+Fortaleza+-+CE"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-ink p-6 hover:bg-paper/5 transition-colors"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">Endereço</div>
            <div className="mt-2 text-paper text-[14px] font-medium leading-snug">{CONTACT.address}</div>
            <div className="mt-1 text-[12px] text-paper/50 group-hover:text-paper/70 transition-colors">Ver no mapa →</div>
          </a>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.25em] text-paper/40 sr sr-d3">
          Resposta em até 24 horas úteis
        </p>
      </div>
    </section>
  );
}


/* =================== FOOTER =================== */
function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-paper text-ink">
                <span className="block h-3.5 w-3.5 border border-ink/90 rotate-45" />
              </span>
              <span className="text-[15px] font-medium">Glass Maind</span>
            </div>
            <p className="mt-6 text-sm text-paper/60 max-w-sm">
              Marketing, Design e Gestão Visual. Fortaleza / Brasil.
            </p>
            <p className="mt-3 text-sm text-paper/50 max-w-sm">{CONTACT.address}</p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Contato</div>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li>
                <a
                  href={whatsappLink("Olá!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={mailtoLink()} className="hover:text-paper">
                  E-mail
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Navegar</div>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li><a href="#about" className="hover:text-paper">Sobre</a></li>
              <li><a href="#services" className="hover:text-paper">Serviços</a></li>
              <li><a href="#portfolio" className="hover:text-paper">Trabalhos</a></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Estúdio</div>
            <p className="text-sm text-paper/80">Fortaleza / CE</p>
            <p className="mt-1 text-sm text-paper/60">Seg — Sex · 09 → 18</p>
            <p className="mt-3 text-sm text-paper/80">{CONTACT.phoneDisplay}</p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-paper/40">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Agência Glass Maind</span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}

/* =================== PAGE =================== */
function Index() {
  useScrollReveal();
  useParallax();
  const [proposalOpen, setProposalOpen] = useState(false);

  return (
    <main className="bg-paper text-ink min-h-screen pt-20">
      <Nav onOpenProposal={() => setProposalOpen(true)} />
      <Hero onOpenProposal={() => setProposalOpen(true)} />
      <Technology onOpenProposal={() => setProposalOpen(true)} />
      <InfoStrip />
      <About />
      <Services />
      <Portfolio />
      <CTA onOpenProposal={() => setProposalOpen(true)} />
      <Footer />
      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
    </main>
  );
}
