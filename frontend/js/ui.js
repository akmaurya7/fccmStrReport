export const showToast = (message, type = "success") => {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "alert");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
};

export const setLoader = (show) => {
  const overlay = document.getElementById("loaderOverlay");
  overlay.classList.toggle("active", show);
  overlay.setAttribute("aria-hidden", show ? "false" : "true");
};

export const openModal = ({ title, message, onConfirm, confirmText = "Confirm", isSuccess = false }) => {
  const root = document.getElementById("modalRoot");
  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal">
        <header><h3>${title}</h3></header>
        <div class="content"><p>${message}</p></div>
        <div class="actions">
          ${isSuccess ? "" : '<button type="button" class="btn btn-secondary" data-modal-close="1">Cancel</button>'}
          <button type="button" class="btn btn-primary" data-modal-confirm="1">${confirmText}</button>
        </div>
      </div>
    </div>`;

  const close = () => (root.innerHTML = "");
  root.querySelector("[data-modal-close]")?.addEventListener("click", close);
  root.querySelector("[data-modal-confirm]")?.addEventListener("click", () => {
    close();
    if (typeof onConfirm === "function") onConfirm();
  });
};

export const updateProgress = () => {
  const sections = [...document.querySelectorAll(".form-section[data-section]")];
  const top = window.scrollY + 150;
  let current = 1;
  sections.forEach((s) => {
    if (s.offsetTop <= top) current = Number(s.dataset.section);
  });
  const text = document.getElementById("progressText");
  if (text) text.textContent = `Section ${current} of 8`;
};

export const renderReview = () => {
  const panel = document.getElementById("reviewPanel");
  if (!panel) return;

  const cleanLabel = (label) => label.replace("*", "").trim();
  const safeValue = (el) => {
    if (el.type === "date" && el.value) return new Date(`${el.value}T00:00:00`).toLocaleDateString();
    return el.value.trim();
  };
  const pair = (label, value) => `<div class="review-item"><strong>${label}:</strong> ${value}</div>`;
  const collectPairs = (root) => {
    const fields = [...root.querySelectorAll("input, select, textarea")]
      .filter((el) => el.type !== "file" && !el.closest("datalist") && !el.closest("[hidden]"));
    return fields
      .filter((el) => el.value && el.labels?.[0])
      .map((el) => pair(cleanLabel(el.labels[0].textContent), safeValue(el)));
  };
  const sectionBlock = (title, content) => `
    <section class="review-section">
      <h4>${title}</h4>
      ${content}
    </section>`;
  const subBlock = (title, items) => `
    <article class="review-subsection">
      <h5>${title}</h5>
      <div class="review-grid">${items.join("")}</div>
    </article>`;

  const output = [];

  const staticSections = [
    ["1. Reporting Entity", document.getElementById("section-reporting-entity")],
    ["2. Report Details", document.getElementById("section-report-details")],
    ["6. Suspicion Details", document.getElementById("section-suspicion-details")]
  ];

  staticSections.forEach(([title, node]) => {
    if (!node) return;
    const items = collectPairs(node);
    output.push(sectionBlock(title, items.length ? `<div class="review-grid">${items.join("")}</div>` : `<p class="hint">No values entered.</p>`));
  });

  const txCards = [...document.querySelectorAll("#transactionsList .dynamic-card")];
  output.push(sectionBlock(
    "3. Transactions",
    txCards.length
      ? txCards.map((card) => subBlock(card.querySelector("h3")?.textContent || "Transaction", collectPairs(card).length ? collectPairs(card) : [pair("Status", "No values entered")])).join("")
      : `<p class="hint">No transactions added.</p>`
  ));

  const participantCards = [...document.querySelectorAll("#participantsList .dynamic-card")];
  output.push(sectionBlock(
    "4. Transaction Participants",
    participantCards.length
      ? participantCards.map((card) => subBlock(card.querySelector("h3")?.textContent || "Participant", collectPairs(card).length ? collectPairs(card) : [pair("Status", "No values entered")])).join("")
      : `<p class="hint">No participants added.</p>`
  ));

  const accountCards = [...document.querySelectorAll("#accountsList .dynamic-card")];
  output.push(sectionBlock(
    "5. Transaction Accounts",
    accountCards.length
      ? accountCards.map((accountCard) => {
        const accountTitle = accountCard.querySelector(":scope > .card-head h3")?.textContent || "Account";
        const accountRootGrid = accountCard.querySelector(":scope > .card-body > .grid");
        const accountFields = accountRootGrid ? collectPairs(accountRootGrid) : [];
        const ownerCards = [...accountCard.querySelectorAll('[data-owner-id]')];
        const owners = ownerCards.length
          ? ownerCards.map((ownerCard) => subBlock(ownerCard.querySelector("h3")?.textContent || "Owner", collectPairs(ownerCard).length ? collectPairs(ownerCard) : [pair("Status", "No values entered")])).join("")
          : `<p class="hint">No owners added.</p>`;
        return subBlock(accountTitle, accountFields.length ? accountFields : [pair("Status", "No values entered")]) + owners;
      }).join("")
      : `<p class="hint">No accounts added.</p>`
  ));

  const documentCards = [...document.querySelectorAll("#documentsList .dynamic-card")];
  output.push(sectionBlock(
    "7. Supporting Documents",
    documentCards.length
      ? documentCards.map((card) => subBlock(card.querySelector("h3")?.textContent || "Document", collectPairs(card).length ? collectPairs(card) : [pair("Status", "No values entered")])).join("")
      : `<p class="hint">No documents added.</p>`
  ));

  panel.innerHTML = output.join("") || "<p>No data entered yet.</p>";
};

export const setValidationSummary = (messages = []) => {
  const box = document.getElementById("validationSummary");
  if (!messages.length) {
    box.style.display = "none";
    box.innerHTML = "";
    return;
  }
  box.style.display = "block";
  box.innerHTML = `<strong>Please resolve the following issues:</strong><ul>${messages.map((m) => `<li>${m}</li>`).join("")}</ul>`;
};

export const buildSectionNav = (titles) => {
  const list = document.getElementById("sectionNavList");
  list.innerHTML = titles
    .map((title, i) => `<li><a href="#section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${i + 1}. ${title}</a></li>`)
    .join("");
};
