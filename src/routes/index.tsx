import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Search, Plus, Star } from "lucide-react";
import heroVision from "@/assets/hero-vision.jpg";
import deviceFront from "@/assets/device-front.jpg";
import deviceRow from "@/assets/device-row.jpg";
import portraitSecond from "@/assets/portrait-second.jpg";
import { useParallax, useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Route = createFileRoute("/")({
  component: Index,
});


/* =================== NAV =================== */
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-paper">
            <span className="block h-3.5 w-3.5 border border-paper/90 rotate-45" />
          </span>
          <span className="text-[15px] font-medium tracking-tight text-ink">Glass Maind</span>
        </a>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-9 text-[14px] text-ink/60">
          <a href="#top" className="text-ink">Home</a>
          <a href="#about" className="hover:text-ink transition-colors">About</a>
          <a href="#services" className="hover:text-ink transition-colors">Services</a>
          <a href="#contact" className="hover:text-ink transition-colors">Contact</a>
        </nav>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-white/70 backdrop-blur border border-line rounded-full px-4 py-2.5 w-72">
          <Search className="h-3.5 w-3.5 text-dim" />
          <input
            type="text"
            placeholder="I am looking for..."
            className="bg-transparent text-[13px] outline-none placeholder:text-dim flex-1"
          />
        </div>

        <a
          href="#contact"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper"
          aria-label="Contact"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

/* =================== HERO =================== */
function Hero() {
  return (
    <section id="top" className="relative bg-soft overflow-hidden">
      {/* Decorative grid lines (parallax slow) */}
      <div
        data-parallax="0.08"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
      >
        <div className="absolute top-0 bottom-0 left-[16%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
        <div className="absolute top-0 bottom-0 left-[58%] w-px bg-gradient-to-b from-transparent via-ink/8 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
      </div>

      {/* Animated diagonal sweep line crossing the hero */}
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

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 pt-32 md:pt-40 pb-12 md:pb-20 grid grid-cols-12 gap-6 md:gap-10 items-end min-h-[100vh] relative">
        {/* LEFT — text */}
        <div className="col-span-12 lg:col-span-7 relative z-10">
          <div className="text-[11px] tracking-[0.3em] uppercase text-dim reveal reveal-d1">
            Futuristic
          </div>

          <div className="mt-4 flex items-start gap-6 reveal reveal-d2">
            <span className="text-sm text-dim mt-3">05</span>
            <h1 className="font-medium text-ink leading-[0.92] tracking-[-0.045em] text-[clamp(3.25rem,9vw,9rem)]">
              <span className="block reveal reveal-d2">NEW DIGITAL</span>
              <span className="block reveal reveal-d3">BRAND</span>
              <span className="block reveal reveal-d4">EXPERIENCE</span>
            </h1>
          </div>

          <p className="mt-10 max-w-md text-[15px] leading-relaxed text-dim reveal reveal-d4">
            Criamos presença, posicionamento e percepção para marcas que querem
            crescer com autoridade.
          </p>

          <div className="mt-10 flex items-center gap-5 reveal reveal-d5">
            <a
              href="#contact"
              className="group btn-shine inline-flex items-center gap-3 bg-ink text-paper rounded-full pl-6 pr-2 py-2 transition-all duration-500 hover:bg-ink/85 hover:scale-[1.02]"
            >
              <span className="text-[13px] font-medium">Get Started</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <a href="#contact" className="text-[13px] text-ink/80 hover:text-ink underline-offset-4 hover:underline transition-colors">
              Contact Us
            </a>
          </div>

          {/* trusted */}
          <div className="mt-16 flex items-center gap-10 reveal reveal-d5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-dim mb-2.5">
                Trusted by Clients
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
                Reality
              </div>
              <div className="text-2xl font-medium text-ink tracking-tight">47.2%</div>
            </div>
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="col-span-12 lg:col-span-5 relative reveal reveal-d3">
          {/* Soft depth glow behind the image */}
          <div
            aria-hidden
            className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-ink/8 via-transparent to-ink/5 depth-blur"
          />
          <div
            data-parallax="-0.05"
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card light-sweep"
          >
            <img
              src={heroVision}
              alt="Glass Maind — futuro digital"
              width={1024}
              height={1280}
              className="h-full w-full object-cover breathe"
            />
          </div>
          {/* floating chip */}
          <div className="absolute -left-4 top-12 hidden md:flex items-center gap-2 bg-white border border-line rounded-full px-4 py-2 shadow-sm float-slow">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-ink/70">Vol. 01</span>
          </div>
          {/* floating index */}
          <div className="absolute -right-3 bottom-16 hidden md:flex flex-col items-end gap-1 float-slower">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink/50">Index</span>
            <span className="text-sm text-ink/80 font-medium">A · 24</span>
          </div>
        </div>
      </div>

      {/* Angular transition into dark band */}
      <div className="relative -mt-px">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="block w-full h-[70px] md:h-[100px]"
          aria-hidden
        >
          <polygon points="0,100 950,100 1140,0 1440,0 1440,100" fill="var(--ink)" />
        </svg>
      </div>
    </section>
  );
}


/* =================== INFO STRIP =================== */
function InfoStrip() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20">
            <span className="block h-3 w-3 border border-paper/80 rotate-45" />
          </div>
          <p className="text-sm text-paper/80 max-w-md">
            In this futuristic realm, brands explore hyper-realistic visual
            environments and connect with AI-driven systems.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-paper/70">
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <Star className="h-3.5 w-3.5 fill-paper text-paper" />
            <span className="text-[12px] tracking-wide ml-2">3,000+ Customers</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-paper/40 hidden md:inline">
            · Scroll Down
          </span>
        </div>
      </div>
    </section>
  );
}

/* =================== ABOUT =================== */
function About() {
  return (
    <section id="about" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.35em] text-dim inline-flex items-center gap-3 sr">
            <span className="h-px w-10 bg-ink/40" />
            About Us
            <span className="h-px w-10 bg-ink/40" />
          </div>
          <h2 className="mt-10 font-medium text-ink leading-[1] tracking-[-0.035em] text-[clamp(2.5rem,5.5vw,5rem)] text-balance sr sr-d1">
            Engineering brand presence for the next generation of companies.
          </h2>
          <p className="mt-8 text-base text-dim leading-relaxed max-w-2xl mx-auto sr sr-d2">
            A Glass Maind une design estratégico, comunicação visual e marketing
            para transformar empresas comuns em marcas com presença, consistência
            e desejo.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 border-t border-line">
          {[
            { n: "20+", l: "Marcas atendidas", d: "Clientes ativos no Brasil e exterior" },
            { n: "47%", l: "Crescimento médio", d: "Aumento de presença em 90 dias" },
            { n: "03", l: "Pilares de atuação", d: "Design · Marketing · Gestão" },
          ].map((it, i) => (
            <div
              key={it.l}
              className={[
                "py-14 md:py-20 px-2 md:px-10 sr",
                `sr-d${i + 1}`,
                i !== 0 ? "border-t md:border-t-0 md:border-l border-line" : "",
              ].join(" ")}
            >
              <div className="font-medium text-ink text-[clamp(3.5rem,7vw,6rem)] leading-none tracking-[-0.05em]">
                {it.n}
              </div>
              <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-ink/70">
                <span className="h-px w-6 bg-ink/60" />
                {it.l}
              </div>
              <p className="mt-3 text-sm text-dim max-w-xs">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =================== DARK / TECHNOLOGY =================== */
function Technology() {
  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      {/* Ambient slow-moving glow */}
      <div className="ambient-glow" aria-hidden />

      {/* Drifting light dots */}
      <span className="light-dot" style={{ top: "18%", left: "12%", animationDelay: "0s" }} aria-hidden />
      <span className="light-dot" style={{ top: "62%", left: "8%", animationDelay: "3s" }} aria-hidden />
      <span className="light-dot" style={{ top: "30%", right: "10%", animationDelay: "5s" }} aria-hidden />
      <span className="light-dot" style={{ top: "78%", right: "16%", animationDelay: "1.5s" }} aria-hidden />

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-24 md:py-36 relative">
        {/* pill */}
        <div className="flex justify-center sr">
          <span className="inline-flex items-center gap-2 bg-paper text-ink rounded-full px-5 py-2 text-[12px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            Smart Brand Feature
          </span>
        </div>

        <h2 className="mt-10 text-center font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.5rem,6.5vw,6rem)] sr sr-d1">
          Technology in Every Layer
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-center text-paper/60 text-[15px] leading-relaxed sr sr-d2">
          Smart structure, maximum performance. Cinco componentes principais
          trabalhando em integração contínua dentro de cada marca.
        </p>

        {/* Diagram */}
        <div className="mt-20 md:mt-28 relative sr sr-d3">
          <div className="relative max-w-5xl mx-auto aspect-[16/10]">
            {/* product image — gentle float */}
            <img
              src={deviceFront}
              alt="Glass Maind device diagram"
              width={1280}
              height={1024}
              loading="lazy"
              className="absolute inset-0 m-auto h-[78%] w-auto object-contain float-slower"
            />

            {/* connector lines (animated dash) */}
            <svg
              viewBox="0 0 1000 600"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden
            >
              <g stroke="rgba(255,255,255,0.32)" strokeWidth="1" fill="none">
                <line x1="180" y1="200" x2="380" y2="280" className="dash-flow" />
                <line x1="820" y1="180" x2="620" y2="260" className="dash-flow" style={{ animationDelay: "2s" }} />
                <line x1="160" y1="430" x2="360" y2="380" className="dash-flow" style={{ animationDelay: "4s" }} />
                <line x1="840" y1="430" x2="640" y2="380" className="dash-flow" style={{ animationDelay: "1s" }} />
                <line x1="500" y1="80" x2="500" y2="220" className="dash-flow" style={{ animationDelay: "3s" }} />
              </g>
              <g fill="rgba(255,255,255,0.85)">
                <circle cx="380" cy="280" r="3">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="620" cy="260" r="3">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="360" cy="380" r="3">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" begin="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="640" cy="380" r="3">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="3.2s" begin="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="500" cy="220" r="3">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="3.8s" begin="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {[
              { c: "top-[14%] left-0", n: "01", t: "Branding" },
              { c: "top-[14%] right-0 text-right items-end", n: "02", t: "Marketing" },
              { c: "top-0 left-1/2 -translate-x-1/2 text-center items-center", n: "03", t: "Conteúdo" },
              { c: "bottom-[10%] left-0", n: "04", t: "Gestão" },
              { c: "bottom-[10%] right-0 text-right items-end", n: "05", t: "Performance" },
            ].map((lbl, i) => (
              <div
                key={lbl.n}
                className={`absolute ${lbl.c} flex flex-col gap-1 max-w-[160px] sr sr-d${Math.min(i + 1, 5)}`}
              >
                <div className="text-[9px] uppercase tracking-[0.3em] text-paper/40">
                  {lbl.n}
                </div>
                <div className="text-base text-paper">{lbl.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom thumbnails */}
        <div className="mt-16 flex justify-center gap-3 sr sr-d4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                i === 1
                  ? "bg-paper"
                  : "bg-paper/5 border border-paper/10 hover:bg-paper/10 hover:scale-105"
              }`}
            >
              <div className={`h-3 w-3 ${i === 1 ? "border-2 border-ink" : "border border-paper/40"} rotate-45`} />
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-6">
            <div className="text-[11px] uppercase tracking-[0.3em] text-dim flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Services
            </div>
            <h3 className="mt-6 font-medium text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-ink">
              Six disciplines.<br />
              One ecosystem.
            </h3>
          </div>
          <p className="col-span-12 md:col-span-5 md:col-start-8 text-base text-dim self-end max-w-md">
            Cada serviço opera como módulo dentro de uma engrenagem visual única
            — coerência total entre estratégia, design e execução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {services.map((s) => (
            <article
              key={s.n}
              className="group relative bg-paper p-10 md:p-12 min-h-[290px] flex flex-col justify-between transition-colors hover:bg-ink hover:text-paper"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-dim group-hover:text-paper/60">
                  {s.n}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line group-hover:border-paper/30 transition-all">
                  <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                </span>
              </div>
              <div>
                <h4 className="font-medium text-2xl md:text-[1.75rem] tracking-[-0.02em] leading-tight">
                  {s.t}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-dim group-hover:text-paper/70 max-w-xs">
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

/* =================== PORTFOLIO =================== */
function Portfolio() {
  return (
    <section id="portfolio" className="bg-soft py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-dim flex items-center gap-3">
              <span className="h-px w-8 bg-ink/40" />
              Selected Work
            </div>
            <h2 className="mt-6 font-medium text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] tracking-[-0.03em] text-ink">
              Trabalhos que vendem.
            </h2>
          </div>
          <a href="#contact" className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-ink border-b border-ink pb-1 self-start">
            All Projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <figure className="col-span-12 md:col-span-7 group">
            <div className="overflow-hidden rounded-2xl bg-card aspect-[5/4]">
              <img src={portraitSecond} alt="Studio Noir Brand System" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-dim">01 / Identity</div>
                <div className="mt-1 text-xl text-ink font-medium">Studio Noir — Brand System</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-5 md:mt-24 group">
            <div className="overflow-hidden rounded-2xl bg-card aspect-[4/5]">
              <img src={heroVision} alt="Maison" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-dim">02 / Social</div>
              <div className="mt-1 text-xl text-ink font-medium">Maison — Conteúdo Recorrente</div>
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-5 md:mt-12 group">
            <div className="overflow-hidden rounded-2xl bg-card aspect-[4/5]">
              <img src={deviceRow} alt="Catalog 04" width={1280} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-dim">03 / Catalog</div>
              <div className="mt-1 text-xl text-ink font-medium">Lumière — Linha 04</div>
            </figcaption>
          </figure>

          <figure className="col-span-12 md:col-span-7 group">
            <div className="overflow-hidden rounded-2xl bg-ink aspect-[16/10] relative">
              <img src={deviceFront} alt="Aurora launch" width={1280} height={800} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-dim">04 / Direção</div>
                <div className="mt-1 text-xl text-ink font-medium">Aurora — Lançamento de Produto</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* =================== CTA =================== */
function CTA() {
  return (
    <section id="contact" className="bg-ink text-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-32 md:py-44 text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-paper/50 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-paper/40" />
          Get in Touch
          <span className="h-px w-8 bg-paper/40" />
        </div>
        <h2 className="mt-12 font-medium leading-[0.95] tracking-[-0.04em] text-[clamp(2.5rem,7.5vw,7.5rem)] max-w-5xl mx-auto text-balance">
          Sua marca pode parecer tão forte quanto ela realmente é.
        </h2>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:contato@glassmaind.com"
            className="group inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-7 pr-2 py-2"
          >
            <span className="text-[13px] font-medium">Solicitar proposta</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <a href="https://wa.me/" className="text-[13px] text-paper/80 hover:text-paper underline-offset-4 hover:underline">
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

/* =================== FOOTER =================== */
function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-paper text-ink">
                <span className="block h-3.5 w-3.5 border border-ink/90 rotate-45" />
              </span>
              <span className="text-[15px] font-medium">Glass Maind</span>
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
              <li><a href="#about" className="hover:text-paper">About</a></li>
              <li><a href="#services" className="hover:text-paper">Services</a></li>
              <li><a href="#portfolio" className="hover:text-paper">Work</a></li>
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
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

/* =================== PAGE =================== */
function Index() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <Nav />
      <Hero />
      <InfoStrip />
      <About />
      <Technology />
      <Services />
      <Portfolio />
      <CTA />
      <Footer />
    </main>
  );
}
