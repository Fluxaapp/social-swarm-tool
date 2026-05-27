import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  ChevronLeft,
  Film,
  Camera,
  Building2,
  Home as HomeIcon,
  CalendarDays,
  Share2,
  Megaphone,
  Video,
} from "lucide-react";

import aerialHero from "@/assets/aerial-hero.jpg";
import aerial1 from "@/assets/aerial-portfolio-1.jpg";
import aerial2 from "@/assets/aerial-portfolio-2.jpg";
import aerial3 from "@/assets/aerial-portfolio-3.jpg";
import aerial4 from "@/assets/aerial-portfolio-4.jpg";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ProposalModal } from "@/components/ProposalModal";

export const Route = createFileRoute("/captacao-aerea")({
  head: () => ({
    meta: [
      { title: "Captação Aérea Cinematográfica — Glass Maind" },
      {
        name: "description",
        content:
          "Filmagens e fotografias aéreas cinematográficas para empresas, empreendimentos, eventos e campanhas publicitárias.",
      },
      { property: "og:title", content: "Captação Aérea Cinematográfica — Glass Maind" },
      {
        property: "og:description",
        content:
          "Captação aérea premium com drones profissionais. Produção cinematográfica para marcas, empreendimentos e eventos.",
      },
    ],
  }),
  component: CaptacaoAereaPage,
});

function CaptacaoAereaPage() {
  useScrollReveal();
  const [proposalOpen, setProposalOpen] = useState(false);

  const services = [
    { n: "01", t: "Filmagem Institucional", d: "Vídeos aéreos cinematográficos para apresentação de empresas e marcas.", Icon: Film },
    { n: "02", t: "Fotografia Aérea", d: "Imagens em alta resolução com enquadramentos profissionais.", Icon: Camera },
    { n: "03", t: "Empreendimentos", d: "Captação para construtoras, incorporadoras e lançamentos imobiliários.", Icon: Building2 },
    { n: "04", t: "Imobiliárias", d: "Conteúdo de alto padrão para anúncios, sites e portfólios.", Icon: HomeIcon },
    { n: "05", t: "Eventos", d: "Cobertura aérea de eventos corporativos, shows e celebrações.", Icon: CalendarDays },
    { n: "06", t: "Conteúdo Social", d: "Material otimizado para Instagram, YouTube e campanhas digitais.", Icon: Share2 },
    { n: "07", t: "Publicidade", d: "Produção aérea para campanhas, comerciais e anúncios premium.", Icon: Megaphone },
    { n: "08", t: "Vídeos Promocionais", d: "Edição cinematográfica com correção de cor e trilha sonora.", Icon: Video },
  ];

  const differentials = [
    { k: "Equipamentos", v: "Drones profissionais com captação em 4K e 60fps." },
    { k: "Planejamento", v: "Estudo de voo, locação e roteiro visual antes da captação." },
    { k: "Operação", v: "Pilotos homologados, seguindo normas ANAC vigentes." },
    { k: "Pós-produção", v: "Edição cinematográfica com color grading premium." },
  ];

  const portfolio = [
    { src: aerial1, n: "01 / Institucional", t: "Empresarial · Identidade Aérea", span: "md:col-span-7", aspect: "aspect-[5/4]" },
    { src: aerial2, n: "02 / Paisagem", t: "Litoral · Captação Cinematográfica", span: "md:col-span-5", aspect: "aspect-[4/5]" },
    { src: aerial3, n: "03 / Evento", t: "Cobertura ao Vivo", span: "md:col-span-5", aspect: "aspect-[4/5]" },
    { src: aerial4, n: "04 / Imobiliário", t: "Empreendimento Residencial Premium", span: "md:col-span-7", aspect: "aspect-[5/4]" },
  ];

  return (
    <main className="bg-paper text-ink min-h-screen overflow-x-hidden pt-16 md:pt-20">
      {/* ===== NAV (mesmo padrão do site) ===== */}
      <header className="fixed top-0 left-0 right-0 z-[999] bg-soft border-b border-line">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-2 leading-none text-ink/80 hover:text-ink transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[17px] tracking-tight text-ink">
              <span className="font-light">Agencia</span>
              <span className="mx-2 text-ink/30 font-light">|</span>
              <span className="font-semibold">Glass Maind</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-[14px] text-ink/60">
            <Link to="/" className="hover:text-ink transition-colors">Início</Link>
            <Link to="/" hash="about" className="hover:text-ink transition-colors">Sobre</Link>
            <Link to="/" hash="services" className="hover:text-ink transition-colors">Serviços</Link>
            <span className="text-ink">Captação Aérea</span>
            <Link to="/" hash="contact" className="hover:text-ink transition-colors">Contato</Link>
          </nav>

          <button
            type="button"
            onClick={() => setProposalOpen(true)}
            className="hidden md:inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-medium text-paper hover:scale-[1.02] transition"
          >
            Solicitar proposta
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setProposalOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper"
            aria-label="Solicitar proposta"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 z-0">
          <img
            src={aerialHero}
            alt="Captação aérea cinematográfica"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-55"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.92) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-28 sm:py-36 md:py-44">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-9">
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-paper/60 sr">
                <span className="h-px w-8 bg-paper/40" />
                Captação Aérea Cinematográfica
              </div>
              <h1
                className="mt-7 max-w-[18ch] font-medium tracking-[-0.04em] text-paper sr sr-d1"
                style={{ fontSize: "clamp(2.25rem, 6vw, 5.5rem)", lineHeight: 1 }}
              >
                Imagens aéreas com padrão de produtora.
              </h1>
              <p className="mt-7 max-w-2xl text-[15px] sm:text-base leading-relaxed text-paper/70 sr sr-d2">
                Filmagens e fotografias aéreas cinematográficas para empresas,
                empreendimentos, eventos e campanhas publicitárias — com
                planejamento técnico e direção criativa premium.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 sr sr-d3">
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
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-2.5 text-[13px] text-paper/85 hover:bg-paper/5 transition"
                >
                  Voltar ao site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRO / ABOUT THE SERVICE ===== */}
      <section className="bg-paper py-20 sm:py-28 md:py-36">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-6 sr text-center md:text-left">
              <div className="mx-auto md:mx-0 text-[11px] uppercase tracking-[0.3em] text-dim inline-flex items-center gap-3 justify-center md:justify-start">
                <span className="h-px w-8 bg-ink/40" />
                Sobre o serviço
              </div>
              <h2 className="mt-6 font-medium text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-ink">
                Outro ângulo.<br />
                Outra percepção de marca.
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 md:col-start-8 text-base text-dim self-end max-w-md mx-auto md:mx-0 text-center md:text-left sr sr-d2">
              Captação aérea integrada ao ecossistema visual da Glass Maind —
              da direção criativa à pós-produção, tudo executado com o mesmo
              padrão dos demais serviços da agência.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID (mesmo padrão do site) ===== */}
      <section className="bg-paper pb-20 sm:pb-28 md:pb-36">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {services.map((s, i) => {
              const isDark = i % 2 === 1;
              const Icon = s.Icon;
              return (
                <article
                  key={s.n}
                  className={[
                    "group relative p-7 sm:p-9 md:p-10 min-h-[240px] flex flex-col justify-between transition-all duration-500 lift sr",
                    `sr-d${Math.min((i % 4) + 1, 5)}`,
                    isDark ? "bg-ink text-paper" : "bg-paper text-ink",
                    "hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[11px] uppercase tracking-[0.3em] ${isDark ? "text-paper/60" : "text-dim"}`}>
                      {s.n}
                    </span>
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 ${isDark ? "border-paper/30 group-hover:border-paper/60" : "border-line group-hover:border-ink/40"}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-xl md:text-[1.4rem] tracking-[-0.02em] leading-tight">
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

      {/* ===== DIFFERENTIALS ===== */}
      <section className="bg-soft py-20 sm:py-28 md:py-36">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-6 sr">
              <div className="text-[11px] uppercase tracking-[0.3em] text-dim inline-flex items-center gap-3">
                <span className="h-px w-8 bg-ink/40" />
                Diferenciais
              </div>
              <h2 className="mt-6 font-medium text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-ink">
                Padrão técnico.<br />
                Acabamento de produtora.
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 md:col-start-8 text-base text-dim self-end max-w-md sr sr-d2">
              Cada etapa — do briefing à entrega — é executada com o mesmo rigor
              que aplicamos em branding e direção criativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {differentials.map((d, i) => (
              <div
                key={d.k}
                className={`bg-paper p-8 sm:p-10 sr sr-d${Math.min(i + 1, 5)}`}
              >
                <div className="text-[11px] uppercase tracking-[0.3em] text-dim">
                  {String(i + 1).padStart(2, "0")} · {d.k}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                  {d.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section className="bg-paper py-20 sm:py-28 md:py-40">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
            <div className="mx-auto flex max-w-md flex-col items-center text-center md:mx-0 md:max-w-none md:items-start md:text-left">
              <div className="text-[11px] uppercase tracking-[0.3em] text-dim inline-flex items-center gap-3">
                <span className="h-px w-8 bg-ink/40" />
                Trabalhos Aéreos
              </div>
              <h2 className="mt-6 font-medium text-[clamp(2rem,5vw,4.25rem)] leading-[1.05] tracking-[-0.03em] text-ink">
                Histórias capturadas do alto.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {portfolio.map((p, i) => (
              <figure key={p.n} className={`col-span-12 ${p.span} group sr ${i > 0 ? `sr-d${Math.min(i + 1, 5)}` : ""}`}>
                <div className={`overflow-hidden rounded-[2px] bg-card ${p.aspect} light-sweep`}>
                  <img
                    src={p.src}
                    alt={p.t}
                    width={1280}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-5 flex flex-col items-center text-center gap-2 md:flex-row md:items-end md:justify-between md:text-left md:gap-0">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-dim">{p.n}</div>
                    <div className="mt-1 text-xl text-ink font-medium">{p.t}</div>
                  </div>
                  <ArrowUpRight className="hidden md:inline-block h-5 w-5 text-ink/60 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL (mesmo padrão do CTA do site) ===== */}
      <section className="bg-ink text-paper relative overflow-hidden">
        <div className="ambient-glow" aria-hidden />
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-24 sm:py-32 md:py-40 text-center relative">
          <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 inline-flex items-center gap-3 sr">
            <span className="h-px w-8 bg-paper/40" />
            Vamos voar
            <span className="h-px w-8 bg-paper/40" />
          </div>
          <h2 className="mt-12 font-medium leading-[0.98] tracking-[-0.04em] text-[clamp(2.25rem,6vw,5.5rem)] max-w-4xl mx-auto text-balance sr sr-d1">
            Algumas marcas não foram feitas para serem vistas do chão.
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-[15px] leading-relaxed text-paper/65 sr sr-d2">
            Solicite um orçamento de captação aérea cinematográfica e receba
            uma proposta personalizada para o seu projeto.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sr sr-d3">
            <button
              type="button"
              onClick={() => setProposalOpen(true)}
              className="group btn-shine inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-7 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
            >
              <span className="text-[13px] font-medium">Solicitar proposta</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-2.5 text-[13px] text-paper/85 hover:bg-paper/5 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar para o site
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER simples ===== */}
      <footer className="bg-ink text-paper/60 border-t border-paper/10">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-paper/40">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Agência Glass Maind</span>
          <span>Captação Aérea Cinematográfica</span>
        </div>
      </footer>

      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
    </main>
  );
}
