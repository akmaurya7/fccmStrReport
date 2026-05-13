export const SECTION_TITLES = [
  "Reporting Entity",
  "Report Details",
  "Transactions",
  "Transaction Participants",
  "Transaction Accounts",
  "Suspicion Details",
  "Supporting Documents",
  "Review & Submit"
];

export const DROPDOWNS = {
  entityTypes: ["Bank", "Money Service Business", "Microfinance", "Government Entity", "Insurance", "Other"],
  reportTypes: ["New", "Update"],
  transactionStatus: ["Completed", "Denied", "Pending"],
  transactionTypes: [
    "CASH WITHDRAWAL", "CHECK WITHDRAWAL", "CASH DEPOSIT", "CHECK DEPOSIT", "LETTER TRANSFER",
    "INBOUND INTERNATIONAL TRANSFER", "OUTBOUND INTERNATIONAL TRANSFER", "INBOUND NATIONAL TRANSFER",
    "OUTBOUND NATIONAL TRANSFER", "LOAN REPAYMENT", "LOAN", "FOREIGN EXCHANGE"
  ],
  participantTypes: ["Individual", "Legal Entity", "Government/NGO"],
  participantRoles: ["PRINCIPLE", "PROXY", "BENEFICIARY"],
  idTypes: ["Tazkira", "Passport", "Valid Identifier"],
  countries: ["Afghanistan", "India", "Pakistan", "United Arab Emirates", "Saudi Arabia", "United Kingdom", "United States", "Canada", "Germany", "France", "Turkey", "China", "Japan", "Australia", "Singapore"],
  accountTypes: ["SAVINGS", "CURRENT", "LOAN", "FIXED DEPOSIT"],
  suspicionTypes: [
    "Terrorist Financing", "Money Laundering", "Corruption and Bribery", "Drug Trafficking", "Kidnapping",
    "Organized Crime", "Human Trafficking", "Arms Trafficking", "Fraud", "Tax Crimes", "Forgery", "Wire Fraud",
    "Asset Registration", "Piracy", "Smuggling", "Robbery"
  ],
  documentTypes: ["Contract", "Invoice", "Identity Evidence", "Audit Note", "Bank Statement", "Other"]
};

export const CURRENCIES = [
  "AFN", "USD", "EUR", "GBP", "JPY", "CNY", "INR", "PKR", "AED", "SAR", "CAD", "AUD", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "TRY", "QAR", "KWD", "BHD", "OMR", "RUB", "ZAR", "MYR", "THB", "IDR", "KRW", "NZD"
];

export const AFGHAN_PROVINCES = [
  "Badakhshan", "Badghis", "Baghlan", "Balkh", "Bamyan", "Daykundi", "Farah", "Faryab", "Ghazni", "Ghor", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar", "Kapisa", "Khost", "Kunar", "Kunduz", "Laghman", "Logar", "Nangarhar", "Nimroz", "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan", "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul"
];

export const PATTERNS = {
  alphanumeric: /^[a-zA-Z0-9\s\-_/]+$/,
  name: /^[a-zA-Z\s.'-]{2,}$/,
  tin: /^[a-zA-Z0-9\-]{3,30}$/,
  phone: /^\+?[0-9\-\s]{7,20}$/,
  amount: /^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?$/,
  accountNumber: /^[A-Za-z0-9\-]{6,34}$/
};

export const MAX = {
  entityId: 30,
  entityName: 120,
  suspicionDescription: 2000,
  fileSizeBytes: 10 * 1024 * 1024
};

