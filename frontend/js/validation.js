import { AFGHAN_PROVINCES, CURRENCIES, MAX, PATTERNS } from "./constants.js";

const today = () => new Date().toISOString().split("T")[0];
const isFutureDate = (value) => value && value > today();
const setError = (el, msg) => {
  if (!el) return false;
  const error = document.getElementById(`${el.id}Error`);
  el.classList.toggle("input-invalid", !!msg);
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  if (error) error.textContent = msg || "";
  return !msg;
};

export const validators = {
  required: (el, label = "This field") => (el.value.trim() ? "" : `${label} is required.`),
  alphaNum: (el, label = "Field") => (PATTERNS.alphanumeric.test(el.value.trim()) ? "" : `${label} must be alphanumeric.`),
  reportIdentifier: (el) => {
    const value = el.value.trim();
    if (!value) return "Report Identifier is required.";
    return /^[A-Za-z0-9]{15}$/.test(value) ? "" : "Please enter a 15-character alphanumeric Report Identifier.";
  },
  amount: (el) => {
    const v = el.value.trim();
    if (!v) return "Transaction Amount is required.";
    if (!PATTERNS.amount.test(v)) return "Amount must be numeric and up to 2 decimals.";
    if (Number(v) <= 0) return "Amount must be a positive value.";
    return "";
  },
  dateRequired: (el, label = "Date") => {
    if (!el.value) return `${label} is required.`;
    if (isFutureDate(el.value)) return `${label} cannot be in the future.`;
    return "";
  },
  name: (el, label = "Name") => {
    const v = el.value.trim();
    if (!v) return `${label} is required.`;
    return PATTERNS.name.test(v) ? "" : `${label} has invalid characters.`;
  },
  phoneOptional: (el, label = "Phone") => {
    const v = el.value.trim();
    if (!v) return "";
    return PATTERNS.phone.test(v) ? "" : `${label} format is invalid.`;
  },
  phoneRequired: (el, label = "Phone") => {
    const v = el.value.trim();
    if (!v) return `${label} is required.`;
    return PATTERNS.phone.test(v) ? "" : `${label} format is invalid.`;
  },
  tin: (el) => (PATTERNS.tin.test(el.value.trim()) ? "" : "TIN must be alphanumeric."),
  account: (el) => (PATTERNS.accountNumber.test(el.value.trim()) ? "" : "Account number format is invalid."),
  maxLen: (el, max, label = "Field") => (el.value.trim().length <= max ? "" : `${label} cannot exceed ${max} chars.`),
  currency: (el) => (CURRENCIES.includes(el.value.trim()) ? "" : "Select a valid currency."),
  province: (el) => (AFGHAN_PROVINCES.includes(el.value.trim()) ? "" : "Select a valid province."),
  suspicionDescription: (el) => {
    const v = el.value.trim();
    if (!v) return "Suspicion Description is required.";
    if (v.length < 30) return "Description must be at least 30 characters.";
    if (v.length > MAX.suspicionDescription) return "Description exceeds max length.";
    return "";
  },
  file: (el) => {
    const file = el.files && el.files[0];
    if (!file) return "File is required.";
    const okType = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!okType) return "Only PDF or DOCX files are allowed.";
    if (file.size > MAX.fileSizeBytes) return "File must be <= 10MB.";
    return "";
  }
};

export const applyValidation = (el, checks) => {
  const error = checks.map((fn) => fn()).find(Boolean) || "";
  return setError(el, error);
};

export const validateAll = (fields) => {
  let ok = true;
  fields.forEach(({ el, checks }) => {
    const valid = applyValidation(el, checks);
    if (!valid) ok = false;
  });
  return ok;
};

export const clearValidation = (root = document) => {
  root.querySelectorAll(".input-invalid").forEach((el) => el.classList.remove("input-invalid"));
  root.querySelectorAll(".error-msg").forEach((el) => { el.textContent = ""; });
};

export const scrollFirstError = () => {
  const first = document.querySelector(".input-invalid");
  if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
};
