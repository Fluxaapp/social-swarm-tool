import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Check, Send } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

interface ProposalModalProps {
  open: boolean;
  onClose: () => void;
}

const SERVICES = [
  "Identidade Visual / Branding",
  "Social Media Design",
  "Marketing Digital",
  "Gestão de Marca",
  "Materiais Gráficos",
  "Direção Criativa",
  "Site / Landing Page",
];

const BUDGETS = [
  "Até R$ 2.000",
  "R$ 2.000 — R$ 5.000",
  "R$ 5.000 — R$ 10.000",
  "R$ 10.000 — R$ 25.000",
  "Acima de R$ 25.000",
];

const TIMELINES = [
  "Urgente · até 7 dias",
  "Em até 30 dias",
  "1 a 3 meses",
  "Sem pressa",
];

interface FormData {
  name: string;
  email: string;
  company: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
}

const STEPS = [
  { id: 0, label: "Sobre você", tech: "step://identification" },
  { id: 1, label: "Serviços", tech: "module://services" },
  { id: 2, label: "Investimento", tech: "scope://budget" },
  { id: 3, label: "Detalhes", tech: "brief://final" },
] as const;

export function ProposalModal({ open, onClose }: ProposalModalProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    services: [],
    budget: "",
    timeline: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const toggleService = (s: string) => {
    setData((d) => ({
      ...d,
      services: d.services.includes(s)
        ? d.services.filter((x) => x !== s)
        : [...d.services, s],
    }));
  };

  const canAdvance = () => {
    if (step === 0) return data.name.trim().length > 1 && /\S+@\S+\.\S+/.test(data.email);
    if (step === 1) return data.services.length > 0;
    if (step === 2) return data.budget !== "" && data.timeline !== "";
    if (step === 3) return data.description.trim().length > 5;
    return false;
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const buildMessage = () => {
    const lines = [
      "*Nova solicitação de proposta — Glass Maind*",
      "",
      `*Nome:* ${data.name}`,
      `*E-mail:* ${data.email}`,
      data.company ? `*Empresa:* ${data.company}` : null,
      "",
      `*Serviços de interesse:*`,
      ...data.services.map((s) => `• ${s}`),
      "",
      `*Investimento:* ${data.budget}`,
      `*Prazo desejado:* ${data.timeline}`,
      "",
      `*Sobre o projeto:*`,
      data.description,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const sendWhatsApp = () => {
    const url = whatsappLink(buildMessage());
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 proposal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md proposal-backdrop"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[4px] bg-paper text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] proposal-panel flex flex-col">
        {/* Top bar */}
        <div className="relative px-6 md:px-10 pt-6 md:pt-8 pb-5 border-b border-line bg-paper">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-dim">
                <span className="h-px w-6 bg-ink/40" />
                Solicitar proposta
                <span className="font-mono text-ink/40 hidden sm:inline">
                  · {STEPS[step].tech}
                </span>
              </div>
              <h2
                id="proposal-title"
                className="mt-3 font-medium text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.025em]"
              >
                {STEPS[step].label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/60 hover:text-ink hover:border-ink/40 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`group flex-1 flex items-center gap-2 transition-all ${
                    i > step ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium transition-all ${
                      done
                        ? "bg-ink text-paper"
                        : current
                        ? "bg-ink text-paper ring-4 ring-ink/10"
                        : "bg-soft text-ink/40 border border-line"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span
                    className={`hidden md:block h-px flex-1 transition-all ${
                      done ? "bg-ink" : "bg-line"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
          <div key={step} className="proposal-step">
            {step === 0 && (
              <div className="space-y-5 max-w-xl">
                <Field label="Seu nome *">
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Como podemos te chamar?"
                    maxLength={80}
                    className="form-input"
                  />
                </Field>
                <Field label="E-mail *">
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="seu@email.com"
                    maxLength={120}
                    className="form-input"
                  />
                </Field>
                <Field label="Empresa / Marca (opcional)">
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => setData({ ...data, company: e.target.value })}
                    placeholder="Nome do seu negócio"
                    maxLength={80}
                    className="form-input"
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-sm text-dim mb-5">
                  Selecione um ou mais serviços. Você pode escolher quantos
                  precisar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICES.map((s) => {
                    const active = data.services.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        className={`group text-left p-4 rounded-[2px] border transition-all duration-300 flex items-center gap-3 ${
                          active
                            ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]"
                            : "bg-paper text-ink border-line hover:border-ink/40 hover:bg-soft"
                        }`}
                      >
                        <span
                          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-all ${
                            active
                              ? "bg-paper border-paper text-ink"
                              : "border-ink/30 group-hover:border-ink/60"
                          }`}
                        >
                          {active && <Check className="h-3 w-3" />}
                        </span>
                        <span className="text-[14px] font-medium">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-dim mb-4 flex items-center gap-3">
                    <span className="h-px w-6 bg-ink/40" />
                    Investimento previsto
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BUDGETS.map((b) => {
                      const active = data.budget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setData({ ...data, budget: b })}
                          className={`text-left p-4 rounded-[2px] border transition-all ${
                            active
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper border-line hover:border-ink/40"
                          }`}
                        >
                          <span className="text-[14px] font-medium">{b}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-dim mb-4 flex items-center gap-3">
                    <span className="h-px w-6 bg-ink/40" />
                    Prazo desejado
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIMELINES.map((t) => {
                      const active = data.timeline === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setData({ ...data, timeline: t })}
                          className={`text-left p-4 rounded-[2px] border transition-all ${
                            active
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper border-line hover:border-ink/40"
                          }`}
                        >
                          <span className="text-[14px] font-medium">{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <Field label="Conte sobre o projeto *">
                  <textarea
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                    placeholder="Sobre o que é o seu negócio? Qual o objetivo do projeto? O que você espera alcançar?"
                    rows={7}
                    maxLength={1500}
                    className="form-input resize-none"
                  />
                  <div className="mt-2 text-[11px] text-dim text-right">
                    {data.description.length}/1500
                  </div>
                </Field>

                {/* Resumo */}
                <div className="rounded-[2px] border border-line bg-soft p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-dim mb-3">
                    Resumo
                  </div>
                  <dl className="space-y-2 text-[13px]">
                    <Row k="Nome" v={data.name || "—"} />
                    <Row k="E-mail" v={data.email || "—"} />
                    {data.company && <Row k="Empresa" v={data.company} />}
                    <Row
                      k="Serviços"
                      v={data.services.join(", ") || "—"}
                    />
                    <Row k="Investimento" v={data.budget || "—"} />
                    <Row k="Prazo" v={data.timeline || "—"} />
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 md:px-10 py-5 border-t border-line bg-paper flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className={`inline-flex items-center gap-2 text-[13px] font-medium transition-all ${
              step === 0
                ? "text-ink/30 cursor-not-allowed"
                : "text-ink/70 hover:text-ink"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance()}
              className={`inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 transition-all ${
                canAdvance()
                  ? "bg-ink text-paper hover:scale-[1.02]"
                  : "bg-soft text-ink/40 cursor-not-allowed"
              }`}
            >
              <span className="text-[13px] font-medium">Continuar</span>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                  canAdvance() ? "bg-paper text-ink" : "bg-line text-ink/40"
                }`}
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={sendWhatsApp}
              disabled={!canAdvance()}
              className={`group btn-shine inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 transition-all ${
                canAdvance()
                  ? "bg-ink text-paper hover:scale-[1.02]"
                  : "bg-soft text-ink/40 cursor-not-allowed"
              }`}
            >
              <span className="text-[13px] font-medium">Enviar pelo WhatsApp</span>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 ${
                  canAdvance()
                    ? "bg-paper text-ink group-hover:rotate-12"
                    : "bg-line text-ink/40"
                }`}
              >
                <Send className="h-3.5 w-3.5" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.25em] text-dim mb-2">
        {label}
      </div>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="text-dim text-[11px] uppercase tracking-[0.2em] w-28 shrink-0 pt-0.5">
        {k}
      </dt>
      <dd className="text-ink flex-1">{v}</dd>
    </div>
  );
}
