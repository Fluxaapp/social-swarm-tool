import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, ArrowLeft, Check, Upload, FileText } from "lucide-react";
import { mailtoLink } from "@/lib/contact";

interface CareerModalProps {
  open: boolean;
  onClose: () => void;
}

const JOBS = [
  { id: "designer", title: "Designer Gráfico" },
  { id: "social-media", title: "Social Media" },
  { id: "video-editor", title: "Editor de Vídeo" },
  { id: "traffic-manager", title: "Gestão de Tráfego" },
  { id: "web-dev", title: "Desenvolvedor Web" },
  { id: "talent-pool", title: "Banco de Talentos" },
];

interface CareerFormData {
  jobId: string;
  jobTitle: string;
  name: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  experience: string;
  portfolio: string;
  availability: string;
  message: string;
  file: File | null;
}

export function CareerModal({ open, onClose }: CareerModalProps) {
  const [step, setStep] = useState(0); // 0: Jobs list, 1: Form, 2: Success
  const [data, setData] = useState<CareerFormData>({
    jobId: "",
    jobTitle: "",
    name: "",
    whatsapp: "",
    email: "",
    city: "",
    address: "",
    experience: "",
    portfolio: "",
    availability: "",
    message: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
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

  const selectJob = (job: typeof JOBS[0]) => {
    setData((d) => ({ ...d, jobId: job.id, jobTitle: job.title }));
    setStep(1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (allowed.includes(file.type)) {
        setData((d) => ({ ...d, file }));
      } else {
        alert("Por favor, anexe apenas arquivos PDF, DOC ou DOCX.");
      }
    }
  };

  const canSubmit = () => {
    return (
      data.name.trim().length > 1 &&
      data.whatsapp.trim().length > 5 &&
      /\S+@\S+\.\S+/.test(data.email) &&
      data.jobTitle !== "" &&
      data.file !== null
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);

    try {
      const subject = `Nova candidatura — ${data.jobTitle} — ${data.name}`;
      const body = [
        `Nome completo: ${data.name}`,
        `WhatsApp: ${data.whatsapp}`,
        `E-mail: ${data.email}`,
        `Cidade/Estado: ${data.city}`,
        `Endereço: ${data.address}`,
        `Vaga escolhida: ${data.jobTitle}`,
        `Experiência profissional: ${data.experience}`,
        `Portfólio/Links: ${data.portfolio}`,
        `Pretensão/Disponibilidade: ${data.availability}`,
        `Mensagem adicional: ${data.message}`,
        "",
        `[Currículo anexado: ${data.file?.name}]`,
        "Nota: O arquivo não pode ser enviado diretamente via mailto, mas o candidato informou que o anexou.",
      ].join("\n");

      // Open email client
      const url = mailtoLink(subject, body);
      window.location.href = url;
      
      // Move to success step
      setStep(2);
    } catch (error) {
      alert("Não foi possível enviar sua candidatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 proposal-overlay" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md proposal-backdrop" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[4px] bg-paper text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] proposal-panel flex flex-col">
        {/* Top bar */}
        <div className="relative px-6 md:px-10 pt-6 md:pt-8 pb-5 border-b border-line bg-paper">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-dim">
                <span className="h-px w-6 bg-ink/40" />
                Trabalhe conosco
              </div>
              <h2 className="mt-3 font-medium text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.025em]">
                {step === 0 ? "Vagas disponíveis" : step === 1 ? data.jobTitle : "Candidatura enviada"}
              </h2>
              <p className="mt-2 text-sm text-dim">
                {step === 0 
                  ? "Escolha uma vaga disponível e envie suas informações." 
                  : step === 1
                  ? "Preencha seus dados para completar sua candidatura."
                  : "Recebemos suas informações com sucesso."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/60 hover:text-ink hover:border-ink/40 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
          {step === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JOBS.map((job) => (
                <button
                  key={job.id}
                  onClick={() => selectJob(job)}
                  className="group flex items-center justify-between p-5 rounded-[2px] border border-line bg-paper hover:border-ink/40 hover:bg-soft transition-all text-left"
                >
                  <span className="font-medium text-ink">{job.title}</span>
                  <span className="text-[12px] font-medium text-ink/60 group-hover:text-ink flex items-center gap-1">
                    Candidatar-se <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          ) : step === 1 ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nome completo *">
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="form-input"
                    placeholder="Seu nome completo"
                  />
                </Field>
                <Field label="WhatsApp *">
                  <input
                    type="text"
                    value={data.whatsapp}
                    onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                    className="form-input"
                    placeholder="(00) 00000-0000"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="E-mail *">
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="form-input"
                    placeholder="seu@email.com"
                  />
                </Field>
                <Field label="Cidade/Estado">
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                    className="form-input"
                    placeholder="Cidade - UF"
                  />
                </Field>
              </div>

              <Field label="Endereço">
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="form-input"
                  placeholder="Seu endereço completo"
                />
              </Field>

              <Field label="Experiência profissional">
                <textarea
                  value={data.experience}
                  onChange={(e) => setData({ ...data, experience: e.target.value })}
                  className="form-input min-h-[100px] py-3"
                  placeholder="Conte um pouco sobre sua trajetória"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Portfólio ou Links">
                  <input
                    type="text"
                    value={data.portfolio}
                    onChange={(e) => setData({ ...data, portfolio: e.target.value })}
                    className="form-input"
                    placeholder="Instagram, Behance, LinkedIn..."
                  />
                </Field>
                <Field label="Pretensão ou Disponibilidade">
                  <input
                    type="text"
                    value={data.availability}
                    onChange={(e) => setData({ ...data, availability: e.target.value })}
                    className="form-input"
                    placeholder="Qual sua disponibilidade?"
                  />
                </Field>
              </div>

              <Field label="Mensagem adicional (opcional)">
                <input
                  type="text"
                  value={data.message}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                  className="form-input"
                  placeholder="Algo mais que gostaria de nos contar?"
                />
              </Field>

              <Field label="Anexar currículo (PDF, DOC, DOCX) *">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-1 flex items-center gap-3 p-4 rounded-[2px] border border-dashed transition-all cursor-pointer ${
                    data.file ? "border-ink bg-soft" : "border-line hover:border-ink/40 bg-paper"
                  }`}
                >
                  <div className={`h-10 w-10 flex items-center justify-center rounded-full ${data.file ? "bg-ink text-paper" : "bg-soft text-ink/40"}`}>
                    {data.file ? <FileText className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-ink">
                      {data.file ? data.file.name : "Clique para selecionar o arquivo"}
                    </p>
                    <p className="text-[11px] text-dim">
                      {data.file ? `${(data.file.size / 1024).toFixed(1)} KB` : "Apenas PDF, DOC ou DOCX"}
                    </p>
                  </div>
                  {data.file && <Check className="h-4 w-4 text-ink" />}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />
              </Field>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center text-center max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
              <div className="h-16 w-16 bg-ink text-paper rounded-full flex items-center justify-center mb-6 shadow-xl shadow-ink/10">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">Tudo pronto!</h3>
              <p className="text-sm text-dim leading-relaxed mb-6">
                Sua candidatura foi enviada. Aguarde o retorno da nossa equipe pelo WhatsApp em até <strong>3 dias úteis</strong>.
              </p>
              <p className="text-[12px] text-dim/60 italic">
                Verifique se o seu e-mail de confirmação chegou em sua caixa de entrada (ou spam).
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 md:px-10 py-5 border-t border-line bg-paper flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => step === 1 ? setStep(0) : onClose()}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/70 hover:text-ink transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 2 ? "Fechar" : step === 1 ? "Voltar" : "Fechar"}
          </button>

          {step === 1 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
              className={`group btn-shine inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 transition-all ${
                canSubmit() && !isSubmitting
                  ? "bg-ink text-paper hover:scale-[1.02]"
                  : "bg-soft text-ink/40 cursor-not-allowed"
              }`}
            >
              <span className="text-[13px] font-medium">Enviar candidatura</span>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                canSubmit() && !isSubmitting ? "bg-paper text-ink" : "bg-line text-ink/40"
              }`}>
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={onClose}
              className="bg-ink text-paper px-8 py-2.5 rounded-full text-[13px] font-medium hover:scale-[1.02] transition-all"
            >
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.25em] text-dim mb-2">
        {label}
      </div>
      {children}
    </label>
  );
}
