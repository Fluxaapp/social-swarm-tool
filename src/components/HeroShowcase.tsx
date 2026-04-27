import { useEffect, useState } from "react";

import heroModel1 from "@/assets/hero-model-1.jpg";
import heroModel2 from "@/assets/hero-model-2.jpg";
import heroBrand1 from "@/assets/hero-brand-1.jpg";
import heroBrand2 from "@/assets/hero-brand-2.jpg";

/**
 * Editorial immersive showcase for the hero — full-bleed images that
 * cross-fade with subtle blur + zoom. No cards, no carousel chrome.
 */
const HERO_IMAGES = [
  { src: heroModel1, alt: "Modelo editorial — campanha premium" },
  { src: heroModel2, alt: "Modelo editorial — campanha premium" },
  { src: heroBrand1, alt: "Identidade de marca — material gráfico" },
  { src: heroBrand2, alt: "Editorial premium — material de marketing" },
];

const INTERVAL_MS = 4800;

export function HeroImmersiveShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HERO_IMAGES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {HERO_IMAGES.map((img, i) => {
        const isActive = i === active;
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className={[
              "absolute inset-0 h-full w-full object-cover will-change-transform",
              "transition-all duration-[2200ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isActive
                ? "opacity-[0.55] scale-100 blur-0"
                : "opacity-0 scale-[1.06] blur-[6px]",
            ].join(" ")}
            style={{
              animation: isActive ? "heroSlowZoom 7s ease-in-out forwards" : undefined,
            }}
          />
        );
      })}

      {/* Soft gradient overlay — blends image into page background, protects text contrast on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-soft via-soft/70 to-soft/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-soft/40 via-transparent to-soft/60" />

      {/* Subtle film grain / vignette for editorial feel */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 80% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
