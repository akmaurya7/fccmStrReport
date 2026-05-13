import { SECTION_TITLES, MAX } from "./constants.js";
import {
  transactionCard,
  participantCard,
  individualParticipantBody,
  legalParticipantBody,
  accountCard,
  ownerCard,
  individualOwnerBody,
  legalOwnerBody,
  documentCard
} from "./templates.js";
import { validators, validateAll, scrollFirstError, applyValidation, clearValidation } from "./validation.js";
import { showToast, openModal, setLoader, updateProgress, renderReview, setValidationSummary, buildSectionNav } from "./ui.js";

const state = {
  seq: 1,
  transactions: [],
  participants: [],
  accounts: [],
  documents: []
};

const uid = (prefix) => `${prefix}${state.seq++}`;
const byId = (id) => document.getElementById(id);

const mountStatic = () => {
  buildSectionNav(SECTION_TITLES);
};

const addTransaction = () => {
  const id = uid("t");
  state.transactions.push({ id });
  renderTransactions();
};
const removeTransaction = (id) => {
  state.transactions = state.transactions.filter((x) => x.id !== id);
  renderTransactions();
};
const renderTransactions = () => {
  byId("transactionsList").innerHTML = state.transactions.map((t, i) => transactionCard(t.id, i)).join("");
};

const participantBodyForType = (type, id) => {
  if (type === "Individual") return individualParticipantBody(id);
  return legalParticipantBody(id);
};
const togglePassportCountryField = (participantId) => {
  const idType = byId(`idType_${participantId}`);
  const countryWrap = byId(`passportCountryWrap_${participantId}`);
  const country = byId(`passportCountry_${participantId}`);
  if (!idType || !countryWrap || !country) return;
  const show = idType.value === "Passport";
  countryWrap.hidden = !show;
  country.required = show;
  if (!show) {
    country.value = "";
    const error = byId(`${country.id}Error`);
    if (error) error.textContent = "";
    country.classList.remove("input-invalid");
    country.setAttribute("aria-invalid", "false");
  }
};
const ownerBodyForType = (type, id) => {
  if (type === "Individual") return individualOwnerBody(id);
  return legalOwnerBody(id);
};
const toggleOwnerPassportCountryField = (ownerId) => {
  const idType = byId(`ownerIdType_${ownerId}`);
  const countryWrap = byId(`ownerPassportCountryWrap_${ownerId}`);
  const country = byId(`ownerPassportCountry_${ownerId}`);
  if (!idType || !countryWrap || !country) return;
  const show = idType.value === "Passport";
  countryWrap.hidden = !show;
  country.required = show;
  if (!show) {
    country.value = "";
    const error = byId(`${country.id}Error`);
    if (error) error.textContent = "";
    country.classList.remove("input-invalid");
    country.setAttribute("aria-invalid", "false");
  }
};
const addParticipant = () => {
  const id = uid("p");
  state.participants.push({ id, type: "Individual" });
  renderParticipants();
};
const removeParticipant = (id) => {
  state.participants = state.participants.filter((x) => x.id !== id);
  renderParticipants();
};
const renderParticipants = () => {
  byId("participantsList").innerHTML = state.participants.map((p, i) => participantCard(p.id, i)).join("");
  state.participants.forEach((p) => {
    const select = byId(`participantType_${p.id}`);
    if (select) select.value = p.type;
    const body = byId(`participantBody_${p.id}`);
    if (body) {
      body.innerHTML = participantBodyForType(p.type, p.id);
      if (p.type === "Individual") {
        const idType = byId(`idType_${p.id}`);
        if (idType && !idType.value) idType.value = "Tazkira";
        togglePassportCountryField(p.id);
      }
    }
  });
};

const addAccount = () => {
  const id = uid("a");
  state.accounts.push({ id, owners: [] });
  renderAccounts();
};
const removeAccount = (id) => {
  state.accounts = state.accounts.filter((a) => a.id !== id);
  renderAccounts();
};
const addOwner = (accountId) => {
  const account = state.accounts.find((a) => a.id === accountId);
  if (!account) return;
  account.owners.push({ id: uid("o"), type: "Individual" });
  renderAccounts();
};
const removeOwner = (accountId, ownerId) => {
  const account = state.accounts.find((a) => a.id === accountId);
  if (!account) return;
  account.owners = account.owners.filter((o) => o.id !== ownerId);
  renderAccounts();
};
const renderAccounts = () => {
  byId("accountsList").innerHTML = state.accounts.map((a, i) => accountCard(a.id, i)).join("");
  state.accounts.forEach((a) => {
    const holder = byId(`owners_${a.id}`);
    if (holder) holder.innerHTML = a.owners.map((o, i) => ownerCard(a.id, o.id, i)).join("");
    a.owners.forEach((o) => {
      const typeSelect = byId(`ownerType_${o.id}`);
      if (typeSelect) typeSelect.value = o.type || "Individual";
      const body = byId(`ownerBody_${o.id}`);
      if (body) {
        body.innerHTML = ownerBodyForType(o.type || "Individual", o.id);
        if ((o.type || "Individual") === "Individual") {
          const idType = byId(`ownerIdType_${o.id}`);
          if (idType && !idType.value) idType.value = "Tazkira";
          toggleOwnerPassportCountryField(o.id);
        }
      }
    });
  });
};

const addDocument = () => {
  const id = uid("d");
  state.documents.push({ id });
  renderDocuments();
};
const removeDocument = (id) => {
  state.documents = state.documents.filter((d) => d.id !== id);
  renderDocuments();
};
const renderDocuments = () => {
  byId("documentsList").innerHTML = state.documents.map((d, i) => documentCard(d.id, i)).join("");
};

const toggleUpdateFields = () => {
  const value = byId("reportType")?.value;
  const wrap = byId("updateOnlyFields");
  const reportIdentifier = byId("reportIdentifier");
  const submitDate = byId("submitDate");
  const show = value === "Update";
  wrap.hidden = !show;
  reportIdentifier.required = show;
  submitDate.required = show;
};

const validateStatic = () => {
  const fields = [
    { el: byId("entityId"), checks: [() => validators.required(byId("entityId"), "Reporting Entity ID"), () => validators.alphaNum(byId("entityId"), "Reporting Entity ID"), () => validators.maxLen(byId("entityId"), MAX.entityId, "Reporting Entity ID")] },
    { el: byId("reportType"), checks: [() => validators.required(byId("reportType"), "Report Type")] },
    { el: byId("transactionStatus"), checks: [() => validators.required(byId("transactionStatus"), "Transaction Status")] },
    { el: byId("prepDate"), checks: [() => validators.dateRequired(byId("prepDate"), "Report Preparation Date")] },
    { el: byId("transmissionDate"), checks: [() => validators.dateRequired(byId("transmissionDate"), "Report Transmission Date")] },
    { el: byId("suspicionType"), checks: [() => validators.required(byId("suspicionType"), "Suspicion Category")] },
    { el: byId("suspicionDescription"), checks: [() => validators.suspicionDescription(byId("suspicionDescription"))] }
  ];
  if (byId("reportType")?.value === "Update") {
    fields.push({ el: byId("reportIdentifier"), checks: [() => validators.reportIdentifier(byId("reportIdentifier"))] });
    fields.push({ el: byId("submitDate"), checks: [() => validators.dateRequired(byId("submitDate"), "Submit Date")] });
  }
  return validateAll(fields);
};

const validateDynamic = () => {
  let ok = true;
  const checks = [];

  state.transactions.forEach(({ id }) => {
    checks.push({ el: byId(`txDate_${id}`), checks: [() => validators.dateRequired(byId(`txDate_${id}`), "Transaction Date")] });
    checks.push({ el: byId(`txAmount_${id}`), checks: [() => validators.amount(byId(`txAmount_${id}`))] });
    checks.push({ el: byId(`txCurrency_${id}`), checks: [() => validators.required(byId(`txCurrency_${id}`), "Currency"), () => validators.currency(byId(`txCurrency_${id}`))] });
    checks.push({ el: byId(`txType_${id}`), checks: [() => validators.required(byId(`txType_${id}`), "Transaction Type")] });
    checks.push({ el: byId(`txProvince_${id}`), checks: [() => validators.required(byId(`txProvince_${id}`), "Province"), () => validators.province(byId(`txProvince_${id}`))] });
    checks.push({ el: byId(`txBranch_${id}`), checks: [() => validators.required(byId(`txBranch_${id}`), "Branch"), () => validators.alphaNum(byId(`txBranch_${id}`), "Branch")] });
  });

  state.participants.forEach(({ id, type }) => {
    checks.push({ el: byId(`participantType_${id}`), checks: [() => validators.required(byId(`participantType_${id}`), "Participant Type")] });
    checks.push({ el: byId(`participantRole_${id}`), checks: [() => validators.required(byId(`participantRole_${id}`), "Participant Role")] });
    if (type === "Individual") {
      ["firstName", "lastName", "fatherFirst", "fatherLast"].forEach((k) => checks.push({ el: byId(`${k}_${id}`), checks: [() => validators.name(byId(`${k}_${id}`), byId(`${k}_${id}`).labels[0].textContent.replace("*", "").trim())] }));
      checks.push({ el: byId(`idType_${id}`), checks: [() => validators.required(byId(`idType_${id}`), "ID Type")] });
      if (byId(`idType_${id}`)?.value === "Passport") {
        checks.push({ el: byId(`passportCountry_${id}`), checks: [() => validators.required(byId(`passportCountry_${id}`), "Country")] });
      }
      checks.push({ el: byId(`idNumber_${id}`), checks: [() => validators.required(byId(`idNumber_${id}`), "ID Number")] });
      checks.push({ el: byId(`dob_${id}`), checks: [() => validators.dateRequired(byId(`dob_${id}`), "DOB")] });
      ["house", "street", "district", "location", "city", "mobilePhone"].forEach((k) => checks.push({ el: byId(`${k}_${id}`), checks: [() => validators.required(byId(`${k}_${id}`), byId(`${k}_${id}`).labels[0].textContent.replace("*", "").trim())] }));
      ["homePhone", "businessPhone"].forEach((k) => checks.push({ el: byId(`${k}_${id}`), checks: [() => validators.phoneOptional(byId(`${k}_${id}`), byId(`${k}_${id}`).labels[0].textContent.replace("*", "").trim())] }));
      checks.push({ el: byId(`mobilePhone_${id}`), checks: [() => validators.phoneRequired(byId(`mobilePhone_${id}`), "Mobile Phone")] });
    } else {
      checks.push({ el: byId(`tin_${id}`), checks: [() => validators.required(byId(`tin_${id}`), "TIN"), () => validators.tin(byId(`tin_${id}`))] });
      checks.push({ el: byId(`legalName_${id}`), checks: [() => validators.required(byId(`legalName_${id}`), "Legal Entity Full Name")] });
      checks.push({ el: byId(`legalHouse_${id}`), checks: [() => validators.required(byId(`legalHouse_${id}`), "House Number")] });
      checks.push({ el: byId(`legalStreet_${id}`), checks: [() => validators.required(byId(`legalStreet_${id}`), "Street Name")] });
      checks.push({ el: byId(`legalDistrict_${id}`), checks: [() => validators.required(byId(`legalDistrict_${id}`), "District Name")] });
      checks.push({ el: byId(`legalLocation_${id}`), checks: [() => validators.required(byId(`legalLocation_${id}`), "Location Name")] });
      checks.push({ el: byId(`legalCity_${id}`), checks: [() => validators.required(byId(`legalCity_${id}`), "City Name")] });
      checks.push({ el: byId(`legalBusinessPhone_${id}`), checks: [() => validators.phoneOptional(byId(`legalBusinessPhone_${id}`), "Business Phone")] });
      checks.push({ el: byId(`legalHomePhone_${id}`), checks: [() => validators.phoneOptional(byId(`legalHomePhone_${id}`), "Home Phone")] });
      checks.push({ el: byId(`legalMobilePhone_${id}`), checks: [() => validators.phoneRequired(byId(`legalMobilePhone_${id}`), "Mobile Phone")] });
    }
  });

  state.accounts.forEach((a) => {
    checks.push({ el: byId(`acctNo_${a.id}`), checks: [() => validators.required(byId(`acctNo_${a.id}`), "Account Number"), () => validators.account(byId(`acctNo_${a.id}`))] });
    checks.push({ el: byId(`acctType_${a.id}`), checks: [() => validators.required(byId(`acctType_${a.id}`), "Account Type")] });
    checks.push({ el: byId(`bankName_${a.id}`), checks: [() => validators.required(byId(`bankName_${a.id}`), "Bank Name")] });
    checks.push({ el: byId(`bankAddress_${a.id}`), checks: [() => validators.required(byId(`bankAddress_${a.id}`), "Bank Address")] });
    a.owners.forEach((o) => {
      checks.push({ el: byId(`ownerType_${o.id}`), checks: [() => validators.required(byId(`ownerType_${o.id}`), "Owner Type")] });
      if ((o.type || "Individual") === "Individual") {
        ["ownerFirstName", "ownerLastName", "ownerFatherFirst", "ownerFatherLast"].forEach((k) => checks.push({ el: byId(`${k}_${o.id}`), checks: [() => validators.name(byId(`${k}_${o.id}`), byId(`${k}_${o.id}`).labels[0].textContent.replace("*", "").trim())] }));
        checks.push({ el: byId(`ownerIdType_${o.id}`), checks: [() => validators.required(byId(`ownerIdType_${o.id}`), "ID Type")] });
        if (byId(`ownerIdType_${o.id}`)?.value === "Passport") {
          checks.push({ el: byId(`ownerPassportCountry_${o.id}`), checks: [() => validators.required(byId(`ownerPassportCountry_${o.id}`), "Country")] });
        }
        checks.push({ el: byId(`ownerIdNumber_${o.id}`), checks: [() => validators.required(byId(`ownerIdNumber_${o.id}`), "ID Number")] });
        checks.push({ el: byId(`ownerDob_${o.id}`), checks: [() => validators.dateRequired(byId(`ownerDob_${o.id}`), "DOB")] });
        ["ownerHouse", "ownerStreet", "ownerDistrict", "ownerLocation", "ownerCity"].forEach((k) => checks.push({ el: byId(`${k}_${o.id}`), checks: [() => validators.required(byId(`${k}_${o.id}`), byId(`${k}_${o.id}`).labels[0].textContent.replace("*", "").trim())] }));
        checks.push({ el: byId(`ownerMobilePhone_${o.id}`), checks: [() => validators.phoneRequired(byId(`ownerMobilePhone_${o.id}`), "Mobile Phone")] });
        ["ownerHomePhone", "ownerBusinessPhone"].forEach((k) => checks.push({ el: byId(`${k}_${o.id}`), checks: [() => validators.phoneOptional(byId(`${k}_${o.id}`), byId(`${k}_${o.id}`).labels[0].textContent.replace("*", "").trim())] }));
      } else {
        checks.push({ el: byId(`ownerTin_${o.id}`), checks: [() => validators.required(byId(`ownerTin_${o.id}`), "TIN"), () => validators.tin(byId(`ownerTin_${o.id}`))] });
        checks.push({ el: byId(`ownerLegalName_${o.id}`), checks: [() => validators.required(byId(`ownerLegalName_${o.id}`), "Legal Entity Full Name")] });
        ["ownerLegalHouse", "ownerLegalStreet", "ownerLegalDistrict", "ownerLegalLocation", "ownerLegalCity"].forEach((k) => checks.push({ el: byId(`${k}_${o.id}`), checks: [() => validators.required(byId(`${k}_${o.id}`), byId(`${k}_${o.id}`).labels[0].textContent.replace("*", "").trim())] }));
        checks.push({ el: byId(`ownerLegalMobilePhone_${o.id}`), checks: [() => validators.phoneRequired(byId(`ownerLegalMobilePhone_${o.id}`), "Mobile Phone")] });
        ["ownerLegalHomePhone", "ownerLegalBusinessPhone"].forEach((k) => checks.push({ el: byId(`${k}_${o.id}`), checks: [() => validators.phoneOptional(byId(`${k}_${o.id}`), byId(`${k}_${o.id}`).labels[0].textContent.replace("*", "").trim())] }));
      }
    });
  });

  state.documents.forEach(({ id }) => {
    checks.push({ el: byId(`docFile_${id}`), checks: [() => validators.file(byId(`docFile_${id}`))] });
    ["docName", "docType", "docIdentifier", "docDate", "docPreparer"].forEach((k) => {
      const el = byId(`${k}_${id}`);
      checks.push({ el, checks: [() => validators.required(el, el.labels[0].textContent.replace("*", "").trim())] });
    });
    checks.push({ el: byId(`docDate_${id}`), checks: [() => validators.dateRequired(byId(`docDate_${id}`), "Document Date")] });
  });

  ok = validateAll(checks) && ok;
  if (state.participants.length < 2) {
    ok = false;
    showToast("At least two participants are required.", "error");
  }
  return ok;
};

const fieldLiveValidate = (target) => {
  if (!target || !target.id) return;
  const id = target.id;
  if (id === "suspicionDescription") return applyValidation(target, [() => validators.suspicionDescription(target)]);
  if (id.startsWith("txAmount_")) return applyValidation(target, [() => validators.amount(target)]);
  if (id.startsWith("txDate_") || id === "prepDate" || id === "transmissionDate" || id === "submitDate" || id.startsWith("docDate_")) return applyValidation(target, [() => validators.dateRequired(target, target.labels[0].textContent.replace("*", "").trim())]);
  if (id.startsWith("docFile_")) return applyValidation(target, [() => validators.file(target)]);
  if (/Phone_/.test(id) || id.includes("Phone")) {
    const isRequired = target.required;
    return applyValidation(target, [() => (isRequired ? validators.phoneRequired(target, target.labels[0].textContent.replace("*", "").trim()) : validators.phoneOptional(target, target.labels[0].textContent.replace("*", "").trim()))]);
  }
  if (id.startsWith("acctNo_")) return applyValidation(target, [() => validators.account(target)]);
  if (id.startsWith("tin_")) return applyValidation(target, [() => validators.tin(target)]);
  if (id.startsWith("txCurrency_")) return applyValidation(target, [() => validators.required(target, "Currency"), () => validators.currency(target)]);
  if (id.startsWith("txProvince_")) return applyValidation(target, [() => validators.required(target, "Province"), () => validators.province(target)]);
  if (id.startsWith("passportCountry_")) return applyValidation(target, [() => validators.required(target, "Country")]);
  if (id.startsWith("ownerPassportCountry_")) return applyValidation(target, [() => validators.required(target, "Country")]);
  if (/Name_|firstName_|lastName_|father/.test(id) && !id.startsWith("legalName_")) return applyValidation(target, [() => target.required ? validators.name(target, target.labels[0].textContent.replace("*", "").trim()) : ""]);
  if (id === "reportIdentifier") return applyValidation(target, [() => validators.reportIdentifier(target)]);
  if (id === "entityId") return applyValidation(target, [() => validators.required(target, target.labels[0].textContent.replace("*", "").trim()), () => validators.alphaNum(target, target.labels[0].textContent.replace("*", "").trim())]);
  return applyValidation(target, [() => target.required ? validators.required(target, target.labels[0].textContent.replace("*", "").trim()) : ""]);
};

const handleAction = (btn) => {
  const action = btn.dataset.action;
  if (!action) return;
  if (action === "add-transaction") addTransaction();
  if (action === "remove-transaction") removeTransaction(btn.dataset.id);
  if (action === "add-participant") addParticipant();
  if (action === "remove-participant") removeParticipant(btn.dataset.id);
  if (action === "add-account") addAccount();
  if (action === "remove-account") removeAccount(btn.dataset.id);
  if (action === "add-owner") addOwner(btn.dataset.id);
  if (action === "remove-owner") removeOwner(btn.dataset.accountId, btn.dataset.id);
  if (action === "add-document") addDocument();
  if (action === "remove-document") removeDocument(btn.dataset.id);
  renderReview();
};

const bindEvents = () => {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) handleAction(btn);
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.id === "reportType") toggleUpdateFields();
    if (t.id.startsWith("idType_")) togglePassportCountryField(t.id.split("_")[1]);
    if (t.id.startsWith("ownerIdType_")) toggleOwnerPassportCountryField(t.id.split("_")[1]);
    if (t.dataset.typeToggle === "participant") {
      const p = state.participants.find((x) => x.id === t.dataset.id);
      if (p) {
        p.type = t.value || "Individual";
        renderParticipants();
      }
    }
    if (t.dataset.typeToggle === "owner") {
      const account = state.accounts.find((a) => a.id === t.dataset.accountId);
      const owner = account?.owners.find((o) => o.id === t.dataset.id);
      if (owner) {
        owner.type = t.value || "Individual";
        renderAccounts();
      }
    }
    if (t.id.startsWith("docFile_")) {
      const file = t.files?.[0];
      const meta = byId(`docFileMeta_${t.id.split("_")[1]}`);
      if (file && meta) meta.innerHTML = `<span>[FILE]</span><span>${file.name}</span>`;
    }
    fieldLiveValidate(t);
    renderReview();
  });

  ["input", "blur"].forEach((evt) => document.addEventListener(evt, (e) => {
    const t = e.target;
    if (t.matches("input,select,textarea")) fieldLiveValidate(t);
  }, true));

  window.addEventListener("scroll", updateProgress);

  byId("saveDraftBtn").addEventListener("click", () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      showToast("Draft saved locally. Ready for API persistence integration.", "success");
    }, 700);
  });

  byId("resetBtn").addEventListener("click", () => {
    openModal({
      title: "Confirm Reset",
      message: "All entries in the report will be cleared. Continue?",
      onConfirm: () => {
        byId("strForm").reset();
        clearValidation();
        state.transactions = [];
        state.participants = [];
        state.accounts = [];
        state.documents = [];
        addTransaction();
        addParticipant();
        addParticipant();
        addAccount();
        addOwner(state.accounts[0].id);
        addDocument();
        toggleUpdateFields();
        renderReview();
        setValidationSummary([]);
        showToast("Form reset completed.", "success");
      },
      confirmText: "Reset"
    });
  });

  byId("strForm").addEventListener("submit", (e) => {
    e.preventDefault();
    setValidationSummary([]);
    const valid = validateStatic() && validateDynamic();
    if (!valid) {
      scrollFirstError();
      const count = document.querySelectorAll(".input-invalid").length;
      setValidationSummary([`${count} validation issue(s) detected.`, "Please review highlighted fields and submit again."]);
      showToast("Submission blocked by validation errors.", "error");
      return;
    }

    openModal({
      title: "Confirm Submission",
      message: "Submit this STR to the compliance system?",
      confirmText: "Submit",
      onConfirm: () => {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          openModal({
            title: "Submission Successful",
            message: "STR has passed frontend checks and is ready for Spring Boot API submission.",
            onConfirm: () => showToast("Report submitted successfully.", "success"),
            confirmText: "Close",
            isSuccess: true
          });
        }, 900);
      }
    });
  });
};

const init = () => {
  mountStatic();
  addTransaction();
  addParticipant();
  addParticipant();
  addAccount();
  addOwner(state.accounts[0].id);
  addDocument();
  bindEvents();
  toggleUpdateFields();
  renderReview();
  updateProgress();
};

init();







