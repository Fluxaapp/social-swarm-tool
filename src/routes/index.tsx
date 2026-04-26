import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import glassObject from "@/assets/glass-object.jpg";
import portfolioBranding from "@/assets/portfolio-branding.jpg";
import portfolioSocial from "@/assets/portfolio-social.jpg";
import portfolioCampaign from "@/assets/portfolio-campaign.jpg";
import darkComposition from "@/assets/dark-composition.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* -------------------------------------------------- */
/*                       NAV                          */
/* -------------------------------------------------- */
function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/70 backdrop-blur-md border-b border-hairline/60">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2 group">
          <span className="font-display text-xl tracking-tight text-ink">Glass</span>
          <span className="font-display italic text-xl text-ink/60">Maind</span>
          <span className="ml-2 hidden md:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            ® Agência
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[12px] uppercase tracking-[0.18em] text-ink/70">
          <a href="#sobre" className="hover:text-ink transition-colors">Sobre</a>
          <a href="#servicos" className="hover:text-ink transition-colors">Serviços</a>
          <a href="#portfolio" className="hover:text-ink transition-colors">Portfólio</a>
          <a href="#processo" className="hover:text-ink transition-colors">Processo</a>
        </nav>
        <a
          href="#contato"
          className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-ink"
        >
          <span className="hidden sm:inline">Iniciar projeto</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </header>
  );
}

/* -------------------------------------------------- */
/*                       HERO                         */
/* -------------------------------------------------- */
function Hero() {
  return (
    <section id="top" className="relative pt-28 md:pt-36 overflow-hidden">
      {/* fine geometric grid lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-[18%] w-px h-full bg-hairline/70" />
        <div className="absolute top-0 right-[22%] w-px h-full bg-hairline/40" />
        <div className="absolute top-[60%] left-0 right-0 h-px bg-hairline/50" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative">
        {/* meta line */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted-foreground reveal reveal-d1">
          <span>— Edição N°01 / {new Date().getFullYear()}</span>
          <span className="hidden md:inline">Marketing · Design · Gestão Visual</span>
          <span>São Paulo / Worldwide</span>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-12 gap-6 md:gap-10 items-end">
          {/* Headline */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-display font-light text-ink leading-[0.92] tracking-[-0.04em] text-[clamp(3.5rem,11vw,11rem)] reveal reveal-d2">
              Design <span className="italic font-extralight text-ink/80">que</span>
              <br />
              move <span className="italic font-extralight">marcas.</span>
            </h1>
          </div>

          {/* Hero image — vertical, asymmetric */}
          <div className="col-span-12 lg:col-span-4 relative reveal reveal-d3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={heroPortrait}
                alt="Editorial premium da Glass Maind"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-6 hidden md:flex flex-col items-start gap-1 text-[10px] uppercase tracking-[0.3em] text-ink/80">
              <span className="h-px w-12 bg-ink" />
              <span>Vol. 01</span>
              <span>Glass / Maind</span>
            </div>
          </div>
        </div>

        {/* Sub-row */}
        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-6 md:gap-10 pb-20 md:pb-28">
          <div className="col-span-12 md:col-span-5 lg:col-span-4 reveal reveal-d3">
            <p className="text-[15px] md:text-base leading-relaxed text-ink-soft text-pretty max-w-md">
              Estratégia, identidade visual e marketing para marcas que querem
              parecer maiores, vender melhor e serem lembradas.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col md:flex-row md:items-end md:justify-end gap-4 md:gap-6 reveal reveal-d4">
            <a
              href="#contato"
              className="group inline-flex items-center justify-between gap-6 bg-ink text-paper px-7 py-5 transition-colors hover:bg-graphite"
            >
              <span className="text-[12px] uppercase tracking-[0.25em]">Começar projeto</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#servicos"
              className="group inline-flex items-center justify-between gap-6 border border-ink/80 px-7 py-5 transition-colors hover:bg-ink hover:text-paper"
            >
              <span className="text-[12px] uppercase tracking-[0.25em]">Ver serviços</span>
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                     METRICS                        */
/* -------------------------------------------------- */
function Metrics() {
  const items = [
    { n: "20+", label: "Marcas atendidas", side: "Clientes ativos no Brasil e exterior" },
    { n: "47%", label: "Mais presença visual", side: "Crescimento médio em 90 dias" },
    { n: "03", label: "Pilares de atuação", side: "Design · Marketing · Gestão" },
  ];
  return (
    <section className="border-y border-hairline">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
          {items.map((it) => (
            <div key={it.label} className="py-12 md:py-20 md:px-12 first:md:pl-0 last:md:pr-0">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-extralight text-ink text-[clamp(4rem,9vw,8rem)] leading-none tracking-[-0.04em]">
                  {it.n}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-ink/70">
                <span className="h-px w-6 bg-ink/60" />
                {it.label}
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">{it.side}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                       ABOUT                        */
/* -------------------------------------------------- */
function About() {
  return (
    <section id="sobre" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 md:col-span-3">
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink/60 flex items-center gap-3">
            <span className="h-px w-8 bg-ink/60" />
            About us
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            (01) — Posicionamento
          </p>
        </div>

        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display font-light text-ink leading-[1.02] tracking-[-0.03em] text-[clamp(2.25rem,5.4vw,5rem)] text-balance">
            Clareza visual para marcas que <span className="italic font-extralight">querem crescer</span> com elegância.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
            <p className="text-base md:text-lg leading-relaxed text-ink-soft">
              A Glass Maind une design estratégico, comunicação visual e marketing
              para transformar empresas comuns em marcas com presença, consistência
              e desejo.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Trabalhamos como uma extensão do seu time — pensando cada peça, cada
              decisão visual e cada ponto de contato como parte de um sistema
              coerente. Aqui, design não é decoração: é vantagem competitiva.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                     SERVICES                       */
/* -------------------------------------------------- */
function Services() {
  const services = [
    { n: "01", title: "Identidade Visual", desc: "Sistemas de marca completos: logo, tipografia, paleta e diretrizes que sustentam o crescimento." },
    { n: "02", title: "Social Media Design", desc: "Conteúdo visual recorrente, com direção de arte coerente e foco em autoridade." },
    { n: "03", title: "Marketing Digital", desc: "Estratégia, performance e conteúdo para gerar tráfego qualificado e conversão real." },
    { n: "04", title: "Gestão de Marca", desc: "Acompanhamento mensal de presença, consistência e narrativa visual da empresa." },
    { n: "05", title: "Materiais Gráficos", desc: "Impressos, apresentações, embalagens e papelaria com acabamento editorial." },
    { n: "06", title: "Direção Criativa", desc: "Curadoria visual e estratégica para campanhas, lançamentos e reposicionamentos." },
  ];
  return (
    <section id="servicos" className="border-t border-hairline">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="py-14 grid grid-cols-12 gap-6 border-b border-hairline">
          <div className="col-span-12 md:col-span-4 text-[11px] uppercase tracking-[0.3em] text-ink/60 flex items-center gap-3">
            <span className="h-px w-8 bg-ink/60" />
            Serviços
          </div>
          <h3 className="col-span-12 md:col-span-8 font-display font-light text-[clamp(1.75rem,3vw,2.75rem)] leading-tight tracking-[-0.02em] text-ink">
            Seis disciplinas, <span className="italic">um sistema</span> visual coerente.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.n}
              className={[
                "group relative p-10 md:p-12 min-h-[320px] flex flex-col justify-between",
                "border-b border-hairline",
                "lg:[&:nth-child(3n+1)]:border-l-0 lg:border-l border-hairline",
                "md:[&:nth-child(2n+1)]:border-l-0 md:border-l",
                "transition-colors hover:bg-ink hover:text-paper",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-paper/60">
                  {s.n}
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-50 transition-all group-hover:opacity-100 group-hover:rotate-12" />
              </div>
              <div>
                <h4 className="font-display font-light text-3xl md:text-4xl tracking-[-0.02em] leading-tight">
                  {s.title}
                </h4>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground group-hover:text-paper/70 max-w-xs">
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                    DARK SECTION                    */
/* -------------------------------------------------- */
function DarkSection() {
  const tags = ["Branding", "Conteúdo", "Conversão", "Presença", "Consistência", "Autoridade"];
  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5 flex flex-col justify-between">
            <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 flex items-center gap-3">
              <span className="h-px w-8 bg-paper/50" />
              Filosofia
            </div>

            <h2 className="mt-10 font-display font-extralight leading-[0.95] tracking-[-0.04em] text-[clamp(3rem,7.5vw,7.5rem)]">
              Every detail
              <br />
              <span className="italic">has strategy.</span>
            </h2>

            <p className="mt-10 text-base text-paper/70 leading-relaxed max-w-md">
              Cada espaço, contraste e ritmo é uma decisão estratégica. Marcas
              memoráveis não acontecem por acaso — elas são desenhadas.
            </p>

            <div className="mt-12 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] uppercase tracking-[0.2em] border border-paper/20 px-4 py-2 text-paper/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 relative">
            <div className="relative aspect-[5/4] overflow-hidden">
              <img
                src={darkComposition}
                alt="Composição premium dark Glass Maind"
                width={1280}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {/* floating cards */}
              <div className="absolute top-6 left-6 bg-paper text-ink p-5 max-w-[200px] shadow-2xl">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Brand Audit</div>
                <div className="mt-2 font-display text-2xl tracking-tight">+47%</div>
                <div className="text-[11px] text-muted-foreground">Reconhecimento visual</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-ink/90 backdrop-blur border border-paper/20 p-5 max-w-[220px]">
                <div className="text-[10px] uppercase tracking-[0.25em] text-paper/50">Sistema</div>
                <div className="mt-2 font-display text-xl text-paper">Coerência total</div>
                <div className="mt-2 text-[11px] text-paper/60">
                  Do logo ao último story — uma única voz visual.
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { k: "01", v: "Sistema unificado de marca" },
                { k: "02", v: "Decisões visuais com propósito" },
                { k: "03", v: "Aplicação consistente em todos os canais" },
              ].map((p) => (
                <div key={p.k} className="border-t border-paper/15 pt-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40">{p.k}</div>
                  <p className="mt-2 text-xs md:text-sm text-paper/80 leading-relaxed">{p.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                     PORTFOLIO                      */
/* -------------------------------------------------- */
function Portfolio() {
  return (
    <section id="portfolio" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4 text-[11px] uppercase tracking-[0.3em] text-ink/60 flex items-center gap-3">
            <span className="h-px w-8 bg-ink/60" />
            Selected Work
          </div>
          <h2 className="col-span-12 md:col-span-8 font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-[-0.03em] text-ink">
            Trabalhos que <span className="italic">vendem</span> através do design.
          </h2>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* row 1 */}
          <figure className="col-span-12 md:col-span-7 group">
            <div className="overflow-hidden bg-muted aspect-[5/4]">
              <img src={portfolioBranding} alt="Identidade visual premium" width={1280} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">01 / Identidade Visual</div>
                <div className="mt-1 font-display text-2xl text-ink">Studio Noir — Brand System</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-5 md:mt-24 group">
            <div className="overflow-hidden bg-muted aspect-[4/5]">
              <img src={portfolioSocial} alt="Design para redes sociais" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">02 / Social Design</div>
              <div className="mt-1 font-display text-2xl text-ink">Maison — Conteúdo Recorrente</div>
            </figcaption>
          </figure>

          {/* row 2 */}
          <figure className="col-span-12 md:col-span-4 md:mt-12 group">
            <div className="overflow-hidden bg-muted aspect-[4/5]">
              <img src={portfolioCampaign} alt="Campanha editorial" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">03 / Campanha</div>
              <div className="mt-1 font-display text-2xl text-ink">Editorial Issue 04</div>
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-8 group">
            <div className="overflow-hidden bg-ink aspect-[16/9] relative">
              <img src={glassObject} alt="Direção criativa premium" width={1280} height={720} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">04 / Direção Criativa</div>
                <div className="mt-1 font-display text-2xl text-ink">Lumière — Lançamento de Produto</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 flex justify-center">
          <a href="#contato" className="group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.25em] text-ink border-b border-ink pb-1">
            Solicitar portfólio completo
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                      PROCESS                       */
/* -------------------------------------------------- */
function Process() {
  const steps = [
    { n: "01", t: "Diagnóstico da marca", d: "Análise profunda de posicionamento, percepção atual e oportunidades visuais." },
    { n: "02", t: "Direção visual", d: "Definição de linguagem, tom e referências que sustentarão toda a comunicação." },
    { n: "03", t: "Criação estratégica", d: "Desenvolvimento de cada peça com propósito — nada é decorativo." },
    { n: "04", t: "Aplicação e gestão", d: "Implementação consistente em todos os canais, com acompanhamento contínuo." },
    { n: "05", t: "Otimização contínua", d: "Mensuração, refinamento e evolução — porque marca é organismo vivo." },
  ];
  return (
    <section id="processo" className="border-t border-hairline bg-paper-warm">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4 text-[11px] uppercase tracking-[0.3em] text-ink/60 flex items-center gap-3">
            <span className="h-px w-8 bg-ink/60" />
            Método
          </div>
          <h2 className="col-span-12 md:col-span-8 font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-[-0.03em] text-ink">
            Processo claro.
            <br />
            Resultado <span className="italic">sofisticado</span>.
          </h2>
        </div>

        <div className="border-t border-hairline">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group grid grid-cols-12 gap-6 py-10 md:py-12 border-b border-hairline transition-colors hover:bg-paper"
            >
              <div className="col-span-3 md:col-span-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground pt-2">
                {s.n}
              </div>
              <h4 className="col-span-9 md:col-span-5 font-display font-light text-3xl md:text-5xl tracking-[-0.02em] text-ink leading-[1.05]">
                {s.t}
              </h4>
              <p className="col-span-12 md:col-span-4 md:col-start-8 text-sm md:text-base text-ink-soft leading-relaxed pt-2">
                {s.d}
              </p>
              <div className="hidden md:flex col-span-1 justify-end items-start pt-3">
                <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-ink group-hover:rotate-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                        CTA                         */
/* -------------------------------------------------- */
function CTA() {
  return (
    <section id="contato" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-32 md:py-48">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink/60 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-ink/60" />
            Próximo capítulo
            <span className="h-px w-8 bg-ink/60" />
          </div>
          <h2 className="mt-12 font-display font-extralight text-ink leading-[0.95] tracking-[-0.04em] text-[clamp(2.5rem,8vw,8rem)] text-balance max-w-6xl mx-auto">
            Sua marca pode parecer
            <br />
            <span className="italic">tão forte</span> quanto ela
            <br />
            realmente é.
          </h2>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:contato@glassmaind.com"
              className="group inline-flex items-center gap-6 bg-ink text-paper px-9 py-6 transition-colors hover:bg-graphite"
            >
              <span className="text-[12px] uppercase tracking-[0.25em]">Solicitar proposta</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://wa.me/"
              className="group inline-flex items-center gap-6 border border-ink/80 px-9 py-6 transition-colors hover:bg-ink hover:text-paper"
            >
              <span className="text-[12px] uppercase tracking-[0.25em]">Falar no WhatsApp</span>
            </a>
          </div>

          <p className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Resposta em até 24 horas úteis
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- */
/*                      FOOTER                        */
/* -------------------------------------------------- */
function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl md:text-5xl tracking-tight">Glass</span>
              <span className="font-display italic text-3xl md:text-5xl text-paper/60">Maind</span>
            </div>
            <p className="mt-6 text-sm text-paper/60 max-w-sm">
              Marketing, Design & Gestão Visual para marcas que querem ser
              lembradas — e desejadas.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-5">Contato</div>
            <ul className="space-y-3 text-sm text-paper/80">
              <li><a href="https://wa.me/" className="hover:text-paper">WhatsApp</a></li>
              <li><a href="mailto:contato@glassmaind.com" className="hover:text-paper">E-mail</a></li>
              <li><a href="https://instagram.com" className="hover:text-paper">Instagram</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-5">Navegar</div>
            <ul className="space-y-3 text-sm text-paper/80">
              <li><a href="#sobre" className="hover:text-paper">Sobre</a></li>
              <li><a href="#servicos" className="hover:text-paper">Serviços</a></li>
              <li><a href="#portfolio" className="hover:text-paper">Portfólio</a></li>
              <li><a href="#processo" className="hover:text-paper">Processo</a></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-5">Estúdio</div>
            <p className="text-sm text-paper/80">São Paulo / Worldwide</p>
            <p className="mt-2 text-sm text-paper/60">Seg — Sex · 09 → 18</p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-paper/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-paper/40">
          <span>© {new Date().getFullYear()} Agência Glass Maind. Todos os direitos reservados.</span>
          <span>Crafted with precision · v1.0</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------- */
/*                       PAGE                         */
/* -------------------------------------------------- */
function Index() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <Nav />
      <Hero />
      <Metrics />
      <About />
      <Services />
      <DarkSection />
      <Portfolio />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}
