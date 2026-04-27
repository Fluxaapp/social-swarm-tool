import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `end` once the element enters the viewport.
 * Returns [ref, displayValue].
 *
 * - `end`: final number (e.g. 47, 20, 3)
 * - `duration`: animation length in ms
 * - `decimals`: how many decimals to show
 */
export function useCountUp(
  end: number,
  { duration = 1800, decimals = 0 }: { duration?: number; decimals?: number } = {},
) {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(end * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setValue(end);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return [ref, display] as const;
}
