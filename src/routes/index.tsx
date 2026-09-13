import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import workBranding from "@/assets/work-branding.jpg";
import workEditorial from "@/assets/work-editorial.jpg";
import workPackaging from "@/assets/work-packaging.jpg";
import workCampaign from "@/assets/work-campaign.jpg";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { ProposalModal } from "@/components/ProposalModal";
import { CareerModal } from "@/components/CareerModal";
import "../glass-home.css";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Glass Maind — Branding, Design & Experiências Digitais" },
      {
        name: "description",
        content:
          "Glass Maind é uma agência criativa especializada em branding, identidade visual, marketing e experiências digitais.",
      },
      { property: "og:title", content: "Glass Maind — Creative Agency" },
      {
        property: "og:description",
        content: "Estratégia, identidade e experiências digitais para marcas com presença.",
      },
    ],
  }),
});

const EASE = "cubic-bezier(.22,1,.36,1)";

const SERVICES = [
  {
    n: "01",
    title: "Identidade Visual",
    eyebrow: "Brand systems",
    description:
      "Sistemas de marca construídos para sustentar posicionamento, reconhecimento e consistência em cada ponto de contato.",
    image: workBranding,
    message: "Olá! Quero conversar sobre um projeto de Identidade Visual com a Glass Maind.",
  },
  {
    n: "02",
    title: "Social Media Design",
    eyebrow: "Content direction",
    description:
      "Direção visual recorrente para transformar presença digital em uma linguagem reconhecível e coerente.",
    image: workEditorial,
    message: "Olá! Quero conversar sobre Social Media Design com a Glass Maind.",
  },
  {
    n: "03",
    title: "Marketing Digital",
    eyebrow: "Strategy & performance",
    description:
      "Estratégia, conteúdo e performance conectados para ampliar alcance sem diluir a identidade da marca.",
    image: workCampaign,
    message: "Olá! Quero conversar sobre Marketing Digital com a Glass Maind.",
  },
  {
    n: "04",
    title: "Sites & UX/UI",
    eyebrow: "Digital experience",
    description:
      "Interfaces e experiências digitais desenhadas para unir clareza, conversão, estética e personalidade.",
    image: workPackaging,
    message: "Olá! Quero conversar sobre Sites e UX/UI com a Glass Maind.",
  },
  {
    n: "05",
    title: "Direção Criativa",
    eyebrow: "Creative direction",
    description:
      "Conceito, linguagem e direção para campanhas, lançamentos e marcas que precisam ocupar um espaço próprio.",
    image: workEditorial,
    message: "Olá! Quero conversar sobre Direção Criativa com a Glass Maind.",
  },
];

function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className={`gm-brand ${compact ? "gm-brand--compact" : ""} ${light ? "gm-brand--light" : ""}`}>
      <img className="gm-brand__symbol" src="/brand-symbol.svg" alt="" aria-hidden="true" />
      <img className="gm-brand__wordmark" src="/brand-wordmark.svg" alt="Glass Maind" />
    </span>
  );
}

function useMotionSystem(
  heroRef: React.RefObject<HTMLElement | null>,
  servicesRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
  progressRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-gm-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("gm-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    revealTargets.forEach((el) => observer.observe(el));

    if (reduced) return () => observer.disconnect();

    let raf = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      raf = 0;
      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const p = clamp(-rect.top / Math.max(window.innerHeight, rect.height * 0.72));
        const media = hero.querySelector<HTMLElement>(".gm-hero__media");
        const content = hero.querySelector<HTMLElement>(".gm-hero__content");
        const orbit = hero.querySelector<HTMLElement>(".gm-hero__orbit");
        if (media) media.style.transform = `translate3d(0, ${p * 78}px, 0) scale(${1.045 + p * 0.08})`;
        if (content) {
          content.style.transform = `translate3d(0, ${p * -64}px, 0)`;
          content.style.opacity = String(1 - p * 0.78);
        }
        if (orbit) orbit.style.transform = `translate3d(0, ${p * -35}px, 0) rotate(${p * 18}deg)`;
      }

      const section = servicesRef.current;
      const track = trackRef.current;
      if (section && track && window.innerWidth > 900) {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const p = clamp(-rect.top / travel);
        const maxX = Math.max(0, track.scrollWidth - window.innerWidth + 120);
        track.style.transform = `translate3d(${-p * maxX}px, 0, 0)`;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      }
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [heroRef, servicesRef, trackRef, progressRef]);
}

function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setShow(false), reduced ? 120 : 1050);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <div className="gm-intro">
      <div className="gm-intro__brand"><Brand /></div>
      <div className="gm-intro__line" />
      <span>Creative office · Fortaleza, Brasil</span>
    </div>
  );
}

function Header({ onProposal, onCareer }: { onProposal: () => void; onCareer: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="gm-header">
        <a href="#inicio" className="gm-header__brand" aria-label="Glass Maind — início">
          <Brand compact light />
        </a>
        <div className="gm-header__actions">
          <button className="gm-header__project" type="button" onClick={onProposal}>
            iniciar projeto <ArrowUpRight size={14} />
          </button>
          <button className="gm-menu-button" type="button" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu size={19} />
          </button>
        </div>
      </header>

      <div className={`gm-menu ${open ? "gm-menu--open" : ""}`} aria-hidden={!open}>
        <div className="gm-menu__top">
          <Brand compact />
          <button type="button" onClick={close} aria-label="Fechar menu"><X size={22} /></button>
        </div>
        <nav className="gm-menu__nav" aria-label="Navegação principal">
          <a href="#inicio" onClick={close}><span>01</span>Início<ArrowDownRight /></a>
          <a href="#sobre" onClick={close}><span>02</span>Sobre<ArrowDownRight /></a>
          <a href="#servicos" onClick={close}><span>03</span>Serviços<ArrowDownRight /></a>
          <a href="#metodo" onClick={close}><span>04</span>Método<ArrowDownRight /></a>
          <Link to="/loja" onClick={close}><span>05</span>Loja<ArrowDownRight /></Link>
          <a href="#contato" onClick={close}><span>06</span>Contato<ArrowDownRight /></a>
        </nav>
        <div className="gm-menu__footer">
          <button type="button" onClick={() => { close(); onCareer(); }}>Trabalhe conosco</button>
          <a href={CONTACT.instagram.url} target="_blank" rel="noreferrer">Instagram ↗</a>
        </div>
      </div>
    </>
  );
}

function Hero({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section ref={heroRef} id="inicio" className="gm-hero">
      <div className="gm-hero__media">
        <img src={workBranding} alt="Projeto de identidade visual da Glass Maind" />
        <div className="gm-hero__veil" />
      </div>
      <div className="gm-hero__grid" aria-hidden="true" />
      <div className="gm-hero__content">
        <div className="gm-hero__eyebrow">
          <span>Creative agency</span>
          <span>Brand · Digital · Experience</span>
        </div>
        <div className="gm-hero__line gm-hero__line--one"><h1>GLASS</h1></div>
        <div className="gm-hero__line gm-hero__line--two"><h1>MAIND</h1></div>
        <div className="gm-hero__bottom">
          <p>Criamos identidades e experiências digitais para marcas que querem ser reconhecidas antes mesmo de serem explicadas.</p>
          <a href="#sobre">explore <ArrowDownRight size={17} /></a>
        </div>
      </div>
      <div className="gm-hero__orbit"><img src="/brand-symbol.svg" alt="" aria-hidden="true" /></div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="sobre" className="gm-light gm-manifesto">
      <div className="gm-kicker"><span>01</span><span>Sobre a Glass Maind</span></div>
      <div className="gm-manifesto__headline" data-gm-reveal>
        <div>ESTRATÉGIA</div>
        <div className="gm-outline">COM FORMA</div>
      </div>
      <div className="gm-manifesto__copy">
        <img src="/brand-symbol.svg" alt="" aria-hidden="true" data-gm-reveal />
        <p data-gm-reveal>Design não é decoração. É percepção, posicionamento e direção. A Glass Maind conecta estratégia, identidade e experiência para construir marcas com presença real.</p>
      </div>
    </section>
  );
}

function Services({
  sectionRef,
  trackRef,
  progressRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="gm-services"
      style={{ "--gm-service-count": SERVICES.length } as CSSProperties}
    >
      <div className="gm-services__sticky">
        <div className="gm-services__head">
          <div className="gm-kicker gm-kicker--dark"><span>02</span><span>O que fazemos</span></div>
          <p>Uma estrutura criativa completa para transformar posicionamento em imagem, interface e presença.</p>
        </div>
        <div ref={trackRef} className="gm-services__track">
          {SERVICES.map((service, index) => (
            <article key={service.title} className="gm-service-card">
              <div className="gm-service-card__media">
                <img src={service.image} alt="" loading={index > 1 ? "lazy" : "eager"} />
                <div />
              </div>
              <span className="gm-service-card__number">{service.n}</span>
              <div className="gm-service-card__content">
                <span>{service.eyebrow}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <a href={whatsappLink(service.message)} target="_blank" rel="noreferrer">
                  conversar sobre este serviço <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="gm-services__progress"><div ref={progressRef} /></div>
      </div>
    </section>
  );
}

function Method() {
  const steps = [
    ["01", "Entender", "Contexto, objetivo, público e o espaço que a marca precisa ocupar."],
    ["02", "Direcionar", "Transformamos diagnóstico em conceito, linguagem e sistema visual."],
    ["03", "Construir", "Design, interfaces e peças ganham forma com consistência e intenção."],
    ["04", "Ativar", "A identidade encontra o mundo em pontos de contato digitais e físicos."],
  ];

  return (
    <section id="metodo" className="gm-light gm-method">
      <div className="gm-kicker"><span>03</span><span>Nosso método</span></div>
      <div className="gm-method__title" data-gm-reveal><h2>CLAREZA ANTES<br />DO IMPACTO.</h2></div>
      <div className="gm-method__list">
        {steps.map(([n, title, text]) => (
          <article key={n} data-gm-reveal>
            <span>{n}</span><h3>{title}</h3><p>{text}</p><ArrowDownRight />
          </article>
        ))}
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="gm-statement">
      <img className="gm-statement__symbol" src="/brand-symbol.svg" alt="" aria-hidden="true" />
      <p data-gm-reveal>Marcas memoráveis não pedem atenção.</p>
      <h2 data-gm-reveal>ELAS CRIAM<br />GRAVIDADE.</h2>
      <div className="gm-statement__meta"><span>Branding</span><span>Digital</span><span>Experience</span><span>Strategy</span></div>
    </section>
  );
}

function Contact({ onProposal, onCareer }: { onProposal: () => void; onCareer: () => void }) {
  return (
    <section id="contato" className="gm-light gm-contact">
      <div className="gm-kicker"><span>04</span><span>Próximo projeto</span></div>
      <div className="gm-contact__main">
        <p data-gm-reveal>Se a sua marca mudou, cresceu ou precisa finalmente parecer do tamanho que é, a conversa começa aqui.</p>
        <button type="button" className="gm-contact__cta" onClick={onProposal} data-gm-reveal>
          <span>VAMOS CRIAR</span><ArrowUpRight />
        </button>
      </div>
      <footer className="gm-footer">
        <div className="gm-footer__brand"><Brand /></div>
        <div className="gm-footer__info">
          <span>{CONTACT.address}</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          <a href={CONTACT.instagram.url} target="_blank" rel="noreferrer">Instagram ↗</a>
          <Link to="/loja">Loja ↗</Link>
          <button type="button" onClick={onCareer}>Trabalhe conosco ↗</button>
        </div>
      </footer>
    </section>
  );
}

function Index() {
  const [proposalOpen, setProposalOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useMotionSystem(heroRef, servicesRef, trackRef, progressRef);

  return (
    <main className="gm-site">
      <Intro />
      <Header onProposal={() => setProposalOpen(true)} onCareer={() => setCareerOpen(true)} />
      <Hero heroRef={heroRef} />
      <Manifesto />
      <Services sectionRef={servicesRef} trackRef={trackRef} progressRef={progressRef} />
      <Method />
      <Statement />
      <Contact onProposal={() => setProposalOpen(true)} onCareer={() => setCareerOpen(true)} />
      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
      <CareerModal open={careerOpen} onClose={() => setCareerOpen(false)} />
    </main>
  );
}
