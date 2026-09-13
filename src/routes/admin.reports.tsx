import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Filter,
  Inbox,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

type Group = "all" | "new" | "analysis" | "waiting" | "progress" | "done";

type DemoReport = {
  code: string;
  project: string;
  title: string;
  description: string;
  status: string;
  group: Group;
  priority: "Baixa" | "Normal" | "Alta" | "Urgente";
  category: string;
  age: string;
  quote?: string;
};

const demoReports: DemoReport[] = [
  {
    code: "RPT-DEMO01",
    project: "JR Clinic",
    title: "Editar reserva de sala após agendamento",
    description: "Cliente precisa alterar dados de uma reserva já criada sem refazer o processo.",
    status: "Em análise",
    group: "analysis",
    priority: "Normal",
    category: "Ajuste simples",
    age: "agora",
  },
  {
    code: "RPT-DEMO02",
    project: "JR Clinic",
    title: "Nova tela de comissão de funcionários",
    description: "Solicitação comercial que deve seguir para orçamento antes do desenvolvimento.",
    status: "Aguardando aprovação",
    group: "waiting",
    priority: "Alta",
    category: "Nova funcionalidade",
    age: "12 min",
    quote: "R$ 450,00",
  },
  {
    code: "RPT-DEMO03",
    project: "Cliente Exemplo",
    title: "Erro ao salvar fechamento do caixa",
    description: "Correção operacional sem cobrança adicional.",
    status: "Em andamento",
    group: "progress",
    priority: "Urgente",
    category: "Correção de erro",
    age: "31 min",
  },
];

const filters: Array<{ key: Group; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "new", label: "Novos" },
  { key: "analysis", label: "Análise" },
  { key: "waiting", label: "Aguardando" },
  { key: "progress", label: "Em andamento" },
  { key: "done", label: "Finalizados" },
];

function ReportsPage() {
  const [filter, setFilter] = useState<Group>("all");
  const [query, setQuery] = useState("");

  const reports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoReports.filter((report) => {
      const matchesGroup = filter === "all" || report.group === filter;
      const matchesQuery = !q || [report.code, report.project, report.title, report.description].some((value) => value.toLowerCase().includes(q));
      return matchesGroup && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
            <ShieldCheck className="h-3.5 w-3.5" />
            Central operacional
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Reports</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
            Triagem, atendimento, orçamento e aprovação de solicitações dos sistemas dos clientes em um único fluxo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-line bg-soft px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">API externa</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-ink">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ativa
            </div>
          </div>
          <div className="rounded-xl border border-line bg-soft px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">Orçamentos</div>
            <div className="mt-1 text-sm font-medium text-ink">Versionados</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Inbox className="h-4 w-4" />} label="Novos" value="0" note="Aguardando triagem" />
        <Metric icon={<Clock3 className="h-4 w-4" />} label="Em análise" value="1" note="Classificação interna" />
        <Metric icon={<BadgeDollarSign className="h-4 w-4" />} label="Orçamentos" value="1" note="Aguardando cliente" />
        <Metric icon={<Wrench className="h-4 w-4" />} label="Em andamento" value="1" note="Execução liberada" />
      </section>

      <section className="rounded-2xl border border-line bg-soft/40 p-1">
        <div className="flex flex-col gap-3 rounded-[14px] bg-paper p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${filter === item.key ? "bg-ink text-paper" : "text-dim hover:bg-soft hover:text-ink"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 lg:w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar report, projeto ou código"
                className="h-10 w-full rounded-xl border border-line bg-paper pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-dim focus:border-ink/40"
              />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-dim transition hover:text-ink" aria-label="Filtros avançados">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          {reports.map((report) => (
            <article key={report.code} className="rounded-2xl border border-line bg-paper p-5 transition hover:border-ink/25 hover:shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
                    <span>{report.project}</span>
                    <span className="text-ink/20">•</span>
                    <span>{report.code}</span>
                    <span className="text-ink/20">•</span>
                    <span>{report.age}</span>
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-ink">{report.title}</h2>
                  <p className="mt-1.5 max-w-3xl text-sm leading-6 text-dim">{report.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Tag>{report.category}</Tag>
                    <Tag>{report.priority}</Tag>
                    {report.quote && <Tag>{report.quote}</Tag>}
                  </div>
                </div>
                <div className="shrink-0 rounded-full border border-line bg-soft px-3 py-1.5 text-xs font-medium text-ink">{report.status}</div>
              </div>
            </article>
          ))}

          {reports.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-16 text-center">
              <Inbox className="mx-auto h-7 w-7 text-dim" />
              <div className="mt-3 text-sm font-medium text-ink">Nenhum report encontrado</div>
              <p className="mt-1 text-xs text-dim">Ajuste os filtros ou a busca para continuar.</p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-ink p-5 text-paper">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/55">
              <Sparkles className="h-3.5 w-3.5" /> Fluxo comercial
            </div>
            <h3 className="mt-3 text-lg font-semibold">Correção ou nova função?</h3>
            <p className="mt-2 text-sm leading-6 text-paper/65">
              Classifique o pedido. Correções seguem direto para execução; melhorias comerciais geram orçamento e aguardam aprovação do cliente.
            </p>
            <div className="mt-5 space-y-3 text-xs">
              <FlowStep icon={<AlertCircle className="h-3.5 w-3.5" />} label="Analisar solicitação" />
              <FlowStep icon={<BadgeDollarSign className="h-3.5 w-3.5" />} label="Gerar orçamento quando necessário" />
              <FlowStep icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Aprovação libera execução" />
              <FlowStep icon={<MessageSquareText className="h-3.5 w-3.5" />} label="Histórico e mensagens centralizados" />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-soft/50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">Integração</div>
            <div className="mt-3 text-sm font-medium text-ink">Fluxa Reports API</div>
            <p className="mt-1 text-xs leading-5 text-dim">
              A estrutura do banco e a API por Project Key já estão preparadas. O próximo passo é conectar este painel à autenticação do Supabase e instalar o widget nos projetos dos clientes.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-center justify-between text-dim">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">{label}</span>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs text-dim">{note}</div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line bg-soft px-2.5 py-1 text-[10px] font-medium text-dim">{children}</span>;
}

function FlowStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-paper/75">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/15 bg-paper/5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
