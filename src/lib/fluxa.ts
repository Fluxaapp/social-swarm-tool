const SUPABASE_URL = "https://epvzlpmmiggcdznvvxro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_6HlZdFAqGutlkKnzgv6cjQ_pq4XcBZK";
const SESSION_KEY = "fluxa_admin_session_v1";

export type FluxaRole = "owner" | "admin" | "support";

export type FluxaSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type?: string;
  user: {
    id: string;
    email?: string;
  };
  staff?: {
    role: FluxaRole;
    active: boolean;
  };
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  client_name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectIntegration = {
  id: string;
  project_id: string;
  key_prefix: string;
  allowed_domains: string[];
  active: boolean;
  last_seen_at: string | null;
  created_at: string;
  revoked_at: string | null;
};

export type ReportStatus =
  | "new"
  | "analysis"
  | "waiting_client"
  | "waiting_quote"
  | "waiting_approval"
  | "quote_approved"
  | "waiting_payment"
  | "ready_to_start"
  | "in_progress"
  | "waiting_validation"
  | "resolved"
  | "archived";

export type ReportCategory = "bug" | "simple_adjustment" | "improvement" | "new_feature" | "question" | "other";
export type ReportPriority = "low" | "normal" | "high" | "urgent";
export type BillingTreatment = "included" | "quote_required" | null;

export type Report = {
  id: string;
  project_id: string;
  integration_id: string | null;
  public_code: string;
  title: string;
  description: string;
  category: ReportCategory;
  billing_treatment: BillingTreatment;
  priority: ReportPriority;
  status: ReportStatus;
  source_route: string | null;
  source_url: string | null;
  browser: string | null;
  os: string | null;
  viewport: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  projects?: Pick<Project, "name" | "client_name"> | null;
  report_quotes?: Array<Pick<ReportQuote, "id" | "status" | "amount_cents" | "version" | "sent_at" | "approved_at">>;
};

export type ReportMessage = {
  id: string;
  report_id: string;
  author_type: "internal" | "client" | "system";
  author_user_id: string | null;
  body: string;
  visibility: "internal" | "client";
  created_at: string;
};

export type ReportEvent = {
  id: string;
  report_id: string;
  event_type: string;
  actor_type: "system" | "internal" | "client";
  actor_user_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export type QuoteItem = {
  id: string;
  quote_id: string;
  position: number;
  description: string;
};

export type ReportQuote = {
  id: string;
  report_id: string;
  version: number;
  title: string;
  description: string | null;
  amount_cents: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
  valid_until: string | null;
  notes: string | null;
  billing_method: "after_completion" | "before_start" | "half_upfront" | "custom";
  payment_status: "not_required" | "waiting" | "paid";
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  sent_at: string | null;
  approved_at: string | null;
  approved_by_name: string | null;
  approved_by_email: string | null;
  rejected_at: string | null;
  immutable_at: string | null;
  created_by: string | null;
  created_at: string;
  report_quote_items?: QuoteItem[];
};

export type ReportDetail = {
  report: Report;
  messages: ReportMessage[];
  events: ReportEvent[];
  quotes: ReportQuote[];
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readSession(): FluxaSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as FluxaSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: FluxaSession | null) {
  if (!isBrowser()) return;
  if (!session) window.localStorage.removeItem(SESSION_KEY);
  else window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function readError(response: Response) {
  try {
    const body = await response.json();
    return body?.msg || body?.message || body?.error_description || body?.error || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

function normalizeSession(payload: any, fallback?: FluxaSession): FluxaSession {
  const expiresIn = Number(payload.expires_in ?? fallback?.expires_in ?? 3600);
  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token ?? fallback?.refresh_token,
    expires_in: expiresIn,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    token_type: payload.token_type ?? "bearer",
    user: payload.user ?? fallback?.user,
    staff: fallback?.staff,
  };
}

export async function getBootstrapStatus() {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/fluxa-admin-bootstrap/status`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as { bootstrapped: boolean };
}

export async function bootstrapAdmin(email: string, password: string, bootstrapCode: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/fluxa-admin-bootstrap/bootstrap`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, bootstrap_code: bootstrapCode }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<{ ok: boolean; email: string }>;
}

export async function signInAdmin(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  if (!response.ok) throw new Error(await readError(response));
  let session = normalizeSession(await response.json());
  writeSession(session);

  const staff = await fetchStaff(session);
  if (!staff) {
    writeSession(null);
    throw new Error("Este usuário não possui acesso administrativo ao Fluxa.");
  }

  session = { ...session, staff };
  writeSession(session);
  return session;
}

async function fetchStaff(session: FluxaSession) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/fluxa_staff?select=role,active&user_id=eq.${encodeURIComponent(session.user.id)}&active=eq.true&limit=1`,
    {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ role: FluxaRole; active: boolean }>;
  return rows[0] ?? null;
}

async function refreshSession(session: FluxaSession) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) {
    writeSession(null);
    return null;
  }
  const refreshed = normalizeSession(await response.json(), session);
  writeSession(refreshed);
  return refreshed;
}

export async function restoreAdminSession() {
  let session = readSession();
  if (!session?.access_token || !session.refresh_token || !session.user?.id) return null;

  const now = Math.floor(Date.now() / 1000);
  if (!session.expires_at || session.expires_at <= now + 90) {
    session = await refreshSession(session);
    if (!session) return null;
  }

  const staff = await fetchStaff(session);
  if (!staff) {
    writeSession(null);
    return null;
  }

  session = { ...session, staff };
  writeSession(session);
  return session;
}

export async function signOutAdmin() {
  const session = readSession();
  writeSession(null);
  if (!session?.access_token) return;
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${session.access_token}` },
    });
  } catch {
    // Local session is already removed.
  }
}

async function getAccessToken() {
  let session = readSession();
  if (!session) throw new Error("Sessão expirada. Entre novamente.");
  const now = Math.floor(Date.now() / 1000);
  if (!session.expires_at || session.expires_at <= now + 90) {
    session = await refreshSession(session);
  }
  if (!session) throw new Error("Sessão expirada. Entre novamente.");
  return session.access_token;
}

async function rest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
  if (response.status === 401 && retry) {
    const current = readSession();
    if (current && (await refreshSession(current))) return rest<T>(path, init, false);
  }
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function listProjects() {
  return rest<Project[]>("projects?select=*&order=name.asc");
}

export async function createProject(input: { name: string; slug: string; client_name?: string | null }) {
  const rows = await rest<Project[]>("projects", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...input, active: true }),
  });
  return rows[0];
}

export async function listReports() {
  return rest<Report[]>(
    "reports?select=id,project_id,integration_id,public_code,title,description,category,billing_treatment,priority,status,source_route,source_url,browser,os,viewport,reporter_name,reporter_email,assigned_to,created_at,updated_at,resolved_at,projects(name,client_name),report_quotes(id,status,amount_cents,version,sent_at,approved_at)&order=created_at.desc",
  );
}

export async function createReport(input: {
  project_id: string;
  title: string;
  description: string;
  category?: ReportCategory;
  priority?: ReportPriority;
  reporter_name?: string | null;
  reporter_email?: string | null;
}) {
  const rows = await rest<Report[]>("reports", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...input,
      category: input.category ?? "other",
      priority: input.priority ?? "normal",
      status: "new",
    }),
  });
  return rows[0];
}

export async function updateReport(reportId: string, patch: Partial<Pick<Report, "status" | "priority" | "category" | "billing_treatment" | "assigned_to" | "resolved_at">>) {
  const rows = await rest<Report[]>(`reports?id=eq.${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  return rows[0];
}

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const id = encodeURIComponent(reportId);
  const [reports, messages, events, quotes] = await Promise.all([
    rest<Report[]>(`reports?select=*,projects(name,client_name)&id=eq.${id}&limit=1`),
    rest<ReportMessage[]>(`report_messages?select=*&report_id=eq.${id}&order=created_at.asc`),
    rest<ReportEvent[]>(`report_events?select=*&report_id=eq.${id}&order=created_at.desc`),
    rest<ReportQuote[]>(`report_quotes?select=*,report_quote_items(*)&report_id=eq.${id}&order=version.desc`),
  ]);
  if (!reports[0]) throw new Error("Report não encontrado.");
  return { report: reports[0], messages, events, quotes };
}

export async function addReportMessage(reportId: string, body: string, visibility: "internal" | "client") {
  const session = await restoreAdminSession();
  if (!session) throw new Error("Sessão expirada.");
  const rows = await rest<ReportMessage[]>("report_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      report_id: reportId,
      author_type: "internal",
      author_user_id: session.user.id,
      body,
      visibility,
    }),
  });
  await addReportEvent(reportId, visibility === "client" ? "message_sent" : "internal_note", { message_id: rows[0]?.id });
  return rows[0];
}

export async function addReportEvent(reportId: string, eventType: string, payload: Record<string, unknown> = {}) {
  const session = await restoreAdminSession();
  return rest<ReportEvent[]>("report_events", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      report_id: reportId,
      event_type: eventType,
      actor_type: "internal",
      actor_user_id: session?.user.id ?? null,
      payload,
    }),
  });
}

export async function createQuote(input: {
  report_id: string;
  title: string;
  description?: string | null;
  amount_cents: number;
  estimated_days_min?: number | null;
  estimated_days_max?: number | null;
  valid_until?: string | null;
  notes?: string | null;
  billing_method?: ReportQuote["billing_method"];
  items: string[];
}) {
  const current = await rest<Array<{ version: number }>>(
    `report_quotes?select=version&report_id=eq.${encodeURIComponent(input.report_id)}&order=version.desc&limit=1`,
  );
  const session = await restoreAdminSession();
  const version = (current[0]?.version ?? 0) + 1;
  const rows = await rest<ReportQuote[]>("report_quotes", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      report_id: input.report_id,
      version,
      title: input.title,
      description: input.description ?? null,
      amount_cents: input.amount_cents,
      estimated_days_min: input.estimated_days_min ?? null,
      estimated_days_max: input.estimated_days_max ?? null,
      valid_until: input.valid_until ?? null,
      notes: input.notes ?? null,
      billing_method: input.billing_method ?? "after_completion",
      created_by: session?.user.id ?? null,
      status: "draft",
    }),
  });
  const quote = rows[0];
  const items = input.items.map((description, position) => ({ quote_id: quote.id, position, description })).filter((item) => item.description.trim());
  if (items.length) {
    await rest<QuoteItem[]>("report_quote_items", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(items),
    });
  }
  await addReportEvent(input.report_id, "quote_created", { quote_id: quote.id, version, amount_cents: input.amount_cents });
  return quote;
}

export async function sendQuote(reportId: string, quoteId: string) {
  const now = new Date().toISOString();
  const quotes = await rest<ReportQuote[]>(`report_quotes?id=eq.${encodeURIComponent(quoteId)}&report_id=eq.${encodeURIComponent(reportId)}&status=eq.draft`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status: "sent", sent_at: now }),
  });
  if (!quotes[0]) throw new Error("Este orçamento não está mais em rascunho.");
  await updateReport(reportId, { status: "waiting_approval", billing_treatment: "quote_required" });
  await addReportEvent(reportId, "quote_sent", { quote_id: quoteId, version: quotes[0].version, amount_cents: quotes[0].amount_cents });
  return quotes[0];
}

export async function setQuoteDecision(reportId: string, quoteId: string, decision: "approved" | "rejected", approver?: { name?: string; email?: string }) {
  const now = new Date().toISOString();
  const patch = decision === "approved"
    ? { status: "approved", approved_at: now, immutable_at: now, approved_by_name: approver?.name ?? "Aprovação manual", approved_by_email: approver?.email ?? null }
    : { status: "rejected", rejected_at: now };
  const rows = await rest<ReportQuote[]>(`report_quotes?id=eq.${encodeURIComponent(quoteId)}&report_id=eq.${encodeURIComponent(reportId)}&status=eq.sent`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!rows[0]) throw new Error("O orçamento não está aguardando uma decisão.");
  await updateReport(reportId, { status: decision === "approved" ? "quote_approved" : "waiting_client" });
  await addReportEvent(reportId, decision === "approved" ? "quote_approved_manual" : "quote_rejected_manual", { quote_id: quoteId });
  return rows[0];
}

export async function listIntegrations(projectId?: string) {
  const filter = projectId ? `&project_id=eq.${encodeURIComponent(projectId)}` : "";
  return rest<ProjectIntegration[]>(`project_integrations?select=*&order=created_at.desc${filter}`);
}

export async function createProjectIntegration(projectId: string, allowedDomains: string[]) {
  const rows = await rest<Array<{ integration_id: string; project_key: string; key_prefix: string }>>("rpc/create_project_integration", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ p_project_id: projectId, p_allowed_domains: allowedDomains }),
  });
  return rows[0];
}

export async function revokeProjectIntegration(integrationId: string) {
  await rest("rpc/revoke_project_integration", {
    method: "POST",
    body: JSON.stringify({ p_integration_id: integrationId }),
  });
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);
}
