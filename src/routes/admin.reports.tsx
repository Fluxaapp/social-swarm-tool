import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeDollarSign,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Filter,
  Inbox,
  KeyRound,
  Loader2,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import {
  addReportMessage,
  createProject,
  createProjectIntegration,
  createQuote,
  createReport,
  formatCurrency,
  getReportDetail,
  listIntegrations,
  listProjects,
  listReports,
  revokeProjectIntegration,
  sendQuote,
  setQuoteDecision,
  slugify,
  updateReport,
  type BillingTreatment,
  type Project,
  type ProjectIntegration,
  type Report,
  type ReportCategory,
  type ReportDetail,
  type ReportPriority,
  type ReportQuote,
  type ReportStatus,
} from "../lib/fluxa";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

type Group = "all" | "new" | "analysis" | "waiting" | "progress" | "done";
type PageTab = "inbox" | "projects";

const filters: Array<{ key: Group; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "new", label: "Novos" },
  { key: "analysis", label: "Análise" },
  { key: "waiting", label: "Aguardando" },
  { key: "progress", label: "Em andamento" },
  { key: "done", label: "Finalizados" },
];

const statusLabels: Record<ReportStatus, string> = {
  new: "Novo",
  analysis: "Em análise",
  waiting_client: "Aguardando cliente",
  waiting_quote: "Aguardando orçamento",
  waiting_approval: "Aguardando aprovação",
  quote_approved: "Orçamento aprovado",
  waiting_payment: "Aguardando pagamento",
  ready_to_start: "Pronto para iniciar",
  in_progress: "Em andamento",
  waiting_validation: "Aguardando validação",
  resolved: "Resolvido",
  archived: "Arquivado",
};

const categoryLabels: Record<ReportCategory, string> = {
  bug: "Correção de erro",
  simple_adjustment: "Ajuste simples",
  improvement: "Melhoria",
  new_feature: "Nova funcionalidade",
  question: "Dúvida",
  other: "Outro",
};

const priorityLabels: Record<ReportPriority, string> = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente",
};

const billingLabels: Record<Exclude<BillingTreatment, null>, string> = {
  included: "Incluso / sem cobrança",
  quote_required: "Requer orçamento",
};

function groupForStatus(status: ReportStatus): Exclude<Group, "all"> {
  if (status === "new") return "new";
  if (status === "analysis") return "analysis";
  if (
    [
      "waiting_client",
      "waiting_quote",
      "waiting_approval",
      "quote_approved",
      "waiting_payment",
      "ready_to_start",
    ].includes(status)
  )
    return "waiting";
  if (["in_progress", "waiting_validation"].includes(status)) return "progress";
  return "done";
}

function ReportsPage() {
  const [tab, setTab] = useState<PageTab>("inbox");
  const [reports, setReports] = useState<Report[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Group>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const loadBase = async () => {
    setLoading(true);
    setPageError("");
    try {
      const [nextReports, nextProjects] = await Promise.all([listReports(), listProjects()]);
      setReports(nextReports);
      setProjects(nextProjects);
      if (selectedReportId && !nextReports.some((item) => item.id === selectedReportId)) {
        setSelectedReportId(null);
        setDetail(null);
      }
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Não foi possível carregar os Reports.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDetail = async (reportId: string) => {
    setSelectedReportId(reportId);
    setDetailLoading(true);
    setPageError("");
    try {
      setDetail(await getReportDetail(reportId));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Não foi possível abrir o Report.");
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshDetail = async () => {
    if (!selectedReportId) return;
    const [nextDetail, nextReports] = await Promise.all([
      getReportDetail(selectedReportId),
      listReports(),
    ]);
    setDetail(nextDetail);
    setReports(nextReports);
  };

  const visibleReports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesGroup = filter === "all" || groupForStatus(report.status) === filter;
      const project = report.projects?.name ?? "";
      const matchesQuery =
        !q ||
        [report.public_code, project, report.title, report.description].some((value) =>
          value.toLowerCase().includes(q),
        );
      return matchesGroup && matchesQuery;
    });
  }, [filter, query, reports]);

  const metrics = useMemo(() => {
    const sentQuotes = reports
      .flatMap((report) => report.report_quotes ?? [])
      .filter((quote) => quote.status === "sent");
    return {
      new: reports.filter((report) => report.status === "new").length,
      analysis: reports.filter((report) => report.status === "analysis").length,
      quotes: sentQuotes.length,
      progress: reports.filter((report) =>
        ["in_progress", "waiting_validation"].includes(report.status),
      ).length,
    };
  }, [reports]);

  const runDetailAction = async (action: () => Promise<unknown>) => {
    setActionLoading(true);
    setPageError("");
    try {
      await action();
      await refreshDetail();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Não foi possível concluir a ação.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
            <ShieldCheck className="h-3.5 w-3.5" /> Central operacional
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Reports</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
            Triagem, atendimento, orçamento e aprovação das solicitações dos sistemas dos clientes
            em um único fluxo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-semibold text-paper transition hover:bg-ink/90"
          >
            <Plus className="h-3.5 w-3.5" /> Novo report
          </button>
          <button
            onClick={() => setTab(tab === "inbox" ? "projects" : "inbox")}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-xs font-semibold text-ink transition hover:bg-soft"
          >
            <Settings2 className="h-3.5 w-3.5" />{" "}
            {tab === "inbox" ? "Projetos & integrações" : "Voltar aos reports"}
          </button>
          <button
            onClick={loadBase}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-dim transition hover:text-ink disabled:opacity-50"
            aria-label="Atualizar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {pageError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

      {tab === "projects" ? (
        <ProjectsPanel projects={projects} onChanged={loadBase} />
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={<Inbox className="h-4 w-4" />}
              label="Novos"
              value={String(metrics.new)}
              note="Aguardando triagem"
            />
            <Metric
              icon={<Clock3 className="h-4 w-4" />}
              label="Em análise"
              value={String(metrics.analysis)}
              note="Classificação interna"
            />
            <Metric
              icon={<BadgeDollarSign className="h-4 w-4" />}
              label="Orçamentos"
              value={String(metrics.quotes)}
              note="Aguardando cliente"
            />
            <Metric
              icon={<Wrench className="h-4 w-4" />}
              label="Em andamento"
              value={String(metrics.progress)}
              note="Execução liberada"
            />
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
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-dim"
                  title="Filtros por status"
                >
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </section>

          <section
            className={`grid gap-5 ${selectedReportId ? "2xl:grid-cols-[minmax(0,0.9fr)_minmax(440px,0.7fr)]" : "2xl:grid-cols-[minmax(0,1fr)_360px]"}`}
          >
            <div className="space-y-3">
              {loading ? (
                <LoadingBlock label="Carregando reports..." />
              ) : visibleReports.length ? (
                visibleReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => loadDetail(report.id)}
                    className={`w-full rounded-2xl border bg-paper p-5 text-left transition hover:border-ink/25 hover:shadow-sm ${selectedReportId === report.id ? "border-ink/35 shadow-sm" : "border-line"}`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
                          <span>{report.projects?.name ?? "Projeto"}</span>
                          <span className="text-ink/20">•</span>
                          <span>{report.public_code}</span>
                          <span className="text-ink/20">•</span>
                          <span>{formatRelative(report.created_at)}</span>
                        </div>
                        <h2 className="mt-2 text-base font-semibold text-ink">{report.title}</h2>
                        <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-6 text-dim">
                          {report.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Tag>{categoryLabels[report.category]}</Tag>
                          <Tag>{priorityLabels[report.priority]}</Tag>
                          {report.billing_treatment && (
                            <Tag>{billingLabels[report.billing_treatment]}</Tag>
                          )}
                          {latestQuote(report) && (
                            <Tag>{formatCurrency(latestQuote(report)!.amount_cents)}</Tag>
                          )}
                        </div>
                      </div>
                      <StatusPill status={report.status} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-16 text-center">
                  <Inbox className="mx-auto h-7 w-7 text-dim" />
                  <div className="mt-3 text-sm font-medium text-ink">Nenhum report encontrado</div>
                  <p className="mt-1 text-xs text-dim">
                    Crie um report de teste ou ajuste os filtros.
                  </p>
                </div>
              )}
            </div>

            <aside className="min-w-0">
              {selectedReportId ? (
                detailLoading || !detail ? (
                  <LoadingBlock label="Abrindo report..." />
                ) : (
                  <ReportDetailPanel
                    detail={detail}
                    busy={actionLoading}
                    onClose={() => {
                      setSelectedReportId(null);
                      setDetail(null);
                    }}
                    run={runDetailAction}
                  />
                )
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-line bg-ink p-5 text-paper">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/55">
                      <Sparkles className="h-3.5 w-3.5" /> Fluxo comercial
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">Correção ou nova função?</h3>
                    <p className="mt-2 text-sm leading-6 text-paper/65">
                      Classifique o pedido. Correções seguem para execução; melhorias comerciais
                      geram orçamento e aguardam aprovação do cliente.
                    </p>
                    <div className="mt-5 space-y-3 text-xs">
                      <FlowStep
                        icon={<AlertCircle className="h-3.5 w-3.5" />}
                        label="Analisar solicitação"
                      />
                      <FlowStep
                        icon={<BadgeDollarSign className="h-3.5 w-3.5" />}
                        label="Gerar orçamento quando necessário"
                      />
                      <FlowStep
                        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        label="Aprovação libera execução"
                      />
                      <FlowStep
                        icon={<MessageSquareText className="h-3.5 w-3.5" />}
                        label="Histórico e mensagens centralizados"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-soft/50 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
                      Integração
                    </div>
                    <div className="mt-3 text-sm font-medium text-ink">Fluxa Reports API</div>
                    <p className="mt-1 text-xs leading-5 text-dim">
                      A API por Project Key está ativa. Gere as chaves em Projetos & integrações e
                      depois use o conector no sistema do cliente.
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </section>
        </>
      )}

      {createOpen && (
        <CreateReportModal
          projects={projects}
          onClose={() => setCreateOpen(false)}
          onCreated={async (report) => {
            setCreateOpen(false);
            await loadBase();
            await loadDetail(report.id);
          }}
        />
      )}
    </div>
  );
}

function ReportDetailPanel({
  detail,
  busy,
  onClose,
  run,
}: {
  detail: ReportDetail;
  busy: boolean;
  onClose: () => void;
  run: (action: () => Promise<unknown>) => Promise<void>;
}) {
  const report = detail.report;
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState<"client" | "internal">("client");
  const [quoteOpen, setQuoteOpen] = useState(false);

  const patch = (next: Parameters<typeof updateReport>[1]) =>
    run(() => updateReport(report.id, next));

  const handleTreatment = (value: Exclude<BillingTreatment, null> | "") => {
    if (!value) return patch({ billing_treatment: null });
    const status =
      value === "quote_required" && ["new", "analysis"].includes(report.status)
        ? "waiting_quote"
        : report.status;
    return patch({ billing_treatment: value, status });
  };

  const handleStatus = (status: ReportStatus) => {
    const resolved_at =
      status === "resolved"
        ? new Date().toISOString()
        : report.status === "resolved"
          ? null
          : report.resolved_at;
    return patch({ status, resolved_at });
  };

  const submitMessage = async () => {
    const text = message.trim();
    if (!text) return;
    await run(() => addReportMessage(report.id, text, visibility));
    setMessage("");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex items-start justify-between border-b border-line p-5">
        <div className="min-w-0 pr-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
            {report.projects?.name ?? "Projeto"} • {report.public_code}
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-6 text-ink">{report.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-dim transition hover:text-ink"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[calc(100vh-180px)] space-y-6 overflow-y-auto p-5">
        <section>
          <SectionTitle>Solicitação</SectionTitle>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink/80">{report.description}</p>
          {(report.source_url || report.source_route || report.browser || report.os) && (
            <div className="mt-4 grid gap-2 rounded-xl border border-line bg-soft/40 p-3 text-xs text-dim sm:grid-cols-2">
              {report.source_route && <Meta label="Rota" value={report.source_route} />}
              {report.browser && <Meta label="Navegador" value={report.browser} />}
              {report.os && <Meta label="Sistema" value={report.os} />}
              {report.viewport && <Meta label="Tela" value={report.viewport} />}
              {report.source_url && (
                <a
                  href={report.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-full inline-flex items-center gap-1 text-ink underline underline-offset-2"
                >
                  Abrir página de origem <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <FieldSelect
            label="Status"
            value={report.status}
            disabled={busy}
            onChange={(value) => handleStatus(value as ReportStatus)}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect
            label="Prioridade"
            value={report.priority}
            disabled={busy}
            onChange={(value) => patch({ priority: value as ReportPriority })}
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect
            label="Classificação"
            value={report.category}
            disabled={busy}
            onChange={(value) => patch({ category: value as ReportCategory })}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect
            label="Tratamento"
            value={report.billing_treatment ?? ""}
            disabled={busy}
            onChange={(value) => handleTreatment(value as Exclude<BillingTreatment, null> | "")}
          >
            <option value="">Definir...</option>
            <option value="included">Incluso / sem cobrança</option>
            <option value="quote_required">Requer orçamento</option>
          </FieldSelect>
        </section>

        {report.billing_treatment === "included" && (
          <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Atendimento incluído
            </div>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Este ajuste pode seguir sem orçamento adicional.
            </p>
            {!["in_progress", "waiting_validation", "resolved", "archived"].includes(
              report.status,
            ) && (
              <button
                disabled={busy}
                onClick={() => patch({ status: "in_progress" })}
                className="mt-3 rounded-full bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Iniciar atendimento
              </button>
            )}
          </section>
        )}

        <section>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>Orçamentos</SectionTitle>
            {report.billing_treatment === "quote_required" && (
              <button
                onClick={() => setQuoteOpen((value) => !value)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-soft"
              >
                <Plus className="h-3 w-3" /> Novo orçamento
              </button>
            )}
          </div>

          {quoteOpen && (
            <QuoteForm
              reportId={report.id}
              busy={busy}
              onCancel={() => setQuoteOpen(false)}
              onCreate={async (payload) => {
                await run(() => createQuote(payload));
                setQuoteOpen(false);
              }}
            />
          )}

          <div className="space-y-3">
            {detail.quotes.length ? (
              detail.quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  busy={busy}
                  reportId={report.id}
                  run={run}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-dim">
                {report.billing_treatment === "quote_required"
                  ? "Nenhum orçamento criado ainda."
                  : "Marque como 'Requer orçamento' quando a solicitação for comercial."}
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>Conversa</SectionTitle>
          <div className="max-h-[260px] space-y-2 overflow-y-auto rounded-xl border border-line bg-soft/30 p-3">
            {detail.messages.length ? (
              detail.messages.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl p-3 text-xs leading-5 ${item.visibility === "internal" ? "border border-amber-200 bg-amber-50/60 text-amber-900" : item.author_type === "client" ? "border border-line bg-paper text-ink" : "bg-ink text-paper"}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] opacity-60">
                    <span>
                      {item.visibility === "internal"
                        ? "Nota interna"
                        : item.author_type === "client"
                          ? "Cliente"
                          : "Glass Maind"}
                    </span>
                    <span>{formatDateTime(item.created_at)}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{item.body}</div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-dim">Nenhuma mensagem ainda.</div>
            )}
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={
              visibility === "client" ? "Responder ao cliente..." : "Adicionar nota interna..."
            }
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-ink/40"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-full border border-line bg-soft p-0.5">
              <button
                onClick={() => setVisibility("client")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${visibility === "client" ? "bg-paper text-ink shadow-sm" : "text-dim"}`}
              >
                Cliente
              </button>
              <button
                onClick={() => setVisibility("internal")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${visibility === "internal" ? "bg-paper text-ink shadow-sm" : "text-dim"}`}
              >
                Nota interna
              </button>
            </div>
            <button
              disabled={busy || !message.trim()}
              onClick={submitMessage}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-paper disabled:opacity-40"
            >
              <Send className="h-3 w-3" /> Enviar
            </button>
          </div>
        </section>

        <section>
          <SectionTitle>Timeline</SectionTitle>
          <div className="space-y-3 border-l border-line pl-4">
            {detail.events.length ? (
              detail.events.map((event) => (
                <div key={event.id} className="relative text-xs">
                  <span className="absolute -left-[20px] top-1.5 h-2 w-2 rounded-full border-2 border-paper bg-ink" />
                  <div className="font-medium text-ink">{eventLabel(event.event_type)}</div>
                  <div className="mt-0.5 text-[10px] text-dim">
                    {formatDateTime(event.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-dim">Sem eventos registrados.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuoteForm({
  reportId,
  busy,
  onCancel,
  onCreate,
}: {
  reportId: string;
  busy: boolean;
  onCancel: () => void;
  onCreate: (payload: Parameters<typeof createQuote>[0]) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [scope, setScope] = useState("");
  const [notes, setNotes] = useState("");
  const [billingMethod, setBillingMethod] =
    useState<ReportQuote["billing_method"]>("after_completion");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!title.trim() || !Number.isFinite(parsed) || parsed < 0) {
      setError("Preencha o título e um valor válido.");
      return;
    }
    setError("");
    await onCreate({
      report_id: reportId,
      title: title.trim(),
      description: description.trim() || null,
      amount_cents: Math.round(parsed * 100),
      estimated_days_min: minDays ? Number(minDays) : null,
      estimated_days_max: maxDays ? Number(maxDays) : null,
      valid_until: validUntil || null,
      notes: notes.trim() || null,
      billing_method: billingMethod,
      items: scope
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="mb-3 space-y-3 rounded-xl border border-line bg-soft/40 p-4">
      <div className="text-xs font-semibold text-ink">Novo orçamento</div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Título do orçamento"
        className="input-base"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descrição resumida"
        rows={2}
        className="input-base resize-none py-2.5"
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Valor (ex: 450,00)"
          inputMode="decimal"
          className="input-base"
        />
        <input
          value={minDays}
          onChange={(event) => setMinDays(event.target.value)}
          placeholder="Prazo mín. dias"
          type="number"
          min="0"
          className="input-base"
        />
        <input
          value={maxDays}
          onChange={(event) => setMaxDays(event.target.value)}
          placeholder="Prazo máx. dias"
          type="number"
          min="0"
          className="input-base"
        />
      </div>
      <textarea
        value={scope}
        onChange={(event) => setScope(event.target.value)}
        placeholder={"Escopo — um item por linha\nEx: Cadastro de comissão\nRelatório mensal"}
        rows={4}
        className="input-base resize-none py-2.5"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">
            Validade
          </label>
          <input
            value={validUntil}
            onChange={(event) => setValidUntil(event.target.value)}
            type="date"
            className="input-base"
          />
        </div>
        <div>
          <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">
            Cobrança
          </label>
          <select
            value={billingMethod}
            onChange={(event) =>
              setBillingMethod(event.target.value as ReportQuote["billing_method"])
            }
            className="input-base"
          >
            <option value="after_completion">Após conclusão</option>
            <option value="before_start">Antes de iniciar</option>
            <option value="half_upfront">50% entrada / 50% conclusão</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Observações (opcional)"
        rows={2}
        className="input-base resize-none py-2.5"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-dim"
        >
          Cancelar
        </button>
        <button
          disabled={busy}
          className="rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-paper disabled:opacity-50"
        >
          Salvar rascunho
        </button>
      </div>
    </form>
  );
}

function QuoteCard({
  quote,
  busy,
  reportId,
  run,
}: {
  quote: ReportQuote;
  busy: boolean;
  reportId: string;
  run: (action: () => Promise<unknown>) => Promise<void>;
}) {
  const status = {
    draft: "Rascunho",
    sent: "Aguardando aprovação",
    approved: "Aprovado",
    rejected: "Recusado",
    expired: "Expirado",
  }[quote.status];

  return (
    <div className="rounded-xl border border-line bg-soft/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">
            Orçamento v{quote.version}
          </div>
          <div className="mt-1 text-sm font-semibold text-ink">{quote.title}</div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-ink">
            {formatCurrency(quote.amount_cents)}
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${quote.status === "approved" ? "bg-emerald-100 text-emerald-800" : quote.status === "rejected" ? "bg-red-100 text-red-700" : "border border-line bg-paper text-dim"}`}
        >
          {status}
        </span>
      </div>
      {quote.description && <p className="mt-2 text-xs leading-5 text-dim">{quote.description}</p>}
      {!!quote.report_quote_items?.length && (
        <ul className="mt-3 space-y-1.5 text-xs text-ink/75">
          {quote.report_quote_items
            .sort((a, b) => a.position - b.position)
            .map((item) => (
              <li key={item.id} className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0" /> {item.description}
              </li>
            ))}
        </ul>
      )}
      {(quote.estimated_days_min != null || quote.estimated_days_max != null) && (
        <div className="mt-3 text-[10px] text-dim">
          Prazo: {quote.estimated_days_min ?? quote.estimated_days_max} a{" "}
          {quote.estimated_days_max ?? quote.estimated_days_min} dias úteis
        </div>
      )}
      {quote.status === "draft" && (
        <button
          disabled={busy}
          onClick={() => run(() => sendQuote(reportId, quote.id))}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-paper disabled:opacity-50"
        >
          <Send className="h-3 w-3" /> Enviar orçamento
        </button>
      )}
      {quote.status === "sent" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => run(() => setQuoteDecision(reportId, quote.id, "approved"))}
            className="rounded-full bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Registrar aprovação
          </button>
          <button
            disabled={busy}
            onClick={() => run(() => setQuoteDecision(reportId, quote.id, "rejected"))}
            className="rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"
          >
            Registrar recusa
          </button>
        </div>
      )}
      {quote.status === "approved" && (
        <div className="mt-3 text-[10px] font-medium text-emerald-700">
          Conteúdo congelado após aprovação •{" "}
          {quote.approved_at ? formatDateTime(quote.approved_at) : "aprovado"}
        </div>
      )}
    </div>
  );
}

function CreateReportModal({
  projects,
  onClose,
  onCreated,
}: {
  projects: Project[];
  onClose: () => void;
  onCreated: (report: Report) => Promise<void>;
}) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("other");
  const [priority, setPriority] = useState<ReportPriority>("normal");
  const [reporterName, setReporterName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId) {
      setError("Cadastre um projeto antes de criar o report.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const report = await createReport({
        project_id: projectId,
        title,
        description,
        category,
        priority,
        reporter_name: reporterName || null,
      });
      await onCreated(report);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Não foi possível criar o report.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-2xl border border-line bg-paper p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
              Teste ou solicitação manual
            </div>
            <h2 className="mt-1 text-xl font-semibold text-ink">Novo report</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="mt-5 space-y-3">
          <FieldSelect label="Projeto" value={projectId} onChange={setProjectId}>
            <option value="">Selecione...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </FieldSelect>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título da solicitação"
            className="input-base"
          />
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva o pedido ou problema"
            rows={5}
            className="input-base resize-none py-2.5"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldSelect
              label="Categoria"
              value={category}
              onChange={(value) => setCategory(value as ReportCategory)}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect
              label="Prioridade"
              value={priority}
              onChange={(value) => setPriority(value as ReportPriority)}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FieldSelect>
          </div>
          <input
            value={reporterName}
            onChange={(event) => setReporterName(event.target.value)}
            placeholder="Nome de quem solicitou (opcional)"
            className="input-base"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-dim"
          >
            Cancelar
          </button>
          <button
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Criar report
          </button>
        </div>
      </form>
    </div>
  );
}

function ProjectsPanel({
  projects,
  onChanged,
}: {
  projects: Project[];
  onChanged: () => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? "");
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [domains, setDomains] = useState("");
  const [integrations, setIntegrations] = useState<ProjectIntegration[]>([]);
  const [generatedKey, setGeneratedKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedId && projects[0]?.id) setSelectedId(projects[0].id);
  }, [projects, selectedId]);

  const loadIntegrations = async (projectId: string) => {
    if (!projectId) {
      setIntegrations([]);
      return;
    }
    try {
      setIntegrations(await listIntegrations(projectId));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as integrações.",
      );
    }
  };

  useEffect(() => {
    loadIntegrations(selectedId);
  }, [selectedId]);

  const addProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    setError("");
    try {
      const project = await createProject({
        name: newName.trim(),
        slug: slugify(newName),
        client_name: newClient.trim() || null,
      });
      setNewName("");
      setNewClient("");
      await onChanged();
      setSelectedId(project.id);
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : "Não foi possível criar o projeto.",
      );
    } finally {
      setBusy(false);
    }
  };

  const generate = async () => {
    if (!selectedId) return;
    setBusy(true);
    setError("");
    setGeneratedKey("");
    try {
      const allowed = domains
        .split(",")
        .map((item) =>
          item
            .trim()
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, ""),
        )
        .filter(Boolean);
      const integration = await createProjectIntegration(selectedId, allowed);
      setGeneratedKey(integration.project_key);
      setDomains("");
      await loadIntegrations(selectedId);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Não foi possível gerar a integração.",
      );
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (integrationId: string) => {
    setBusy(true);
    setError("");
    try {
      await revokeProjectIntegration(integrationId);
      await loadIntegrations(selectedId);
    } catch (revokeError) {
      setError(
        revokeError instanceof Error ? revokeError.message : "Não foi possível revogar a chave.",
      );
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const selected = projects.find((project) => project.id === selectedId);

  return (
    <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <SectionTitle>Projetos conectáveis</SectionTitle>
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedId(project.id);
                  setGeneratedKey("");
                }}
                className={`w-full rounded-xl border p-3 text-left transition ${selectedId === project.id ? "border-ink/30 bg-soft" : "border-line hover:bg-soft/50"}`}
              >
                <div className="text-sm font-semibold text-ink">{project.name}</div>
                <div className="mt-0.5 text-[10px] text-dim">
                  {project.client_name || project.slug}
                </div>
              </button>
            ))}
            {!projects.length && (
              <div className="py-5 text-center text-xs text-dim">Nenhum projeto cadastrado.</div>
            )}
          </div>
        </div>

        <form onSubmit={addProject} className="rounded-2xl border border-line bg-soft/40 p-5">
          <SectionTitle>Novo projeto</SectionTitle>
          <div className="space-y-2">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              required
              placeholder="Ex: JR Clinic"
              className="input-base"
            />
            <input
              value={newClient}
              onChange={(event) => setNewClient(event.target.value)}
              placeholder="Cliente / empresa (opcional)"
              className="input-base"
            />
            <button
              disabled={busy}
              className="w-full rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-paper disabled:opacity-50"
            >
              Cadastrar projeto
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}
        {selected ? (
          <>
            <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
                  Integração de suporte
                </div>
                <h2 className="mt-1 text-xl font-semibold text-ink">{selected.name}</h2>
                <p className="mt-1 text-xs text-dim">
                  Cada chave identifica este projeto sem dar acesso ao Supabase do cliente.
                </p>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                API central ativa
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-line bg-soft/40 p-4">
              <div className="text-xs font-semibold text-ink">Gerar nova Project Key</div>
              <p className="mt-1 text-[11px] leading-5 text-dim">
                Informe apenas os domínios que poderão usar essa chave. Separe múltiplos por
                vírgula.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={domains}
                  onChange={(event) => setDomains(event.target.value)}
                  placeholder="app.cliente.com.br, cliente.com.br"
                  className="input-base flex-1"
                />
                <button
                  onClick={generate}
                  disabled={busy}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-paper disabled:opacity-50"
                >
                  <KeyRound className="h-3.5 w-3.5" /> Gerar chave
                </button>
              </div>
            </div>

            {generatedKey && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                  Copie agora — ela não será exibida novamente
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-[11px] text-ink">
                    {generatedKey}
                  </code>
                  <button
                    onClick={copyKey}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-800"
                    aria-label="Copiar chave"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <SectionTitle>Chaves deste projeto</SectionTitle>
              <div className="space-y-2">
                {integrations.length ? (
                  integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex flex-col gap-3 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="text-xs font-semibold text-ink">
                            {integration.key_prefix}••••••
                          </code>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${integration.active && !integration.revoked_at ? "bg-emerald-100 text-emerald-700" : "bg-soft text-dim"}`}
                          >
                            {integration.active && !integration.revoked_at ? "Ativa" : "Revogada"}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-dim">
                          {integration.allowed_domains.length
                            ? integration.allowed_domains.join(" • ")
                            : "Sem restrição de domínio"}
                          {integration.last_seen_at
                            ? ` • último uso ${formatRelative(integration.last_seen_at)}`
                            : " • ainda não utilizada"}
                        </div>
                      </div>
                      {integration.active && !integration.revoked_at && (
                        <button
                          onClick={() => revoke(integration.id)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 self-start rounded-full border border-red-200 px-3 py-1.5 text-[10px] font-semibold text-red-700 disabled:opacity-50 sm:self-auto"
                        >
                          <Trash2 className="h-3 w-3" /> Revogar
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-line py-8 text-center text-xs text-dim">
                    Nenhuma chave gerada para este projeto.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <KeyRound className="h-7 w-7 text-dim" />
            <div className="mt-3 text-sm font-medium text-ink">
              Cadastre um projeto para começar
            </div>
            <p className="mt-1 max-w-sm text-xs leading-5 text-dim">
              Depois você poderá gerar uma chave de integração independente para cada sistema de
              cliente.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  children,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="input-base disabled:opacity-50"
      >
        {children}
      </select>
    </label>
  );
}

function Metric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
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
  return (
    <span className="rounded-full border border-line bg-soft px-2.5 py-1 text-[10px] font-medium text-dim">
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: ReportStatus }) {
  const critical = status === "new" || status === "waiting_approval";
  const done = status === "resolved" || status === "archived";
  return (
    <div
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : critical ? "border-amber-200 bg-amber-50 text-amber-800" : "border-line bg-soft text-ink"}`}
    >
      {statusLabels[status]}
    </div>
  );
}

function FlowStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-paper/75">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/15 bg-paper/5">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-ink/60">{label}: </span>
      {value}
    </div>
  );
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-line bg-paper text-xs text-dim">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

function latestQuote(report: Report) {
  return (report.report_quotes ?? []).slice().sort((a, b) => b.version - a.version)[0];
}

function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff)) return "";
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(value),
  );
}

function eventLabel(type: string) {
  const labels: Record<string, string> = {
    report_created: "Solicitação criada",
    status_changed: "Status alterado",
    priority_changed: "Prioridade alterada",
    category_changed: "Classificação alterada",
    quote_created: "Orçamento criado",
    quote_sent: "Orçamento enviado ao cliente",
    quote_approved: "Cliente aprovou o orçamento",
    quote_rejected: "Cliente recusou o orçamento",
    quote_approved_manual: "Aprovação registrada manualmente",
    quote_rejected_manual: "Recusa registrada manualmente",
    client_message: "Nova mensagem do cliente",
    message_sent: "Mensagem enviada ao cliente",
    internal_note: "Nota interna adicionada",
  };
  return labels[type] ?? type.replace(/_/g, " ");
}
