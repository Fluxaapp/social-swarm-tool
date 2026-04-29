import { useEffect, useState } from "react";

const IDEAS = [
  "Estratégias de marca",
  "Design orientado a conversão",
  "Experiências digitais",
  "Interfaces inteligentes",
  "Posicionamento premium",
  "Sistemas visuais escaláveis",
  "Performance e crescimento",
  "Arquitetura de marca",
  "Web design estratégico",
  "Otimização de presença digital",
];

const VISIBLE = 5; // itens visíveis simultaneamente
const INTERVAL = 2400;

export function HeroIdeasLoop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % IDEAS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Lista renderizada começa no item ativo, com offset para criar movimento vertical
  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (active + i) % IDEAS.length;
    return { idx, pos: i, text: IDEAS[idx] };
  });

  return (
    <div
      className="relative w-full select-none"
      aria-label="Capacidades em destaque"
    >
      {/* Label superior */}
      <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-dim mb-5">
        <span className="h-px w-6 bg-ink/30" />
        Pensamento em movimento
      </div>

      {/* Loop vertical */}
      <div
        className="relative h-[260px] md:h-[300px] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >
        <ul className="absolute inset-0 flex flex-col justify-center">
          {items.map(({ idx, pos, text }) => {
            const isActive = pos === Math.floor(VISIBLE / 2);
            const distance = Math.abs(pos - Math.floor(VISIBLE / 2));
            const opacity = isActive ? 1 : Math.max(0.18, 0.5 - distance * 0.14);
            return (
              <li
                key={`${idx}-${pos}`}
                className="flex items-center gap-3 h-[52px] md:h-[58px] transition-all duration-700 ease-in-out"
                style={{
                  opacity,
                  transform: `translateY(${(pos - Math.floor(VISIBLE / 2)) * 4}px)`,
                }}
              >
                {/* Indicador (seta) — só no ativo */}
                <span
                  className={`inline-flex items-center justify-center w-5 transition-all duration-500 ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                  aria-hidden
                >
                  <span className="block h-px w-4 bg-ink idea-arrow" />
                </span>

                <span
                  className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                    isActive
                      ? "text-ink font-medium idea-glow"
                      : "text-dim font-normal"
                  }`}
                  style={{
                    fontSize: isActive
                      ? "clamp(1.25rem, 2vw, 1.6rem)"
                      : "clamp(1rem, 1.5vw, 1.2rem)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Progresso fino */}
      <div className="mt-4 flex items-center gap-2">
        <div className="relative h-px flex-1 bg-ink/10 overflow-hidden">
          <div
            key={active}
            className="absolute inset-y-0 left-0 bg-ink/70 idea-progress"
          />
        </div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-dim tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(IDEAS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default HeroIdeasLoop;
