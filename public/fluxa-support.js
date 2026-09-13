(() => {
  "use strict";

  const script = document.currentScript;
  if (!script) return;

  const projectKey = (script.dataset.fluxaKey || script.dataset.projectKey || "").trim();
  if (!projectKey) {
    console.warn("[Fluxa] data-fluxa-key is required.");
    return;
  }

  if (document.querySelector("fluxa-support-widget")) return;

  const API = "https://epvzlpmmiggcdznvvxro.supabase.co/functions/v1/fluxa-reports-api";
  const label = script.dataset.fluxaLabel || "Solicitar ajuste";
  const position = script.dataset.fluxaPosition === "left" ? "left" : "right";
  const storageNamespace = `fluxa_support_${projectKey.slice(0, 18).replace(/[^a-zA-Z0-9]/g, "")}`;
  const idsKey = `${storageNamespace}_reports`;
  const profileKey = `${storageNamespace}_profile`;

  const statusLabels = {
    new: "Novo",
    analysis: "Em análise",
    waiting_client: "Aguardando você",
    waiting_quote: "Em orçamento",
    waiting_approval: "Aguardando aprovação",
    quote_approved: "Orçamento aprovado",
    waiting_payment: "Aguardando pagamento",
    ready_to_start: "Pronto para iniciar",
    in_progress: "Em andamento",
    waiting_validation: "Aguardando validação",
    resolved: "Resolvido",
    archived: "Arquivado",
  };

  const categoryLabels = {
    bug: "Erro / problema",
    simple_adjustment: "Ajuste simples",
    improvement: "Melhoria",
    new_feature: "Nova funcionalidade",
    question: "Dúvida",
    other: "Outro",
  };

  const host = document.createElement("fluxa-support-widget");
  const shadow = host.attachShadow({ mode: "open" });
  document.body.appendChild(host);

  shadow.innerHTML = `
    <style>
      :host { all: initial; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      *, *::before, *::after { box-sizing: border-box; }
      button, input, textarea, select { font: inherit; }
      button { cursor: pointer; }
      .launcher { position: fixed; ${position}: 22px; bottom: 22px; z-index: 2147483000; border: 0; border-radius: 999px; background: #111; color: #fff; min-height: 48px; padding: 0 18px; box-shadow: 0 12px 34px rgba(0,0,0,.2); display: flex; align-items: center; gap: 9px; font-size: 13px; font-weight: 650; letter-spacing: -.01em; }
      .launcher:hover { transform: translateY(-1px); }
      .launcher svg { width: 17px; height: 17px; }
      .backdrop { position: fixed; inset: 0; z-index: 2147483001; background: rgba(10,10,10,.42); display: none; align-items: flex-end; justify-content: ${position === "left" ? "flex-start" : "flex-end"}; padding: 20px; }
      .backdrop.open { display: flex; }
      .panel { width: min(430px, calc(100vw - 24px)); max-height: min(760px, calc(100vh - 40px)); background: #fff; color: #111; border: 1px solid #e7e7e7; border-radius: 22px; box-shadow: 0 28px 80px rgba(0,0,0,.24); overflow: hidden; display: flex; flex-direction: column; }
      .header { padding: 18px 18px 14px; border-bottom: 1px solid #ececec; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
      .eyebrow { font-size: 9px; text-transform: uppercase; letter-spacing: .16em; color: #777; font-weight: 700; }
      .title { margin-top: 4px; font-size: 18px; line-height: 1.25; font-weight: 700; letter-spacing: -.025em; }
      .close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e5e5e5; background: #fafafa; color: #555; display: grid; place-items: center; }
      .tabs { display: flex; gap: 4px; padding: 10px 14px; border-bottom: 1px solid #ececec; background: #fafafa; }
      .tab { border: 0; background: transparent; color: #777; border-radius: 999px; padding: 8px 12px; font-size: 11px; font-weight: 650; }
      .tab.active { background: #111; color: #fff; }
      .body { overflow: auto; padding: 16px; min-height: 260px; }
      .view { display: none; }
      .view.active { display: block; }
      .field { margin-bottom: 12px; }
      label { display: block; margin-bottom: 5px; font-size: 9px; text-transform: uppercase; letter-spacing: .13em; color: #777; font-weight: 700; }
      input, textarea, select { width: 100%; border: 1px solid #dedede; border-radius: 12px; background: #fff; color: #111; padding: 10px 11px; outline: none; font-size: 13px; line-height: 1.4; }
      input, select { height: 42px; }
      textarea { min-height: 110px; resize: vertical; }
      input:focus, textarea:focus, select:focus { border-color: #777; box-shadow: 0 0 0 3px rgba(0,0,0,.05); }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .primary { border: 0; border-radius: 999px; background: #111; color: #fff; min-height: 42px; padding: 0 16px; font-size: 12px; font-weight: 700; }
      .primary:disabled { opacity: .45; cursor: default; }
      .secondary { border: 1px solid #ddd; border-radius: 999px; background: #fff; color: #333; min-height: 38px; padding: 0 14px; font-size: 11px; font-weight: 650; }
      .danger { border-color: #f0caca; color: #a22929; }
      .success { border: 1px solid #cde9d8; background: #f2fbf5; color: #1f6d3e; border-radius: 12px; padding: 11px 12px; font-size: 12px; line-height: 1.5; margin-bottom: 12px; }
      .error { border: 1px solid #f2cccc; background: #fff6f6; color: #a22929; border-radius: 12px; padding: 11px 12px; font-size: 12px; line-height: 1.5; margin-bottom: 12px; }
      .muted { color: #777; font-size: 11px; line-height: 1.55; }
      .empty { text-align: center; padding: 46px 18px; color: #777; font-size: 12px; line-height: 1.6; }
      .spinner { width: 20px; height: 20px; border: 2px solid #ddd; border-top-color: #111; border-radius: 50%; animation: spin .75s linear infinite; margin: 36px auto; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .report { width: 100%; text-align: left; border: 1px solid #e5e5e5; background: #fff; border-radius: 14px; padding: 13px; margin-bottom: 9px; }
      .report:hover { border-color: #bdbdbd; background: #fcfcfc; }
      .report-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .code { font-size: 9px; color: #888; font-weight: 700; letter-spacing: .08em; }
      .status { display: inline-flex; border: 1px solid #ddd; background: #fafafa; color: #555; padding: 4px 8px; border-radius: 999px; font-size: 9px; font-weight: 700; white-space: nowrap; }
      .report-title { margin-top: 7px; font-size: 13px; line-height: 1.4; font-weight: 700; color: #111; }
      .report-meta { margin-top: 5px; font-size: 10px; color: #888; }
      .detail-head { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
      .back { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #ddd; background: #fff; display: grid; place-items: center; }
      .detail-title { font-size: 16px; font-weight: 700; letter-spacing: -.02em; }
      .description { white-space: pre-wrap; font-size: 12px; line-height: 1.65; color: #444; padding: 13px; border: 1px solid #e7e7e7; border-radius: 13px; background: #fafafa; }
      .section { margin-top: 18px; }
      .section-title { margin-bottom: 9px; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; color: #888; font-weight: 800; }
      .quote { border: 1px solid #dedede; border-radius: 14px; padding: 13px; margin-bottom: 9px; }
      .quote.approved { border-color: #bfe1cb; background: #f7fcf8; }
      .quote-title { font-size: 12px; font-weight: 700; }
      .money { margin-top: 3px; font-size: 20px; font-weight: 750; letter-spacing: -.025em; }
      .scope { margin: 9px 0 0; padding: 0; list-style: none; }
      .scope li { font-size: 11px; color: #555; line-height: 1.5; padding: 2px 0 2px 17px; position: relative; }
      .scope li::before { content: "✓"; position: absolute; left: 0; top: 2px; color: #333; }
      .actions { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 11px; }
      .messages { max-height: 250px; overflow: auto; display: flex; flex-direction: column; gap: 7px; }
      .message { max-width: 90%; border: 1px solid #e4e4e4; background: #fafafa; border-radius: 12px; padding: 9px 10px; font-size: 11px; line-height: 1.55; color: #333; }
      .message.client { align-self: flex-end; background: #111; color: #fff; border-color: #111; }
      .message-meta { margin-bottom: 3px; font-size: 8px; opacity: .58; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; }
      .message-form { margin-top: 9px; display: flex; gap: 7px; align-items: flex-end; }
      .message-form textarea { min-height: 70px; }
      .message-form .primary { flex: 0 0 auto; width: 42px; padding: 0; border-radius: 12px; }
      .footer { border-top: 1px solid #ececec; padding: 10px 16px; color: #aaa; font-size: 9px; display: flex; align-items: center; justify-content: space-between; }
      .brand { color: #777; font-weight: 750; letter-spacing: .04em; }
      @media (max-width: 600px) {
        .launcher { ${position}: 14px; bottom: 14px; min-height: 46px; }
        .backdrop { padding: 0; align-items: flex-end; }
        .panel { width: 100vw; max-height: 92vh; border-radius: 22px 22px 0 0; border-left: 0; border-right: 0; border-bottom: 0; }
        .grid2 { grid-template-columns: 1fr; gap: 0; }
      }
    </style>

    <button class="launcher" type="button" aria-label="${escapeHtml(label)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>
      <span class="launcher-label"></span>
    </button>
    <div class="backdrop" role="dialog" aria-modal="true" aria-label="Central de suporte">
      <div class="panel">
        <div class="header">
          <div><div class="eyebrow">Suporte</div><div class="title">Como podemos ajudar?</div></div>
          <button class="close" type="button" aria-label="Fechar">×</button>
        </div>
        <div class="tabs">
          <button class="tab active" type="button" data-tab="new">Novo pedido</button>
          <button class="tab" type="button" data-tab="mine">Meus pedidos</button>
        </div>
        <div class="body">
          <div class="view active" data-view="new"></div>
          <div class="view" data-view="mine"></div>
        </div>
        <div class="footer"><span>Atendimento integrado</span><span class="brand">FLUXA</span></div>
      </div>
    </div>
  `;

  shadow.querySelector(".launcher-label").textContent = label;

  const launcher = shadow.querySelector(".launcher");
  const backdrop = shadow.querySelector(".backdrop");
  const closeButton = shadow.querySelector(".close");
  const tabs = Array.from(shadow.querySelectorAll(".tab"));
  const newView = shadow.querySelector('[data-view="new"]');
  const mineView = shadow.querySelector('[data-view="mine"]');

  let currentTab = "new";
  let currentDetail = null;

  launcher.addEventListener("click", () => {
    backdrop.classList.add("open");
    renderNewForm();
    if (currentTab === "mine") loadMine();
  });

  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && backdrop.classList.contains("open")) close();
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  function close() {
    backdrop.classList.remove("open");
    currentDetail = null;
  }

  function switchTab(tab) {
    currentTab = tab === "mine" ? "mine" : "new";
    tabs.forEach((button) => button.classList.toggle("active", button.dataset.tab === currentTab));
    newView.classList.toggle("active", currentTab === "new");
    mineView.classList.toggle("active", currentTab === "mine");
    if (currentTab === "new") renderNewForm();
    else loadMine();
  }

  function renderNewForm(message = "") {
    const profile = getProfile();
    newView.innerHTML = `
      ${message ? `<div class="success">${escapeHtml(message)}</div>` : ""}
      <form class="new-form">
        <div class="grid2">
          <div class="field"><label>Seu nome</label><input name="reporter_name" maxlength="180" value="${escapeAttr(profile.name || "")}" placeholder="Nome" /></div>
          <div class="field"><label>E-mail</label><input name="reporter_email" type="email" maxlength="320" value="${escapeAttr(profile.email || "")}" placeholder="voce@empresa.com" /></div>
        </div>
        <div class="field"><label>Assunto</label><input name="title" required maxlength="180" placeholder="Ex: Não consigo editar uma reserva" /></div>
        <div class="grid2">
          <div class="field"><label>Tipo</label><select name="category"><option value="bug">Erro / problema</option><option value="simple_adjustment">Ajuste simples</option><option value="improvement">Melhoria</option><option value="new_feature">Nova funcionalidade</option><option value="question">Dúvida</option><option value="other" selected>Outro</option></select></div>
          <div class="field"><label>Prioridade</label><select name="priority"><option value="low">Baixa</option><option value="normal" selected>Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></div>
        </div>
        <div class="field"><label>Descreva o pedido</label><textarea name="description" required maxlength="10000" placeholder="Conte o que aconteceu ou o que você gostaria de alterar..."></textarea></div>
        <div class="error form-error" hidden></div>
        <button class="primary submit-report" type="submit">Enviar solicitação</button>
        <p class="muted" style="margin:10px 2px 0">A página, navegador e tamanho da tela são enviados automaticamente para facilitar a análise técnica.</p>
      </form>
    `;

    const form = newView.querySelector(".new-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector(".submit-report");
      const errorBox = form.querySelector(".form-error");
      submit.disabled = true;
      submit.textContent = "Enviando...";
      errorBox.hidden = true;

      const data = new FormData(form);
      const name = String(data.get("reporter_name") || "").trim();
      const email = String(data.get("reporter_email") || "").trim();
      saveProfile({ name, email });

      try {
        const payload = await api("reports", {
          method: "POST",
          body: JSON.stringify({
            title: String(data.get("title") || "").trim(),
            description: String(data.get("description") || "").trim(),
            category: data.get("category"),
            priority: data.get("priority"),
            reporter_name: name || null,
            reporter_email: email || null,
            source_route: location.pathname + location.search,
            source_url: location.href,
            browser: navigator.userAgent,
            os: navigator.platform || null,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          }),
        });
        rememberReport(payload.report.id);
        renderNewForm(`Solicitação ${payload.report.public_code} enviada com sucesso.`);
        window.setTimeout(() => switchTab("mine"), 900);
      } catch (error) {
        errorBox.textContent = friendlyError(error);
        errorBox.hidden = false;
        submit.disabled = false;
        submit.textContent = "Enviar solicitação";
      }
    });
  }

  async function loadMine() {
    currentDetail = null;
    const ids = getReportIds();
    if (!ids.length) {
      mineView.innerHTML = `<div class="empty">Você ainda não enviou nenhuma solicitação neste dispositivo.<br><button class="secondary go-new" style="margin-top:12px">Criar primeira solicitação</button></div>`;
      mineView.querySelector(".go-new").addEventListener("click", () => switchTab("new"));
      return;
    }

    mineView.innerHTML = `<div class="spinner"></div>`;
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          return await api(`report?report_id=${encodeURIComponent(id)}`);
        } catch {
          return null;
        }
      }),
    );
    const valid = results.filter(Boolean);
    const validIds = valid.map((item) => item.report.id);
    if (validIds.length !== ids.length) setReportIds(validIds);

    if (!valid.length) {
      mineView.innerHTML = `<div class="empty">Não foi possível encontrar solicitações anteriores neste dispositivo.</div>`;
      return;
    }

    valid.sort((a, b) => new Date(b.report.created_at) - new Date(a.report.created_at));
    mineView.innerHTML = "";
    valid.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "report";
      const top = document.createElement("div");
      top.className = "report-top";
      const code = document.createElement("span");
      code.className = "code";
      code.textContent = item.report.public_code;
      const status = document.createElement("span");
      status.className = "status";
      status.textContent = statusLabels[item.report.status] || item.report.status;
      top.append(code, status);
      const titleEl = document.createElement("div");
      titleEl.className = "report-title";
      titleEl.textContent = item.report.title;
      const meta = document.createElement("div");
      meta.className = "report-meta";
      meta.textContent = `${categoryLabels[item.report.category] || "Solicitação"} • ${formatDate(item.report.updated_at)}`;
      button.append(top, titleEl, meta);
      button.addEventListener("click", () => renderDetail(item));
      mineView.appendChild(button);
    });
  }

  function renderDetail(data) {
    currentDetail = data;
    const report = data.report;
    mineView.innerHTML = "";

    const head = document.createElement("div");
    head.className = "detail-head";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "back";
    back.setAttribute("aria-label", "Voltar");
    back.textContent = "←";
    back.addEventListener("click", loadMine);
    const heading = document.createElement("div");
    const code = document.createElement("div");
    code.className = "code";
    code.textContent = report.public_code;
    const titleEl = document.createElement("div");
    titleEl.className = "detail-title";
    titleEl.textContent = report.title;
    heading.append(code, titleEl);
    head.append(back, heading);
    mineView.appendChild(head);

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = statusLabels[report.status] || report.status;
    mineView.appendChild(status);

    const description = document.createElement("div");
    description.className = "description";
    description.style.marginTop = "10px";
    description.textContent = report.description;
    mineView.appendChild(description);

    if (data.quotes && data.quotes.length) {
      const section = createSection("Orçamentos");
      data.quotes.forEach((quote) => section.appendChild(renderQuote(report, quote)));
      mineView.appendChild(section);
    }

    const messagesSection = createSection("Conversa");
    const messages = document.createElement("div");
    messages.className = "messages";
    if (data.messages && data.messages.length) {
      data.messages.forEach((item) => {
        const bubble = document.createElement("div");
        bubble.className = `message ${item.author_type === "client" ? "client" : ""}`;
        const meta = document.createElement("div");
        meta.className = "message-meta";
        meta.textContent = `${item.author_type === "client" ? "Você" : "Glass Maind"} • ${formatDate(item.created_at)}`;
        const body = document.createElement("div");
        body.textContent = item.body;
        bubble.append(meta, body);
        messages.appendChild(bubble);
      });
    } else {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "Nenhuma mensagem ainda.";
      messages.appendChild(empty);
    }
    messagesSection.appendChild(messages);

    const messageForm = document.createElement("form");
    messageForm.className = "message-form";
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Escreva uma mensagem...";
    textarea.maxLength = 10000;
    textarea.required = true;
    const send = document.createElement("button");
    send.type = "submit";
    send.className = "primary";
    send.textContent = "→";
    send.setAttribute("aria-label", "Enviar mensagem");
    messageForm.append(textarea, send);
    messageForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const body = textarea.value.trim();
      if (!body) return;
      send.disabled = true;
      try {
        await api(`messages?report_id=${encodeURIComponent(report.id)}`, {
          method: "POST",
          body: JSON.stringify({ body }),
        });
        await refreshDetail(report.id);
      } catch (error) {
        alert(friendlyError(error));
      } finally {
        send.disabled = false;
      }
    });
    messagesSection.appendChild(messageForm);
    mineView.appendChild(messagesSection);
  }

  function renderQuote(report, quote) {
    const card = document.createElement("div");
    card.className = `quote ${quote.status === "approved" ? "approved" : ""}`;
    const row = document.createElement("div");
    row.className = "report-top";
    const qTitle = document.createElement("div");
    qTitle.className = "quote-title";
    qTitle.textContent = `Orçamento v${quote.version} • ${quote.title}`;
    const qStatus = document.createElement("span");
    qStatus.className = "status";
    qStatus.textContent =
      quote.status === "sent"
        ? "Aguardando sua aprovação"
        : quote.status === "approved"
          ? "Aprovado"
          : quote.status === "rejected"
            ? "Recusado"
            : quote.status === "expired"
              ? "Expirado"
              : quote.status;
    row.append(qTitle, qStatus);
    card.appendChild(row);

    const money = document.createElement("div");
    money.className = "money";
    money.textContent = formatMoney(quote.amount_cents);
    card.appendChild(money);

    if (quote.description) {
      const description = document.createElement("div");
      description.className = "muted";
      description.style.marginTop = "5px";
      description.textContent = quote.description;
      card.appendChild(description);
    }

    if (quote.report_quote_items && quote.report_quote_items.length) {
      const list = document.createElement("ul");
      list.className = "scope";
      [...quote.report_quote_items]
        .sort((a, b) => a.position - b.position)
        .forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.description;
          list.appendChild(li);
        });
      card.appendChild(list);
    }

    if (quote.estimated_days_min != null || quote.estimated_days_max != null) {
      const deadline = document.createElement("div");
      deadline.className = "muted";
      deadline.style.marginTop = "7px";
      const min = quote.estimated_days_min ?? quote.estimated_days_max;
      const max = quote.estimated_days_max ?? quote.estimated_days_min;
      deadline.textContent = `Prazo estimado: ${min}${min !== max ? ` a ${max}` : ""} dias úteis`;
      card.appendChild(deadline);
    }

    if (quote.valid_until) {
      const validity = document.createElement("div");
      validity.className = "muted";
      validity.textContent = `Válido até ${formatDateOnly(quote.valid_until)}`;
      card.appendChild(validity);
    }

    if (quote.status === "sent") {
      const actions = document.createElement("div");
      actions.className = "actions";
      const approve = document.createElement("button");
      approve.type = "button";
      approve.className = "primary";
      approve.textContent = "Aprovar orçamento";
      const reject = document.createElement("button");
      reject.type = "button";
      reject.className = "secondary danger";
      reject.textContent = "Não aprovar";
      approve.addEventListener("click", async () => {
        if (!confirm(`Confirmar a aprovação de ${formatMoney(quote.amount_cents)}?`)) return;
        const profile = getProfile();
        approve.disabled = true;
        reject.disabled = true;
        try {
          await api(`approve-quote?report_id=${encodeURIComponent(report.id)}`, {
            method: "POST",
            body: JSON.stringify({
              quote_id: quote.id,
              name: profile.name || null,
              email: profile.email || null,
            }),
          });
          await refreshDetail(report.id);
        } catch (error) {
          alert(friendlyError(error));
          approve.disabled = false;
          reject.disabled = false;
        }
      });
      reject.addEventListener("click", async () => {
        if (!confirm("Tem certeza que deseja recusar este orçamento?")) return;
        approve.disabled = true;
        reject.disabled = true;
        try {
          await api(`reject-quote?report_id=${encodeURIComponent(report.id)}`, {
            method: "POST",
            body: JSON.stringify({ quote_id: quote.id }),
          });
          await refreshDetail(report.id);
        } catch (error) {
          alert(friendlyError(error));
          approve.disabled = false;
          reject.disabled = false;
        }
      });
      actions.append(approve, reject);
      card.appendChild(actions);
    }

    if (quote.status === "approved") {
      const approved = document.createElement("div");
      approved.className = "muted";
      approved.style.marginTop = "8px";
      approved.textContent = "✓ Aprovado e registrado no Fluxa";
      card.appendChild(approved);
    }

    return card;
  }

  async function refreshDetail(reportId) {
    mineView.innerHTML = `<div class="spinner"></div>`;
    try {
      const data = await api(`report?report_id=${encodeURIComponent(reportId)}`);
      renderDetail(data);
    } catch (error) {
      mineView.innerHTML = `<div class="error"></div>`;
      mineView.querySelector(".error").textContent = friendlyError(error);
    }
  }

  function createSection(title) {
    const section = document.createElement("section");
    section.className = "section";
    const heading = document.createElement("div");
    heading.className = "section-title";
    heading.textContent = title;
    section.appendChild(heading);
    return section;
  }

  async function api(path, init = {}) {
    const headers = new Headers(init.headers || {});
    headers.set("x-fluxa-project-key", projectKey);
    if (init.body) headers.set("Content-Type", "application/json");
    const response = await fetch(`${API}/${path}`, { ...init, headers });
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      /* no-op */
    }
    if (!response.ok) {
      const error = new Error(payload.error || `Falha na comunicação (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function rememberReport(id) {
    const ids = getReportIds();
    setReportIds([id, ...ids.filter((value) => value !== id)].slice(0, 100));
  }

  function getReportIds() {
    try {
      const value = JSON.parse(localStorage.getItem(idsKey) || "[]");
      return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  function setReportIds(ids) {
    try {
      localStorage.setItem(idsKey, JSON.stringify(ids));
    } catch {
      /* private mode/storage disabled */
    }
  }

  function getProfile() {
    try {
      const value = JSON.parse(localStorage.getItem(profileKey) || "{}");
      return {
        name: typeof value.name === "string" ? value.name : "",
        email: typeof value.email === "string" ? value.email : "",
      };
    } catch {
      return { name: "", email: "" };
    }
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
    } catch {
      /* no-op */
    }
  }

  function friendlyError(error) {
    const message =
      error && error.message ? String(error.message) : "Não foi possível concluir a solicitação.";
    if (message.includes("Origin not allowed"))
      return "Este domínio ainda não foi autorizado no Fluxa. Entre em contato com o suporte.";
    if (message.includes("Invalid or revoked project key"))
      return "A integração deste sistema precisa ser reconectada ao Fluxa.";
    if (message.includes("rate limit"))
      return "Muitas solicitações foram enviadas em pouco tempo. Tente novamente em alguns minutos.";
    if (message.includes("expired"))
      return "Este orçamento expirou. Envie uma mensagem para solicitar uma atualização.";
    return message;
  }

  function formatMoney(cents) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      (Number(cents) || 0) / 100,
    );
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(value),
      );
    } catch {
      return "";
    }
  }

  function formatDateOnly(value) {
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" }).format(
        new Date(`${value}T00:00:00Z`),
      );
    } catch {
      return value;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
    );
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  renderNewForm();
})();
