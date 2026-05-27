import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plane, Camera, Sparkles, Share2, ShieldCheck, Settings2, Palette, Send, Building2, Home, Calendar, Megaphone, Film, Image as ImageIcon, Layers, MapPin } from "lucide-react";
import { useState } from "react";

import droneHero from "@/assets/aerial-drone-hero.jpg";
import { useScrollReveal, useParallax } from "@/hooks/use-scroll-reveal";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { ProposalModal } from "@/components/ProposalModal";

export const Route = createFileRoute("/captacao-aerea")({
  component: AerialPage,
  head: () => ({
    meta: [
      { title: "Captação Aérea Cinematográfica com Drone — Glass Maind" },
      { name: "description", content: "Produções aéreas cinematográficas para empresas, empreendimentos, eventos e marcas que querem transmitir autoridade, modernidade e impacto visual." },
      { property: "og:title", content: "Captação Aérea Cinematográfica — Glass Maind" },
      { property: "og:description", content: "Filmagens e fotografias aéreas premium com drone para empresas, imóveis e eventos." },
      { property: "og:url", content: "https://glassmainnd.lovable.app/captacao-aerea" },
      { property: "og:image", content: "https://glassmainnd.lovable.app/og-aerial.jpg" },
      { name: "twitter:title", content: "Captação Aérea Cinematográfica — Glass Maind" },
      { name: "twitter:description", content: "Imagens aéreas cinematográficas premium com drone profissional." },
    ],
    links: [
      { rel: "canonical", href: "https://glassmainnd.lovable.app/captacao-aerea" },
    ],
  }),
});

/* ============ HUD overlay (decorative) ============ */
function HudOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full opacity-60"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="hudLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(180,210,255,0)" />
          <stop offset="50%" stopColor="rgba(180,210,255,0.45)" />
          <stop offset="100%" stopColor="rgba(180,210,255,0)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="120" x2="1440" y2="120" stroke="url(#hudLine)" strokeWidth="0.6" />
      <line x1="0" y1="780" x2="1440" y2="780" stroke="url(#hudLine)" strokeWidth="0.6" />
      <line x1="80" y1="0" x2="80" y2="900" stroke="rgba(180,210,255,0.12)" strokeWidth="0.5" />
      <line x1="1360" y1="0" x2="1360" y2="900" stroke="rgba(180,210,255,0.12)" strokeWidth="0.5" />
      <circle cx="720" cy="450" r="180" fill="none" stroke="rgba(180,210,255,0.18)" strokeWidth="0.6" strokeDasharray="3 6" />
      <circle cx="720" cy="450" r="260" fill="none" stroke="rgba(180,210,255,0.10)" strokeWidth="0.6" strokeDasharray="2 8" />
      <text x="92" y="112" fontSize="10" fill="rgba(180,210,255,0.55)" fontFamily="monospace" letterSpacing="2">
        ALT 124m · ISO 200 · 4K · 60fps
      </text>
      <text x="1140" y="112" fontSize="10" fill="rgba(180,210,255,0.55)" fontFamily="monospace" letterSpacing="2">
        REC ●  GPS LOCKED
      </text>
    </svg>
  );
}

/* ============ NAV ============ */
function AerialNav({ onOpenProposal }: { onOpenProposal: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-[#05070d]/85 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center leading-none text-paper">
          <span className="text-[17px] tracking-tight">
            <span className="font-light text-paper/80">Agencia</span>
            <span className="mx-2 text-paper/30 font-light">|</span>
            <span className="font-semibold">Glass Maind</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-[13px] text-paper/60">
          <Link to="/" className="hover:text-paper transition-colors">Início</Link>
          <a href="#beneficios" className="hover:text-paper transition-colors">Benefícios</a>
          <a href="#servicos" className="hover:text-paper transition-colors">Serviços</a>
          <a href="#portfolio" className="hover:text-paper transition-colors">Portfólio</a>
        </nav>

        <button
          type="button"
          onClick={onOpenProposal}
          className="hidden md:inline-flex group btn-shine items-center gap-3 bg-paper text-ink rounded-full pl-5 pr-1.5 py-1.5 transition-transform duration-500 hover:scale-[1.02]"
        >
          <span className="text-[12.5px] font-medium">Solicitar Orçamento</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenProposal}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink"
          aria-label="Solicitar orçamento"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

/* ============ HERO ============ */
function AerialHero({ onOpenProposal }: { onOpenProposal: () => void }) {
  return (
    <section className="relative overflow-hidden text-paper" style={{ backgroundColor: "#05070d" }}>
      {/* background image */}
      <div className="absolute inset-0">
        <img
          src={droneHero}
          alt="Drone cinematográfico sobrevoando uma cidade ao entardecer"
          className="w-full h-full object-cover opacity-60 breathe"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/30 via-[#05070d]/60 to-[#05070d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-transparent to-[#05070d]/40" />
      </div>

      <HudOverlay />
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 pt-32 sm:pt-40 md:pt-48 pb-20 md:pb-32">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-paper/55 reveal reveal-d1">
          <span className="text-paper/40">08</span>
          <span className="h-px w-6 bg-paper/30" />
          Captação Aérea · Cinematográfica
        </div>

        <h1
          className="mt-6 font-medium max-w-[16ch] reveal reveal-d2"
          style={{
            fontSize: "clamp(2.5rem, 6.4vw, 6rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
          }}
        >
          Agora sua marca pode ser vista de outro nível.
        </h1>

        <p className="mt-7 max-w-[620px] text-[15px] md:text-[16px] leading-relaxed text-paper/70 reveal reveal-d3">
          Produções aéreas cinematográficas para empresas, empreendimentos, eventos e projetos
          que desejam transmitir autoridade, modernidade e impacto visual.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4 reveal reveal-d4">
          <button
            type="button"
            onClick={onOpenProposal}
            className="group btn-shine inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-6 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
          >
            <span className="text-[13px] font-medium">Solicitar Orçamento</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
          <a
            href={whatsappLink("Olá! Quero saber mais sobre captação aérea com drone.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-2.5 text-[13px] text-paper/85 hover:bg-paper/5 hover:border-paper/60 transition-colors"
          >
            <Send className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>

        {/* Telemetria footer */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl reveal reveal-d5">
          {[
            { k: "4K", v: "Resolução" },
            { k: "120m", v: "Altitude máx." },
            { k: "60fps", v: "Cinema motion" },
            { k: "ANAC", v: "Operação certificada" },
          ].map((m) => (
            <div key={m.v} className="border-l border-paper/20 pl-4">
              <div className="text-2xl font-medium tracking-tight tabular-nums">{m.k}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-paper/55">{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px bg-paper/15" />
    </section>
  );
}

/* ============ BENEFITS ============ */
function Benefits() {
  const items = [
    { Icon: Plane, title: "Visão Aérea Exclusiva", desc: "Mostre seu negócio por ângulos impossíveis de serem capturados do solo." },
    { Icon: Film, title: "Produção Cinematográfica", desc: "Movimentos suaves, enquadramentos profissionais e acabamento premium." },
    { Icon: Sparkles, title: "Mais Autoridade", desc: "Empresas que usam imagens aéreas transmitem mais profissionalismo e valor." },
    { Icon: Share2, title: "Conteúdo para Redes Sociais", desc: "Material ideal para Instagram, Facebook, YouTube, sites e campanhas." },
  ];
  return (
    <section id="beneficios" className="relative text-paper" style={{ backgroundColor: "#070a12" }}>
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="text-[10px] uppercase tracking-[0.3em] text-paper/55 sr">Benefícios</div>
          <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] sr sr-d1">
            Imagens que elevam a percepção da sua marca.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={`relative group sr sr-d${(i % 4) + 1} rounded-2xl border border-paper/10 bg-white/[0.02] backdrop-blur-sm p-7 lift hover:border-paper/25 transition-colors`}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-paper/5 border border-paper/10 text-paper">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-[17px] font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-paper/65">{desc}</p>
              <div className="absolute top-4 right-4 text-[10px] tabular-nums text-paper/30 font-mono">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICES OFFERED ============ */
function ServicesGrid() {
  const services = [
    { Icon: Building2, title: "Filmagem aérea institucional" },
    { Icon: Camera, title: "Fotografias aéreas profissionais" },
    { Icon: Layers, title: "Captação para empreendimentos" },
    { Icon: Home, title: "Conteúdo para imobiliárias" },
    { Icon: Calendar, title: "Cobertura de eventos" },
    { Icon: Share2, title: "Conteúdo para redes sociais" },
    { Icon: Megaphone, title: "Campanhas publicitárias" },
    { Icon: Film, title: "Vídeos promocionais" },
  ];
  return (
    <section id="servicos" className="relative text-paper" style={{ backgroundColor: "#05070d" }}>
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/55 sr">Serviços Oferecidos</div>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] sr sr-d1">
              Cada projeto, um voo planejado para impressionar.
            </h2>
          </div>
          <p className="text-[13.5px] text-paper/55 max-w-sm sr sr-d2">
            Da pré-produção à entrega final, cuidamos de cada detalhe para transformar
            sua marca em uma experiência visual premium.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map(({ Icon, title }, i) => (
            <div
              key={title}
              className={`sr sr-d${(i % 4) + 1} group relative rounded-xl border border-paper/10 bg-white/[0.015] p-6 hover:bg-white/[0.04] hover:border-paper/25 transition-all overflow-hidden`}
            >
              <Icon className="h-6 w-6 text-paper/80" />
              <h3 className="mt-6 text-[14.5px] font-medium leading-snug">{title}</h3>
              <ArrowUpRight className="absolute top-5 right-5 h-4 w-4 text-paper/30 group-hover:text-paper group-hover:rotate-12 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ DIFFERENTIATORS ============ */
function Differentiators() {
  const items = [
    { Icon: Settings2, title: "Equipamentos profissionais", desc: "Drones de última geração com câmeras 4K HDR e estabilização cinematográfica." },
    { Icon: ImageIcon, title: "Captação em alta resolução", desc: "Vídeo até 4K 60fps e fotografia RAW para máxima qualidade de pós-produção." },
    { Icon: MapPin, title: "Planejamento de voo", desc: "Roteiro de cenas, mapeamento de ângulos e horários ideais de luz natural." },
    { Icon: ShieldCheck, title: "Segurança operacional", desc: "Pilotos certificados, operação dentro das normas ANAC e seguro do equipamento." },
    { Icon: Send, title: "Entrega otimizada para marketing", desc: "Formatos prontos para Reels, YouTube, sites, apresentações e campanhas." },
    { Icon: Film, title: "Edição profissional", desc: "Storytelling visual, trilha sonora e ritmo cinematográfico em cada peça." },
    { Icon: Palette, title: "Correção de cor cinematográfica", desc: "Color grading premium para garantir identidade visual coesa e impactante." },
  ];

  return (
    <section className="relative text-paper" style={{ backgroundColor: "#070a12" }}>
      <div className="absolute inset-0 ambient-glow pointer-events-none" />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/55 sr">Diferenciais</div>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] sr sr-d1">
              Produção premium do primeiro voo à entrega final.
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-paper/65 sr sr-d2">
              Cada projeto é tratado como uma produção audiovisual completa —
              com método, tecnologia e estética cinematográfica.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-paper/10 border border-paper/10 rounded-2xl overflow-hidden">
            {items.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className={`sr sr-d${(i % 4) + 1} bg-[#070a12] p-6 sm:p-7`}
              >
                <Icon className="h-5 w-5 text-paper/80" />
                <h3 className="mt-5 text-[15px] font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-paper/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PORTFOLIO ============ */
function PortfolioPlaceholder() {
  const items = Array.from({ length: 6 });
  return (
    <section id="portfolio" className="relative text-paper" style={{ backgroundColor: "#05070d" }}>
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper/55 sr">Portfólio</div>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] sr sr-d1">
              Trabalhos selecionados em breve.
            </h2>
          </div>
          <p className="text-[12.5px] uppercase tracking-[0.22em] text-paper/45 sr sr-d2">
            Vídeos · Reels · Fotografias Aéreas
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((_, i) => (
            <div
              key={i}
              className={`sr sr-d${(i % 4) + 1} aspect-[4/3] rounded-xl border border-paper/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] relative overflow-hidden group`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Film className="h-7 w-7 text-paper/25 group-hover:text-paper/60 transition-colors" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono tracking-[0.15em] text-paper/40">
                <span>CASE_{String(i + 1).padStart(2, "0")}</span>
                <span>4K · 60fps</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-paper/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FINAL CTA ============ */
function FinalCTA({ onOpenProposal }: { onOpenProposal: () => void }) {
  return (
    <section className="relative overflow-hidden text-paper" style={{ backgroundColor: "#05070d" }}>
      <div className="absolute inset-0">
        <img
          src={droneHero}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#05070d]/70 to-[#05070d]" />
      </div>
      <HudOverlay />

      <div className="relative z-10 mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-24 md:py-36 text-center">
        <h2
          className="mx-auto max-w-[20ch] font-medium tracking-[-0.03em] sr"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.02 }}
        >
          Algumas histórias não foram feitas para serem vistas do chão.
        </h2>
        <p className="mt-6 mx-auto max-w-2xl text-[15px] leading-relaxed text-paper/70 sr sr-d1">
          Eleve a apresentação da sua empresa com imagens aéreas cinematográficas
          produzidas para impressionar.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sr sr-d2">
          <button
            type="button"
            onClick={onOpenProposal}
            className="group btn-shine inline-flex items-center gap-3 bg-paper text-ink rounded-full pl-6 pr-2 py-2 transition-transform duration-500 hover:scale-[1.02]"
          >
            <span className="text-[13px] font-medium">Solicitar Captação Aérea</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
          <a
            href={whatsappLink("Olá! Quero solicitar uma captação aérea com drone.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-paper/80 hover:text-paper underline-offset-4 hover:underline transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============ MINI FOOTER ============ */
function MiniFooter() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-paper/70">
        <div>© {new Date().getFullYear()} Agência Glass Maind · Captação Aérea</div>
        <div className="flex items-center gap-5">
          <Link to="/" className="hover:text-paper">Voltar ao site</Link>
          <span>{CONTACT.phoneDisplay}</span>
        </div>
      </div>
    </footer>
  );
}

function AerialPage() {
  useScrollReveal();
  useParallax();
  const [proposalOpen, setProposalOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#05070d" }}>
      <AerialNav onOpenProposal={() => setProposalOpen(true)} />
      <AerialHero onOpenProposal={() => setProposalOpen(true)} />
      <Benefits />
      <ServicesGrid />
      <Differentiators />
      <PortfolioPlaceholder />
      <FinalCTA onOpenProposal={() => setProposalOpen(true)} />
      <MiniFooter />
      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
    </main>
  );
}
