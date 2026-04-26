import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Search, Plus, Minus } from "lucide-react";
import heroTech from "@/assets/hero-tech.jpg";
import productTech from "@/assets/product-tech.jpg";
import portfolioBranding from "@/assets/portfolio-branding.jpg";
import portfolioSocial from "@/assets/portfolio-social.jpg";
import portfolioCampaign from "@/assets/portfolio-campaign.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ============== NAV ============== */
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-20 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center bg-ink text-paper">
            <span className="block h-3 w-3 border border-paper rotate-45" />
          </span>
          <span className="text-[15px] tracking-tight font-medium text-ink">
            Glass <span className="text-ink/50">Maind</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9 text-[13px] text-ink/70">
          <a href="#top" className="text-ink">Home</a>
          <a href="#sobre" className="hover:text-ink transition-colors">About</a>
          <a href="#servicos" className="hover:text-ink transition-colors">Services</a>
          <a href="#contato" className="hover:text-ink transition-colors">Contact</a>
        </nav>

        <div className="hidden lg:flex items-center gap-2 bg-paper/80 backdrop-blur border border-hairline rounded-full px-4 py-2 w-72">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="I am looking for..."
            className="bg-transparent text-[13px] outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>

        <a
          href="#contato"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

/* ============== HERO ============== */
function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-paper">
      {/* fine guide lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 bottom-0 left-[8%] w-px bg-hairline/60" />
        <div className="absolute top-0 bottom-0 right-[8%] w-px bg-hairline/40" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-36 pb-20 grid grid-cols-12 gap-6 md:gap-10 min-h-screen items-center">
        {/* LEFT — text */}
        <div className="col-span-12 lg:col-span-7 relative z-10">
          <div className="flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-muted-foreground reveal reveal-d1">
            <span className="font-display text-ink/80 text-base tracking-tight">05</span>
            <span className="h-px w-10 bg-ink/40" />
            <span>Futuristic</span>
          </div>

          <h1 className="mt-8 font-display font-light text-ink leading-[0.92] tracking-[-0.045em] text-[clamp(3.5rem,10vw,10rem)] reveal reveal-d2">
            NEW DIGITAL
            <br />
            BRAND
            <br />
            <span className="italic font-extralight">EXPERIENCE</span>
          </h1>

          <p className="mt-10 max-w-md text-[15px] leading-relaxed text-ink-soft reveal reveal-d3">
            Criamos presença, posicionamento e percepção para marcas que querem
            crescer com autoridade.
          </p>

          <div className="mt-10 flex items-center gap-4 reveal reveal-d4">
            <a
              href="#contato"
              className="group inline-flex items-center gap-3 bg-ink text-paper rounded-full pl-6 pr-2 py-2 transition-colors hover:bg-graphite"
            >
              <span className="text-[13px]">Get Started</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="#contato"
              className="text-[13px] text-ink/80 hover:text-ink underline-offset-4 hover:underline"
            >
              Contact Us
            </a>
          </div>

          {/* trusted */}
          <div className="mt-16 flex items-center gap-8 reveal reveal-d5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Trusted by Clients
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-paper bg-gradient-to-br from-graphite to-ink"
                    />
                  ))}
                </div>
                <span className="font-display text-2xl text-ink tracking-tight">20+</span>
              </div>
            </div>
            <div className="h-12 w-px bg-hairline" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Growth
              </div>
              <div className="font-display text-2xl text-ink tracking-tight">47.2%</div>
            </div>
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="col-span-12 lg:col-span-5 relative reveal reveal-d3">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={heroTech}
              alt="Futuro digital — Glass Maind"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
          {/* small floating label */}
          <div className="absolute -left-6 top-10 hidden md:flex flex-col items-start gap-1 text-[10px] uppercase tracking-[0.3em] text-ink/80 bg-paper/90 backdrop-blur px-3 py-2 border border-hairline">
            <span>Vol. 01 / 2025</span>
          </div>
          <div className="absolute -right-2 bottom-10 hidden md:block bg-paper border border-hairline px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Reality
            </div>
            <div className="font-display text-xl text-ink">+47.2%</div>
          </div>
        </div>
      </div>

      {/* angular transition into next section */}
      <div className="relative">
        <svg
          viewBox="0 0 1600 120"
          preserveAspectRatio="none"
          className="block w-full h-[80px] md:h-[120px]"
          aria-hidden
        >
          <polygon points="0,120 1100,120 1280,0 1600,0 1600,120" fill="var(--ink)" />
          <line x1="0" y1="119" x2="1100" y2="119" stroke="var(--hairline)" strokeWidth="1" />
          <line x1="1100" y1="119" x2="1280" y2="0" stroke="var(--hairline)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
}

/* ============== LOGO BAR ============== */
function LogoBar() {
  const logos = ["NORTHWAVE", "MAISON", "AXIS/CO", "LUMIÈRE", "STUDIO 04", "FORMA"];
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-10 flex items-center gap-12 overflow-hidden">
        <div className="flex-shrink-0 text-[10px] uppercase tracking-[0.3em] text-paper/40">
          Selected Clients
        </div>
        <div className="flex gap-16 marquee-track whitespace-nowrap">
          {[...logos, ...logos].map((l, i) => (
            <span
              key={i}
              className="font-display text-2xl tracking-[0.15em] text-paper/60"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== ABOUT / METRICS ============== */
function AboutMetrics() {
  return (
    <section id="sobre" className="py-28 md:py-40 bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="text-center mb-20">
          <div className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground inline-flex items-center gap-3">
            <span className="h-px w-10 bg-ink/40" />
            About Us
            <span className="h-px w-10 bg-ink/40" />
          </div>
          <h2 className="mt-10 font-display font-light text-ink leading-[1] tracking-[-0.035em] text-[clamp(2.5rem,6vw,5.5rem)] max-w-5xl mx-auto text-balance">
            Engineering brand <span className="italic">presence</span> for the
            next generation of companies.
          </h2>
          <p className="mt-8 max-w-2xl mx-auto text-base text-ink-soft leading-relaxed">
            A Glass Maind une design estratégico, comunicação visual e marketing
            para transformar empresas comuns em marcas com presença, consistência
            e desejo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-hairline">
          {[
            { n: "20+", l: "Marcas atendidas", d: "Clientes ativos no Brasil e exterior" },
            { n: "47%", l: "Crescimento médio", d: "Aumento de presença visual em 90 dias" },
            { n: "03", l: "Pilares de atuação", d: "Design · Marketing · Gestão" },
          ].map((it, i) => (
            <div
              key={it.l}
              className={[
                "py-14 md:py-20 px-2 md:px-10",
                i !== 0 && "md:border-l border-hairline border-t md:border-t-0",
              ].filter(Boolean).join(" ")}
            >
              <div className="font-display font-extralight text-ink text-[clamp(4rem,8vw,7rem)] leading-none tracking-[-0.05em]">
                {it.n}
              </div>
              <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-ink/70">
                <span className="h-px w-6 bg-ink/60" />
                {it.l}
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== DARK / TECH DIAGRAM ============== */
function DarkDiagram() {
  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-36">
        {/* pill label */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 bg-paper text-ink rounded-full px-5 py-2 text-[12px]">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            Smart Brand Feature
          </span>
        </div>

        <h2 className="mt-10 text-center font-display font-light leading-[0.95] tracking-[-0.035em] text-[clamp(2.75rem,7.5vw,7rem)]">
          Technology in
          <br />
          <span className="italic font-extralight">every detail.</span>
        </h2>
        <p className="mt-8 max-w-xl mx-auto text-center text-paper/60 text-[15px] leading-relaxed">
          Smart structure, maximum performance. Cinco pilares trabalhando em
          integração contínua dentro de cada marca que construímos.
        </p>

        {/* diagram */}
        <div className="mt-20 md:mt-28 relative">
          <div className="relative max-w-4xl mx-auto aspect-[16/10]">
            {/* product image centered */}
            <img
              src={productTech}
              alt="Glass Maind product diagram"
              width={1280}
              height={1024}
              loading="lazy"
              className="absolute inset-0 m-auto h-[70%] w-auto object-contain"
            />

            {/* SVG connector lines */}
            <svg
              viewBox="0 0 1000 600"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden
            >
              <g stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none">
                <line x1="180" y1="180" x2="380" y2="280" />
                <line x1="820" y1="180" x2="620" y2="260" />
                <line x1="160" y1="430" x2="360" y2="380" />
                <line x1="840" y1="430" x2="640" y2="380" />
                <line x1="500" y1="100" x2="500" y2="220" />
              </g>
              <g fill="rgba(255,255,255,0.6)">
                <circle cx="380" cy="280" r="3" />
                <circle cx="620" cy="260" r="3" />
                <circle cx="360" cy="380" r="3" />
                <circle cx="640" cy="380" r="3" />
                <circle cx="500" cy="220" r="3" />
              </g>
            </svg>

            {/* labels */}
            {[
              { c: "top-[8%] left-0", n: "01", t: "Branding", d: "Identidade & sistema" },
              { c: "top-[8%] right-0", n: "02", t: "Marketing", d: "Aquisição & performance" },
              { c: "top-0 left-1/2 -translate-x-1/2", n: "03", t: "Conteúdo", d: "Narrativa & autoridade" },
              { c: "bottom-[8%] left-0", n: "04", t: "Gestão", d: "Operação contínua" },
              { c: "bottom-[8%] right-0", n: "05", t: "Performance", d: "Métricas & otimização" },
            ].map((lbl) => (
              <div
                key={lbl.n}
                className={`absolute ${lbl.c} max-w-[160px]`}
              >
                <div className="text-[9px] uppercase tracking-[0.3em] text-paper/40">
                  {lbl.n}
                </div>
                <div className="mt-1 text-sm md:text-base text-paper">{lbl.t}</div>
                <div className="text-[11px] text-paper/50 mt-0.5">{lbl.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom thumb chips */}
        <div className="mt-16 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-14 w-14 rounded-md flex items-center justify-center ${
                i === 1 ? "bg-paper" : "bg-paper/10 border border-paper/15"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-[0.2em] ${i === 1 ? "text-ink" : "text-paper/50"}`}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== SERVICES ============== */
function Services() {
  const services = [
    { n: "01", t: "Identidade Visual", d: "Sistemas completos de marca: logo, tipografia, paleta e diretrizes." },
    { n: "02", t: "Social Media Design", d: "Conteúdo recorrente com direção de arte coerente e autoridade visual." },
    { n: "03", t: "Marketing Digital", d: "Estratégia, performance e conteúdo para gerar tráfego e conversão." },
    { n: "04", t: "Gestão de Marca", d: "Acompanhamento mensal de presença, consistência e narrativa visual." },
    { n: "05", t: "Materiais Gráficos", d: "Impressos, apresentações e papelaria com acabamento editorial." },
    { n: "06", t: "Direção Criativa", d: "Curadoria visual e estratégica para campanhas e lançamentos." },
  ];

  return (
    <section id="servicos" className="py-28 md:py-36 bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Services
            </div>
            <h3 className="mt-6 font-display font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-ink">
              Six disciplines.
              <br />
              <span className="italic">One system.</span>
            </h3>
          </div>
          <p className="col-span-12 md:col-span-5 md:col-start-8 text-base text-ink-soft self-end max-w-md">
            Cada serviço opera como um módulo dentro de uma engrenagem visual
            única — coerência total entre estratégia, design e execução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-hairline">
          {services.map((s, i) => (
            <article
              key={s.n}
              className={[
                "group relative p-10 md:p-12 min-h-[300px] flex flex-col justify-between",
                "border-b border-hairline",
                "md:[&:nth-child(2n)]:border-l md:border-l-0",
                "lg:border-l lg:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(2n)]:border-l",
                "transition-colors hover:bg-ink hover:text-paper",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-paper/60">
                  {s.n}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 group-hover:border-paper/30 transition-all">
                  <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                </span>
              </div>
              <div>
                <h4 className="font-display font-light text-3xl md:text-[2.25rem] tracking-[-0.02em] leading-tight">
                  {s.t}
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground group-hover:text-paper/70 max-w-xs">
                  {s.d}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== PORTFOLIO ============== */
function Portfolio() {
  return (
    <section id="portfolio" className="py-28 md:py-40 bg-paper-warm">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Selected Work
            </div>
            <h2 className="mt-6 font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-[-0.03em] text-ink">
              Trabalhos que <span className="italic">vendem.</span>
            </h2>
          </div>
          <a href="#contato" className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-ink border-b border-ink pb-1 self-start">
            All Projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <figure className="col-span-12 md:col-span-7 group">
            <div className="overflow-hidden bg-muted aspect-[5/4]">
              <img src={portfolioBranding} alt="Studio Noir Brand System" width={1280} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">01 / Identity</div>
                <div className="mt-1 font-display text-2xl text-ink">Studio Noir — Brand System</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-5 md:mt-24 group">
            <div className="overflow-hidden bg-muted aspect-[4/5]">
              <img src={portfolioSocial} alt="Maison social design" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">02 / Social</div>
              <div className="mt-1 font-display text-2xl text-ink">Maison — Conteúdo Recorrente</div>
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-4 md:mt-12 group">
            <div className="overflow-hidden bg-muted aspect-[4/5]">
              <img src={portfolioCampaign} alt="Editorial Issue 04" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">03 / Campaign</div>
              <div className="mt-1 font-display text-2xl text-ink">Editorial Issue 04</div>
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-8 group">
            <div className="overflow-hidden bg-ink aspect-[16/9] relative">
              <img src={productTech} alt="Lumière Direção Criativa" width={1280} height={720} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">04 / Direção</div>
                <div className="mt-1 font-display text-2xl text-ink">Lumière — Lançamento de Produto</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ============== PROCESS ============== */
function Process() {
  const steps = [
    { n: "01", t: "Diagnóstico", d: "Análise profunda de posicionamento e oportunidades." },
    { n: "02", t: "Direção visual", d: "Linguagem, tom e referências que sustentam tudo." },
    { n: "03", t: "Criação", d: "Cada peça pensada com propósito estratégico." },
    { n: "04", t: "Aplicação", d: "Implementação consistente em todos os canais." },
    { n: "05", t: "Otimização", d: "Mensuração, refinamento e evolução contínua." },
  ];
  return (
    <section id="processo" className="bg-paper py-28 md:py-36 border-t border-hairline">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="text-center mb-20">
          <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground inline-flex items-center gap-3">
            <span className="h-px w-8 bg-ink/40" />
            Process
            <span className="h-px w-8 bg-ink/40" />
          </div>
          <h2 className="mt-8 font-display font-light text-ink leading-[1] tracking-[-0.03em] text-[clamp(2.25rem,5vw,4.5rem)]">
            Clear process.
            <br />
            <span className="italic">Sophisticated</span> result.
          </h2>
        </div>

        <div className="border-t border-hairline">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group grid grid-cols-12 gap-6 py-8 md:py-10 border-b border-hairline transition-colors hover:bg-paper-warm px-2 md:px-4"
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
                <Minus className="h-5 w-5 text-ink/40 transition-all group-hover:rotate-90 group-hover:text-ink" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== CTA ============== */
function CTA() {
  return (
    <section id="contato" className="bg-ink text-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-32 md:py-44 text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-paper/40" />
          Next Chapter
          <span className="h-px w-8 bg-paper/40" />
        </div>
        <h2 className="mt-12 font-display font-extralight leading-[0.95] tracking-[-0.04em] text-[clamp(2.5rem,8vw,8rem)] max-w-6xl mx-auto text-balance">
          Sua marca pode parecer
          <br />
          <span className="italic">tão forte</span> quanto ela
          <br />
          realmente é.
        </h2>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:contato@glassmaind.com"
            className="group inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-7 pr-2 py-2"
          >
            <span className="text-[13px]">Solicitar proposta</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href="https://wa.me/"
            className="text-[13px] text-paper/80 hover:text-paper underline-offset-4 hover:underline"
          >
            Falar no WhatsApp →
          </a>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.25em] text-paper/40">
          Resposta em até 24 horas úteis
        </p>
      </div>
    </section>
  );
}

/* ============== FOOTER ============== */
function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center bg-paper text-ink">
                <span className="block h-3 w-3 border border-ink rotate-45" />
              </span>
              <span className="text-[15px] font-medium">
                Glass <span className="text-paper/50">Maind</span>
              </span>
            </div>
            <p className="mt-6 text-sm text-paper/60 max-w-sm">
              Marketing, Design & Gestão Visual. São Paulo / Worldwide.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Contato</div>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li><a href="https://wa.me/" className="hover:text-paper">WhatsApp</a></li>
              <li><a href="mailto:contato@glassmaind.com" className="hover:text-paper">E-mail</a></li>
              <li><a href="https://instagram.com" className="hover:text-paper">Instagram</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Navegar</div>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li><a href="#sobre" className="hover:text-paper">About</a></li>
              <li><a href="#servicos" className="hover:text-paper">Services</a></li>
              <li><a href="#portfolio" className="hover:text-paper">Work</a></li>
              <li><a href="#processo" className="hover:text-paper">Process</a></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4">Estúdio</div>
            <p className="text-sm text-paper/80">São Paulo / SP</p>
            <p className="mt-1 text-sm text-paper/60">Seg — Sex · 09 → 18</p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-paper/40">
          <span>© {new Date().getFullYear()} Agência Glass Maind</span>
          <span>Crafted with precision · v2.0</span>
        </div>
      </div>
    </footer>
  );
}

/* ============== PAGE ============== */
function Index() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <Nav />
      <Hero />
      <LogoBar />
      <AboutMetrics />
      <DarkDiagram />
      <Services />
      <Portfolio />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}
