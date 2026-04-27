/* Minimalist branding mockups for hero vertical marquee */
export type ShowcaseItem = {
  id: string;
  kind: "social" | "ui" | "card" | "type";
  label: string;
  meta?: string;
};

export const HERO_SHOWCASE: ShowcaseItem[] = [
  { id: "ig-post", kind: "social", label: "@glassmainnd", meta: "Post · 1:1" },
  { id: "dash", kind: "ui", label: "Dashboard", meta: "Analytics · v2" },
  { id: "card", kind: "card", label: "Glass Maind", meta: "Business Card" },
  { id: "type", kind: "type", label: "Aa", meta: "Display / Sans" },
  { id: "ig-story", kind: "social", label: "Story", meta: "9:16 · Reels" },
  { id: "ui-app", kind: "ui", label: "Mobile App", meta: "iOS · UI Kit" },
  { id: "layout", kind: "type", label: "Grid 12", meta: "Editorial Layout" },
];

export function HeroShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <div className="relative rounded-2xl border border-ink/10 bg-paper/70 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)] overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-500">
      {/* top meta strip */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-ink/5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
        </div>
        <span className="text-[9px] uppercase tracking-[0.25em] text-ink/40">{item.meta}</span>
      </div>

      {/* body — minimalist mockup per kind */}
      <div className="p-4">
        {item.kind === "social" && (
          <div className="aspect-square w-full rounded-md bg-gradient-to-br from-ink/[0.04] to-ink/[0.10] flex flex-col justify-between p-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-ink/80" />
              <div className="flex flex-col gap-1">
                <span className="h-1.5 w-16 rounded-full bg-ink/40" />
                <span className="h-1 w-10 rounded-full bg-ink/20" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="h-1.5 w-20 rounded-full bg-ink/30" />
                <span className="h-1 w-14 rounded-full bg-ink/15" />
              </div>
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-sm border border-ink/30" />
                <span className="h-3 w-3 rounded-sm border border-ink/30" />
              </div>
            </div>
          </div>
        )}
        {item.kind === "ui" && (
          <div className="rounded-md bg-ink/[0.03] p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="h-1.5 w-14 rounded-full bg-ink/40" />
              <span className="h-1.5 w-6 rounded-full bg-ink/20" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 rounded bg-paper border border-ink/10 flex items-end p-1">
                  <span
                    className="block w-full rounded-sm bg-ink/60"
                    style={{ height: `${30 + i * 18}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <span className="block h-1 w-full rounded-full bg-ink/15" />
              <span className="block h-1 w-3/4 rounded-full bg-ink/10" />
              <span className="block h-1 w-1/2 rounded-full bg-ink/10" />
            </div>
          </div>
        )}
        {item.kind === "card" && (
          <div className="aspect-[1.7/1] w-full rounded-md bg-ink text-paper p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-paper/70">
                <span className="block h-1.5 w-1.5 border border-paper/90 rotate-45" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-paper/60">2025</span>
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-tight">{item.label}</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-paper/50 mt-0.5">
                Marketing Studio
              </div>
            </div>
          </div>
        )}
        {item.kind === "type" && (
          <div className="rounded-md bg-ink/[0.03] p-4 flex items-center justify-between">
            <span
              className="text-ink/85 font-medium leading-none"
              style={{ fontSize: "44px", letterSpacing: "-0.04em" }}
            >
              {item.label}
            </span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-ink/40">Type</span>
              <span className="h-px w-10 bg-ink/30" />
              <span className="text-[10px] text-ink/50">A–Z · 0–9</span>
            </div>
          </div>
        )}
      </div>

      {/* footer label */}
      <div className="px-4 pb-3 pt-1 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink/50">{item.label}</span>
        <span className="h-1 w-1 rounded-full bg-ink/40" />
      </div>
    </div>
  );
}
