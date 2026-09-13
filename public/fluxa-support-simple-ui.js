(() => {
  "use strict";

  function patch() {
    const host = document.getElementById("fluxa-support-root");
    const root = host?.shadowRoot;
    if (!root) return;

    if (!root.getElementById("fluxa-simple-style")) {
      const style = document.createElement("style");
      style.id = "fluxa-simple-style";
      style.textContent = `
        .fx-simple-zone{position:relative;display:grid;place-items:center;min-height:190px;padding:16px;border:1px dashed rgba(112,221,241,.32);border-radius:15px;background:rgba(69,199,223,.035);text-align:center;overflow:hidden;transition:.15s ease;margin-bottom:13px}
        .fx-simple-zone:hover,.fx-simple-zone.drag{border-color:rgba(112,221,241,.62);background:rgba(69,199,223,.065)}
        .fx-simple-zone input{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;display:block!important;cursor:pointer!important}
        .fx-simple-icon{font-size:25px}.fx-simple-title{margin-top:8px;color:#dceff3;font-size:11px;font-weight:800}.fx-simple-sub{margin-top:4px;color:#728990;font-size:9.5px;line-height:1.45}
        .fx-simple-preview{width:100%}.fx-simple-preview img{display:block;width:100%;max-height:260px;object-fit:contain;border-radius:11px;background:#071014}.fx-simple-preview-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;color:#82979f;font-size:9.5px}.fx-simple-remove{position:relative;z-index:5;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.035);color:#f0aaaa;padding:6px 8px;font-size:9px}
        .fx-simple-error{margin-bottom:10px;padding:9px 10px;border:1px solid rgba(236,91,91,.16);border-radius:10px;background:rgba(236,91,91,.07);color:#efb2b2;font-size:10.5px;line-height:1.4}
      `;
      root.appendChild(style);
    }

    const form = root.querySelector('form[data-form="new"]');
    if (!form || form.dataset.simplePatched === "true") return;
    form.dataset.simplePatched = "true";

    root.querySelector(".tabs")?.style.setProperty("display", "none", "important");
    root.querySelector(".intro")?.style.setProperty("display", "none", "important");

    const labels = Array.from(form.querySelectorAll("label"));
    const byText = (text) => labels.find((label) => label.textContent?.trim().toLowerCase().startsWith(text));
    const hideField = (text) => {
      const label = byText(text);
      if (!label) return null;
      const control = label.nextElementSibling;
      label.style.display = "none";
      if (control && /^(INPUT|SELECT)$/.test(control.tagName)) control.style.display = "none";
      return control;
    };

    const nameInput = hideField("seu nome");
    const areaSelect = hideField("área do sistema");
    const titleInput = hideField("título");
    const descriptionLabel = byText("descrição");
    if (descriptionLabel) descriptionLabel.textContent = "O que você precisa?";
    const grid = form.querySelector(".grid");
    if (grid) grid.style.display = "none";

    const typeSelect = grid?.querySelector('select[name="type"]');
    const prioritySelect = grid?.querySelector('select[name="priority"]');
    if (typeSelect) typeSelect.value = "other";
    if (prioritySelect) prioritySelect.value = "normal";
    if (areaSelect) areaSelect.value = "Outro";
    if (nameInput) nameInput.value = "";

    const oldFileLabel = Array.from(form.querySelectorAll("label")).find((label) => label.classList.contains("file"));
    const fileInput = oldFileLabel?.querySelector('input[type="file"]');
    const attachmentTitle = labels.find((label) => label.textContent?.trim().toLowerCase() === "anexo opcional");
    if (attachmentTitle) attachmentTitle.style.display = "none";
    if (!fileInput || !oldFileLabel) return;
    oldFileLabel.style.display = "none";
    fileInput.accept = "image/png,image/jpeg,image/webp";

    const zone = document.createElement("div");
    zone.className = "fx-simple-zone";
    zone.innerHTML = '<div class="fx-simple-empty"><div class="fx-simple-icon">⌘</div><div class="fx-simple-title">Cole o print aqui</div><div class="fx-simple-sub">Use Ctrl + V, arraste a imagem ou clique para selecionar</div></div>';
    zone.appendChild(fileInput);
    form.insertBefore(zone, descriptionLabel || form.firstChild);

    const errorBox = document.createElement("div");
    errorBox.className = "fx-simple-error";
    errorBox.hidden = true;
    form.insertBefore(errorBox, zone);

    function showError(message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
    }

    function preview(file) {
      if (!(file instanceof File) || !file.type.startsWith("image/")) return showError("Cole ou selecione um print em PNG, JPG ou WEBP.");
      if (!file.size || file.size > 10485760) return showError("O print deve ter no máximo 10 MB.");
      errorBox.hidden = true;
      const reader = new FileReader();
      reader.onload = () => {
        const input = zone.querySelector('input[type="file"]');
        zone.innerHTML = `<div class="fx-simple-preview"><img alt="Print selecionado"><div class="fx-simple-preview-row"><span>Print pronto para enviar</span><button class="fx-simple-remove" type="button">Remover</button></div></div>`;
        zone.querySelector("img").src = String(reader.result || "");
        zone.appendChild(input);
        zone.querySelector(".fx-simple-remove")?.addEventListener("click", (event) => {
          event.preventDefault();
          const dt = new DataTransfer();
          input.files = dt.files;
          zone.innerHTML = '<div class="fx-simple-empty"><div class="fx-simple-icon">⌘</div><div class="fx-simple-title">Cole o print aqui</div><div class="fx-simple-sub">Use Ctrl + V, arraste a imagem ou clique para selecionar</div></div>';
          zone.appendChild(input);
        });
      };
      reader.readAsDataURL(file);
    }

    function setFile(file) {
      if (!(file instanceof File)) return;
      let normalized = file;
      if (!/\.(png|jpe?g|webp)$/i.test(file.name || "")) {
        const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/webp" ? "webp" : "png";
        normalized = new File([file], `print-${Date.now()}.${ext}`, { type: file.type || `image/${ext}` });
      }
      const dt = new DataTransfer();
      dt.items.add(normalized);
      fileInput.files = dt.files;
      preview(normalized);
    }

    fileInput.addEventListener("change", () => fileInput.files?.[0] && preview(fileInput.files[0]));
    zone.addEventListener("dragover", (event) => { event.preventDefault(); zone.classList.add("drag"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone.addEventListener("drop", (event) => { event.preventDefault(); zone.classList.remove("drag"); setFile(event.dataTransfer?.files?.[0]); });
    form.addEventListener("paste", (event) => {
      const item = Array.from(event.clipboardData?.items || []).find((entry) => entry.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) { event.preventDefault(); setFile(file); }
    });

    form.addEventListener("submit", (event) => {
      errorBox.hidden = true;
      if (!fileInput.files?.length) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return showError("Cole ou selecione o print antes de enviar.");
      }
      const description = form.querySelector('textarea[name="description"]')?.value.trim() || "";
      if (!description) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return showError("Descreva o que você precisa.");
      }
      if (titleInput) titleInput.value = (description.split(/\r?\n/).find((line) => line.trim()) || "Solicitação com print").slice(0, 180);
      if (areaSelect) areaSelect.value = "Outro";
      if (typeSelect) typeSelect.value = "other";
      if (prioritySelect) prioritySelect.value = "normal";
    }, true);
  }

  const observer = new MutationObserver(patch);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  patch();
})();
