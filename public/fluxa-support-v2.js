(() => {
  "use strict";

  const script = document.currentScript;
  if (!script) return;

  const projectKey = String(script.dataset.projectKey || "").trim();
  const apiUrl = String(script.dataset.apiUrl || "").trim() || "https://cybkcwdhhcvmvbyiylln.supabase.co/functions/v1/support-hub";
  const label = String(script.dataset.label || "Reportar problema").trim();

  if (!/^fluxa_pub_[a-f0-9]{64}$/.test(projectKey)) {
    console.error("[Fluxa Support] Project Key inválida.");
    return;
  }
  if (document.getElementById("fluxa-support-v2-root")) return;

  const storageKey = `fluxa_support_v2:${projectKey.slice(0, 22)}`;
  const state = {
    open: false,
    view: "new",
    busy: false,
    error: "",
    notice: "",
    file: null,
    fileUrl: "",
    entries: readEntries(),
    activeId: null,
    detail: null,
  };

  const host = document.createElement("div");
  host.id = "fluxa-support-v2-root";
  host.style.position = "fixed";
  host.style.right = "18px";
  host.style.bottom = "18px";
  host.style.zIndex = "2147483000";
  host.style.pointerEvents = "none";
  document.documentElement.appendChild(host);

  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host{all:initial}*,*::before,*::after{box-sizing:border-box}button,textarea,input{font:inherit}
    .fx{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#edf9fc}
    button{cursor:pointer}.launcher{pointer-events:auto;display:flex;align-items:center;gap:9px;min-height:48px;padding:0 16px;border:1px solid rgba(82,214,239,.27);border-radius:999px;background:linear-gradient(145deg,#10252c,#071317);color:#eafaff;box-shadow:0 18px 50px rgba(0,0,0,.38)}
    .mark{display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:rgba(74,211,237,.11);color:#66dff3;font-weight:800}.launcher strong{font-size:12px}
    .panel{pointer-events:auto;position:absolute;right:0;bottom:59px;width:min(390px,calc(100vw - 24px));max-height:min(690px,calc(100vh - 90px));overflow:auto;border:1px solid rgba(84,210,234,.2);border-radius:20px;background:#071317;box-shadow:0 30px 90px rgba(0,0,0,.52);animation:pop .16s ease-out}
    @keyframes pop{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
    .head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 15px 12px;border-bottom:1px solid rgba(255,255,255,.07)}.head b{font-size:13px}.head small{display:block;margin-top:2px;color:#70878f;font-size:9px}.close{width:31px;height:31px;border:0;border-radius:9px;background:rgba(255,255,255,.04);color:#8fa4ac;font-size:18px}
    .body{padding:15px}.error,.notice{margin-bottom:10px;padding:9px 10px;border-radius:10px;font-size:10.5px;line-height:1.45}.error{border:1px solid rgba(236,91,91,.18);background:rgba(236,91,91,.07);color:#efb2b2}.notice{border:1px solid rgba(75,211,238,.17);background:rgba(75,211,238,.07);color:#b9edf5}
    .drop{position:relative;display:grid;place-items:center;min-height:205px;padding:15px;border:1px dashed rgba(112,221,241,.34);border-radius:15px;background:rgba(69,199,223,.035);text-align:center;overflow:hidden;transition:.15s ease}.drop.drag{border-color:rgba(112,221,241,.72);background:rgba(69,199,223,.08)}.drop input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.drop-icon{font-size:25px}.drop-title{margin-top:8px;color:#dceff3;font-size:11px;font-weight:800}.drop-sub{margin-top:4px;color:#728990;font-size:9.5px;line-height:1.45}.preview{width:100%}.preview img{display:block;width:100%;max-height:280px;object-fit:contain;border-radius:11px;background:#040b0d}.preview-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;color:#82979f;font-size:9.5px}.remove{position:relative;z-index:4;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.035);color:#efaaaa;padding:6px 8px;font-size:9px}
    label{display:block;margin:13px 0 6px;color:#879aa1;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em}textarea{width:100%;min-height:105px;resize:vertical;padding:11px;border:1px solid rgba(255,255,255,.09);border-radius:11px;outline:0;background:rgba(255,255,255,.035);color:#eefbfe;font-size:11px;line-height:1.5}textarea:focus{border-color:rgba(75,211,238,.42)}
    .primary{width:100%;margin-top:13px;padding:11px 12px;border:1px solid rgba(79,218,243,.26);border-radius:11px;background:linear-gradient(135deg,#61e0f4,#45c5dd);color:#061316;font-size:11px;font-weight:800}.primary:disabled{opacity:.45;cursor:not-allowed}.textbtn{display:block;margin:11px auto 0;border:0;background:transparent;color:#76d9e9;font-size:10px}.ghost{padding:8px 10px;border:1px solid rgba(255,255,255,.1);border-radius:9px;background:rgba(255,255,255,.025);color:#9fb3ba;font-size:10px}.danger{color:#efaaaa;border-color:rgba(239,97,97,.18)}
    .request{width:100%;margin-bottom:7px;padding:10px;border:1px solid rgba(255,255,255,.075);border-radius:12px;background:rgba(255,255,255,.02);color:inherit;text-align:left}.row{display:flex;align-items:center;justify-content:space-between;gap:8px}.code{color:#71858d;font:600 8.5px ui-monospace,SFMono-Regular,Menlo,monospace}.title{margin-top:4px;color:#e8f7fa;font-size:11px;font-weight:700}.meta{margin-top:4px;color:#6f858d;font-size:9.5px}.pill{display:inline-flex;padding:3px 7px;border:1px solid rgba(78,210,235,.16);border-radius:999px;background:rgba(78,210,235,.07);color:#afe9f2;font-size:8.5px;font-weight:700}
    .back{padding:0;border:0;background:transparent;color:#72d8e9;font-size:10px}.section{margin-top:10px;padding:10px;border:1px solid rgba(255,255,255,.075);border-radius:12px;background:rgba(255,255,255,.018)}.section h4{margin:0 0 6px;color:#d9eaee;font-size:10.5px}.section p{margin:0;color:#8da2aa;font-size:10.5px;line-height:1.48;white-space:pre-wrap}.msg{margin-top:6px;padding:8px 9px;border-radius:9px;background:rgba(255,255,255,.03);color:#9db1b8;font-size:10px;line-height:1.45}.money{margin-top:4px;color:#e8fbff;font-size:16px;font-weight:800}.actions{display:flex;gap:6px;margin-top:8px}.actions button{flex:1}.success{text-align:center;padding:22px 8px}.success strong{display:block;font-size:15px}.success p{color:#83979e;font-size:10.5px;line-height:1.5}.loading{padding:28px;text-align:center;color:#758991;font-size:10.5px}
    @media(max-width:520px){.panel{position:fixed;inset:10px 10px 72px;width:auto;max-height:none}.launcher{min-height:46px;padding:0 12px}.launcher strong{display:none}}
  `;
  root.appendChild(style);

  const wrap = document.createElement("div");
  wrap.className = "fx";
  root.appendChild(wrap);

  const statusLabel = {
    new: "Novo",
    analysis: "Em análise",
    waiting_client: "Aguardando você",
    waiting_quote: "Preparando orçamento",
    waiting_approval: "Aguardando aprovação",
    quote_approved: "Orçamento aprovado",
    waiting_payment: "Aguardando pagamento",
    ready: "Pronto para iniciar",
    in_progress: "Em andamento",
    validation: "Aguardando validação",
    resolved: "Resolvido",
    archived: "Arquivado",
  };

  function readEntries() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.entries.slice(0, 40)));
    } catch {}
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function code(id) {
    return `SUP-${String(id || "").replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  }

  function money(cents) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(cents || 0) / 100);
  }

  async function api(action, data, token) {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "x-project-key": projectKey,
        ...(token ? { "x-client-token": token } : {}),
      },
      body: JSON.stringify({ action, data: data || {} }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "Não foi possível concluir a solicitação.");
    return body;
  }

  async function upload(reportId, file, token) {
    const form = new FormData();
    form.append("data", JSON.stringify({ report_id: reportId, visibility: "client" }));
    form.append("file", file);
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "omit",
      headers: { "x-project-key": projectKey, "x-client-token": token },
      body: form,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "Não foi possível enviar o print.");
    return body;
  }

  function context() {
    return {
      page: document.title || location.pathname,
      url: location.href,
      browser: navigator.userAgent,
      os: navigator.platform || "",
      resolution: `${window.innerWidth}x${window.innerHeight}`,
    };
  }

  function clearFile() {
    if (state.fileUrl) URL.revokeObjectURL(state.fileUrl);
    state.file = null;
    state.fileUrl = "";
  }

  function setFile(file) {
    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      state.error = "Cole ou selecione um print em PNG, JPG ou WEBP.";
      render();
      return;
    }
    if (!file.size || file.size > 10485760) {
      state.error = "O print deve ter no máximo 10 MB.";
      render();
      return;
    }
    let normalized = file;
    if (!/\.(png|jpe?g|webp)$/i.test(file.name || "")) {
      const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/webp" ? "webp" : "png";
      normalized = new File([file], `print-${Date.now()}.${ext}`, { type: file.type || "image/png" });
    }
    clearFile();
    state.file = normalized;
    state.fileUrl = URL.createObjectURL(normalized);
    state.error = "";
    render();
  }

  function panel() {
    let content = "";
    if (state.view === "new") content = newView();
    if (state.view === "list") content = listView();
    if (state.view === "detail") content = detailView();
    if (state.view === "sent") content = sentView();
    return `<section class="panel" role="dialog" aria-label="Reportar problema"><div class="head"><div><b>Reportar problema</b><small>Envie um print e descreva o que precisa</small></div><button class="close" type="button" data-act="close">×</button></div><div class="body">${state.error ? `<div class="error">${esc(state.error)}</div>` : ""}${state.notice ? `<div class="notice">${esc(state.notice)}</div>` : ""}${content}</div></section>`;
  }

  function newView() {
    const drop = state.file
      ? `<div class="preview"><img src="${esc(state.fileUrl)}" alt="Print selecionado"><div class="preview-row"><span>Print pronto para enviar</span><button class="remove" type="button" data-act="remove">Remover</button></div></div>`
      : `<div><div class="drop-icon">⌘</div><div class="drop-title">Cole o print aqui</div><div class="drop-sub">Ctrl + V, arraste a imagem ou clique para selecionar</div></div>`;
    return `<form data-form="new"><div class="drop" data-drop>${drop}<input type="file" accept="image/png,image/jpeg,image/webp" data-file></div><label>O que você precisa?</label><textarea name="description" maxlength="20000" required placeholder="Descreva o problema ou ajuste..."></textarea><button class="primary" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "Enviando..." : "Enviar solicitação"}</button>${state.entries.length ? `<button class="textbtn" type="button" data-act="list">Acompanhar pedidos anteriores</button>` : ""}</form>`;
  }

  function sentView() {
    return `<div class="success"><strong>Solicitação enviada ✓</strong><p>O pedido já chegou para análise no Fluxa.</p><button class="primary" type="button" data-act="detail">Acompanhar este pedido</button><button class="textbtn" type="button" data-act="new">Enviar outro problema</button></div>`;
  }

  function listView() {
    if (!state.entries.length) return `<div class="success"><p>Nenhum pedido enviado neste navegador.</p><button class="primary" data-act="new">Novo pedido</button></div>`;
    return `<button class="back" type="button" data-act="new">← Novo pedido</button><div style="margin-top:12px">${state.entries.map((item) => `<button class="request" type="button" data-open="${esc(item.id)}"><div class="row"><span class="code">${esc(code(item.id))}</span><span class="pill">${esc(statusLabel[item.status] || item.status || "Abrir")}</span></div><div class="title">${esc(item.title || "Solicitação")}</div></button>`).join("")}</div>`;
  }

  function detailView() {
    if (state.busy && !state.detail) return `<button class="back" data-act="list">← Meus pedidos</button><div class="loading">Carregando...</div>`;
    if (!state.detail) return `<button class="back" data-act="list">← Meus pedidos</button><div class="loading">Não foi possível carregar.</div>`;
    const report = state.detail.report || {};
    const messages = Array.isArray(state.detail.messages) ? state.detail.messages : [];
    const quotes = Array.isArray(state.detail.quotes) ? state.detail.quotes.filter((q) => q.status !== "draft") : [];
    return `<button class="back" data-act="list">← Meus pedidos</button><div style="margin-top:12px" class="row"><span class="code">${esc(code(report.id))}</span><span class="pill">${esc(statusLabel[report.status] || report.status || "Pedido")}</span></div><div class="section"><h4>${esc(report.title || "Solicitação")}</h4><p>${esc(report.description || "")}</p></div>${quotes.length ? `<div class="section"><h4>Orçamento</h4>${quotes.map(quoteHtml).join("")}</div>` : ""}<div class="section"><h4>Conversa</h4>${messages.length ? messages.map((m) => `<div class="msg"><b>${m.kind === "from_client" ? "Você" : "Equipe"}</b><br>${esc(m.body)}</div>`).join("") : `<p>Ainda não há mensagens.</p>`}<form data-form="reply"><label>Responder</label><textarea name="message" required maxlength="10000"></textarea><button class="primary" type="submit">Enviar mensagem</button></form></div>`;
  }

  function quoteHtml(q) {
    return `<div class="msg"><div class="row"><b>${esc(q.title || "Orçamento")}</b><span class="pill">${esc(q.status)}</span></div>${q.description ? `<div style="margin-top:5px">${esc(q.description)}</div>` : ""}<div class="money">${esc(money(q.amount_cents))}</div>${q.status === "sent" ? `<div class="actions"><button class="ghost" type="button" data-quote="${esc(q.id)}" data-decision="approved">Aprovar</button><button class="ghost danger" type="button" data-quote="${esc(q.id)}" data-decision="rejected">Não aprovar</button></div>` : ""}</div>`;
  }

  function render() {
    wrap.innerHTML = `${state.open ? panel() : ""}<button class="launcher" type="button" data-act="toggle"><span class="mark">ϟ</span><strong>${esc(label)}</strong></button>`;
    bind();
  }

  function tokenFor(id) {
    return state.entries.find((item) => item.id === id)?.token || null;
  }

  async function openDetail(id) {
    const token = tokenFor(id);
    if (!token) return;
    state.activeId = id;
    state.view = "detail";
    state.detail = null;
    state.busy = true;
    state.error = "";
    render();
    try {
      const result = await api("detail", { report_id: id }, token);
      state.detail = result.data;
      const item = state.entries.find((entry) => entry.id === id);
      if (item && result.data?.report) item.status = result.data.report.status;
      saveEntries();
    } catch (error) {
      state.error = error.message || "Não foi possível carregar o pedido.";
    } finally {
      state.busy = false;
      render();
    }
  }

  async function sendReport(description) {
    if (!state.file) throw new Error("Cole ou selecione o print antes de enviar.");
    const title = (description.split(/\r?\n/).find((line) => line.trim()) || "Solicitação com print").trim().slice(0, 180);
    const result = await api("report_create", {
      title,
      description,
      category: location.pathname || "Página",
      type: "other",
      priority: "normal",
      context: context(),
    });
    if (!result.data?.id || !result.token) throw new Error("O pedido foi criado sem credencial de acompanhamento.");
    await upload(result.data.id, state.file, result.token);
    const record = {
      id: result.data.id,
      token: result.token,
      title: result.data.title || title,
      status: result.data.status || "new",
      created_at: result.data.created_at || new Date().toISOString(),
    };
    state.entries = [record, ...state.entries.filter((item) => item.id !== record.id)];
    saveEntries();
    state.activeId = record.id;
    clearFile();
  }

  function bind() {
    wrap.querySelector('[data-act="toggle"]')?.addEventListener("click", () => {
      state.open = !state.open;
      state.error = "";
      state.notice = "";
      if (state.open && state.view === "sent") state.view = "new";
      render();
    });
    wrap.querySelector('[data-act="close"]')?.addEventListener("click", () => {
      state.open = false;
      render();
    });
    wrap.querySelectorAll('[data-act="new"]').forEach((button) => button.addEventListener("click", () => {
      state.view = "new";
      state.error = "";
      state.notice = "";
      state.detail = null;
      render();
    }));
    wrap.querySelectorAll('[data-act="list"]').forEach((button) => button.addEventListener("click", () => {
      state.view = "list";
      state.error = "";
      state.detail = null;
      render();
    }));
    wrap.querySelector('[data-act="detail"]')?.addEventListener("click", () => state.activeId && openDetail(state.activeId));
    wrap.querySelector('[data-act="remove"]')?.addEventListener("click", () => {
      clearFile();
      render();
    });
    wrap.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.open)));

    const fileInput = wrap.querySelector("[data-file]");
    fileInput?.addEventListener("change", (event) => setFile(event.currentTarget.files?.[0]));
    const drop = wrap.querySelector("[data-drop]");
    drop?.addEventListener("dragover", (event) => {
      event.preventDefault();
      drop.classList.add("drag");
    });
    drop?.addEventListener("dragleave", () => drop.classList.remove("drag"));
    drop?.addEventListener("drop", (event) => {
      event.preventDefault();
      drop.classList.remove("drag");
      setFile(event.dataTransfer?.files?.[0]);
    });

    wrap.querySelector('[data-form="new"]')?.addEventListener("paste", (event) => {
      const item = Array.from(event.clipboardData?.items || []).find((entry) => entry.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        event.preventDefault();
        setFile(file);
      }
    });

    wrap.querySelector('[data-form="new"]')?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state.busy) return;
      const description = String(new FormData(event.currentTarget).get("description") || "").trim();
      if (!state.file) {
        state.error = "Cole ou selecione o print antes de enviar.";
        render();
        return;
      }
      if (!description) {
        state.error = "Descreva o que você precisa.";
        render();
        return;
      }
      state.busy = true;
      state.error = "";
      render();
      try {
        await sendReport(description);
        state.view = "sent";
      } catch (error) {
        state.error = error.message || "Não foi possível enviar a solicitação.";
      } finally {
        state.busy = false;
        render();
      }
    });

    wrap.querySelector('[data-form="reply"]')?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = tokenFor(state.activeId);
      const message = String(new FormData(event.currentTarget).get("message") || "").trim();
      if (!token || !message) return;
      try {
        await api("message_create", { report_id: state.activeId, body: message }, token);
        await openDetail(state.activeId);
      } catch (error) {
        state.error = error.message || "Não foi possível enviar a mensagem.";
        render();
      }
    });

    wrap.querySelectorAll("[data-quote]").forEach((button) => button.addEventListener("click", async () => {
      const token = tokenFor(state.activeId);
      if (!token) return;
      const decision = button.dataset.decision;
      if (!window.confirm(decision === "approved" ? "Aprovar este orçamento?" : "Confirmar que não aprova este orçamento?")) return;
      try {
        await api("quote_decide", { report_id: state.activeId, quote_id: button.dataset.quote, decision, message: "" }, token);
        await openDetail(state.activeId);
      } catch (error) {
        state.error = error.message || "Não foi possível registrar a decisão.";
        render();
      }
    }));
  }

  render();
})();
