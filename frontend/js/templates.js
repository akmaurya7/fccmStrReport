import { DROPDOWNS } from "./constants.js";

const options = (list) => ['<option value="">Select</option>', ...list.map((x) => `<option value="${x}">${x}</option>`)].join("");

const searchInput = (id, label, listName, required = true) => `
<div class="field search-wrap">
  <label for="${id}">${label}${required ? " *" : ""}</label>
  <input id="${id}" name="${id}" list="${listName}" ${required ? "required" : ""} />
  <span class="search-icon" aria-hidden="true">&#8981;</span>
  <span class="error-msg" id="${id}Error"></span>
</div>`;

export const transactionCard = (id, idx) => `
<article class="dynamic-card" data-transaction-id="${id}">
  <div class="card-head"><h3>Transaction #${idx + 1}</h3><button type="button" class="btn btn-danger" data-action="remove-transaction" data-id="${id}">Remove</button></div>
  <div class="card-body grid">
    <div class="field"><label for="txDate_${id}">Transaction Date *</label><input type="date" id="txDate_${id}" data-validate="date-required" required /><span class="error-msg" id="txDate_${id}Error"></span></div>
    <div class="field"><label for="txAmount_${id}">Transaction Amount *</label><input id="txAmount_${id}" data-validate="amount" required /><span class="error-msg" id="txAmount_${id}Error"></span></div>
    ${searchInput(`txCurrency_${id}`, "Currency Code", "currencyList")}
    <div class="field"><label for="txType_${id}">Transaction Type *</label><select id="txType_${id}" required>${options(DROPDOWNS.transactionTypes)}</select><span class="error-msg" id="txType_${id}Error"></span></div>
    ${searchInput(`txProvince_${id}`, "Province", "provinceList")}
    <div class="field"><label for="txBranch_${id}">Branch *</label><input id="txBranch_${id}" required maxlength="80" /><span class="error-msg" id="txBranch_${id}Error"></span></div>
  </div>
</article>`;

export const participantCard = (id, idx) => `
<article class="dynamic-card" data-participant-id="${id}">
  <div class="card-head"><h3>Participant #${idx + 1}</h3><button type="button" class="btn btn-danger" data-action="remove-participant" data-id="${id}">Remove</button></div>
  <div class="card-body">
    <div class="grid">
      <div class="field"><label for="participantType_${id}">Participant Type *</label><select id="participantType_${id}" data-type-toggle="participant" data-id="${id}" required>${options(DROPDOWNS.participantTypes)}</select><span class="error-msg" id="participantType_${id}Error"></span></div>
      <div class="field"><label for="participantRole_${id}">Participant Role *</label><select id="participantRole_${id}" required>${options(DROPDOWNS.participantRoles)}</select><span class="error-msg" id="participantRole_${id}Error"></span></div>
    </div>
    <div id="participantBody_${id}" class="grid"></div>
  </div>
</article>`;

export const individualParticipantBody = (id) => `
<div class="field"><label for="idType_${id}">ID Type *</label><select id="idType_${id}" required>${options(DROPDOWNS.idTypes)}</select><span class="error-msg" id="idType_${id}Error"></span></div>
<div class="field" id="passportCountryWrap_${id}" hidden><label for="passportCountry_${id}">Country *</label><select id="passportCountry_${id}">${options(DROPDOWNS.countries)}</select><span class="error-msg" id="passportCountry_${id}Error"></span></div>
<div class="field"><label for="idNumber_${id}">ID Number *</label><input id="idNumber_${id}" required maxlength="40" /><span class="error-msg" id="idNumber_${id}Error"></span></div>
<div class="field"><label for="firstName_${id}">First Name *</label><input id="firstName_${id}" required /><span class="error-msg" id="firstName_${id}Error"></span></div>
<div class="field"><label for="middleName_${id}">Middle Name</label><input id="middleName_${id}" /><span class="error-msg" id="middleName_${id}Error"></span></div>
<div class="field"><label for="lastName_${id}">Last Name *</label><input id="lastName_${id}" required /><span class="error-msg" id="lastName_${id}Error"></span></div>
<div class="field"><label for="dob_${id}">DOB *</label><input type="date" id="dob_${id}" required /><span class="error-msg" id="dob_${id}Error"></span></div>
<div class="field"><label for="fatherFirst_${id}">Father First Name *</label><input id="fatherFirst_${id}" required /><span class="error-msg" id="fatherFirst_${id}Error"></span></div>
<div class="field"><label for="fatherLast_${id}">Father Last Name *</label><input id="fatherLast_${id}" required /><span class="error-msg" id="fatherLast_${id}Error"></span></div>
<div class="field"><label for="house_${id}">House Number *</label><input id="house_${id}" required /><span class="error-msg" id="house_${id}Error"></span></div>
<div class="field"><label for="street_${id}">Street Name *</label><input id="street_${id}" required /><span class="error-msg" id="street_${id}Error"></span></div>
<div class="field"><label for="district_${id}">District Name *</label><input id="district_${id}" required /><span class="error-msg" id="district_${id}Error"></span></div>
<div class="field"><label for="location_${id}">Location Name *</label><input id="location_${id}" required /><span class="error-msg" id="location_${id}Error"></span></div>
<div class="field"><label for="city_${id}">City Name *</label><input id="city_${id}" required /><span class="error-msg" id="city_${id}Error"></span></div>
<div class="field"><label for="homePhone_${id}">Home Phone</label><input id="homePhone_${id}" /><span class="error-msg" id="homePhone_${id}Error"></span></div>
<div class="field"><label for="businessPhone_${id}">Business Phone</label><input id="businessPhone_${id}" /><span class="error-msg" id="businessPhone_${id}Error"></span></div>
<div class="field"><label for="mobilePhone_${id}">Mobile Phone *</label><input id="mobilePhone_${id}" required /><span class="error-msg" id="mobilePhone_${id}Error"></span></div>
`;

export const legalParticipantBody = (id) => `
<div class="field"><label for="tin_${id}">TIN *</label><input id="tin_${id}" required /><span class="error-msg" id="tin_${id}Error"></span></div>
<div class="field"><label for="legalName_${id}">Legal Entity Full Name *</label><input id="legalName_${id}" required /><span class="error-msg" id="legalName_${id}Error"></span></div>
<div class="field"><label for="legalHouse_${id}">House Number *</label><input id="legalHouse_${id}" required /><span class="error-msg" id="legalHouse_${id}Error"></span></div>
<div class="field"><label for="legalStreet_${id}">Street Name *</label><input id="legalStreet_${id}" required /><span class="error-msg" id="legalStreet_${id}Error"></span></div>
<div class="field"><label for="legalDistrict_${id}">District Name *</label><input id="legalDistrict_${id}" required /><span class="error-msg" id="legalDistrict_${id}Error"></span></div>
<div class="field"><label for="legalLocation_${id}">Location Name *</label><input id="legalLocation_${id}" required /><span class="error-msg" id="legalLocation_${id}Error"></span></div>
<div class="field"><label for="legalCity_${id}">City Name *</label><input id="legalCity_${id}" required /><span class="error-msg" id="legalCity_${id}Error"></span></div>
<div class="field"><label for="legalHomePhone_${id}">Home Phone</label><input id="legalHomePhone_${id}" /><span class="error-msg" id="legalHomePhone_${id}Error"></span></div>
<div class="field"><label for="legalBusinessPhone_${id}">Business Phone</label><input id="legalBusinessPhone_${id}" /><span class="error-msg" id="legalBusinessPhone_${id}Error"></span></div>
<div class="field"><label for="legalMobilePhone_${id}">Mobile Phone *</label><input id="legalMobilePhone_${id}" required /><span class="error-msg" id="legalMobilePhone_${id}Error"></span></div>
`;

export const accountCard = (id, idx) => `
<article class="dynamic-card" data-account-id="${id}">
  <div class="card-head"><h3>Account #${idx + 1}</h3><button type="button" class="btn btn-danger" data-action="remove-account" data-id="${id}">Remove</button></div>
  <div class="card-body">
    <div class="grid">
      <div class="field"><label for="acctNo_${id}">Transaction Account Number *</label><input id="acctNo_${id}" required /><span class="error-msg" id="acctNo_${id}Error"></span></div>
      <div class="field"><label for="acctType_${id}">Account Type *</label><select id="acctType_${id}" required>${options(DROPDOWNS.accountTypes)}</select><span class="error-msg" id="acctType_${id}Error"></span></div>
      <div class="field"><label for="bankName_${id}">Bank Name *</label><input id="bankName_${id}" required /><span class="error-msg" id="bankName_${id}Error"></span></div>
      <div class="field"><label for="bankAddress_${id}">Bank Address *</label><input id="bankAddress_${id}" required /><span class="error-msg" id="bankAddress_${id}Error"></span></div>
    </div>
    <h4>Account Owners</h4>
    <div id="owners_${id}" class="card-list"></div>
    <div class="button-row"><button type="button" class="btn btn-secondary" data-action="add-owner" data-id="${id}">Add Owner</button></div>
  </div>
</article>`;

export const ownerCard = (accountId, ownerId, idx) => `
<article class="dynamic-card" data-owner-id="${ownerId}">
  <div class="card-head"><h3>Owner #${idx + 1}</h3><button type="button" class="btn btn-danger" data-action="remove-owner" data-account-id="${accountId}" data-id="${ownerId}">Remove</button></div>
  <div class="card-body">
    <div class="grid">
      <div class="field"><label for="ownerType_${ownerId}">Owner Type *</label><select id="ownerType_${ownerId}" data-type-toggle="owner" data-account-id="${accountId}" data-id="${ownerId}" required>${options(DROPDOWNS.participantTypes)}</select><span class="error-msg" id="ownerType_${ownerId}Error"></span></div>
    </div>
    <div id="ownerBody_${ownerId}" class="grid"></div>
  </div>
</article>`;

export const individualOwnerBody = (id) => `
<div class="field"><label for="ownerIdType_${id}">ID Type *</label><select id="ownerIdType_${id}" required>${options(DROPDOWNS.idTypes)}</select><span class="error-msg" id="ownerIdType_${id}Error"></span></div>
<div class="field" id="ownerPassportCountryWrap_${id}" hidden><label for="ownerPassportCountry_${id}">Country *</label><select id="ownerPassportCountry_${id}">${options(DROPDOWNS.countries)}</select><span class="error-msg" id="ownerPassportCountry_${id}Error"></span></div>
<div class="field"><label for="ownerIdNumber_${id}">ID Number *</label><input id="ownerIdNumber_${id}" required maxlength="40" /><span class="error-msg" id="ownerIdNumber_${id}Error"></span></div>
<div class="field"><label for="ownerFirstName_${id}">First Name *</label><input id="ownerFirstName_${id}" required /><span class="error-msg" id="ownerFirstName_${id}Error"></span></div>
<div class="field"><label for="ownerMiddleName_${id}">Middle Name</label><input id="ownerMiddleName_${id}" /><span class="error-msg" id="ownerMiddleName_${id}Error"></span></div>
<div class="field"><label for="ownerLastName_${id}">Last Name *</label><input id="ownerLastName_${id}" required /><span class="error-msg" id="ownerLastName_${id}Error"></span></div>
<div class="field"><label for="ownerDob_${id}">DOB *</label><input type="date" id="ownerDob_${id}" required /><span class="error-msg" id="ownerDob_${id}Error"></span></div>
<div class="field"><label for="ownerFatherFirst_${id}">Father First Name *</label><input id="ownerFatherFirst_${id}" required /><span class="error-msg" id="ownerFatherFirst_${id}Error"></span></div>
<div class="field"><label for="ownerFatherLast_${id}">Father Last Name *</label><input id="ownerFatherLast_${id}" required /><span class="error-msg" id="ownerFatherLast_${id}Error"></span></div>
<div class="field"><label for="ownerHouse_${id}">House Number *</label><input id="ownerHouse_${id}" required /><span class="error-msg" id="ownerHouse_${id}Error"></span></div>
<div class="field"><label for="ownerStreet_${id}">Street Name *</label><input id="ownerStreet_${id}" required /><span class="error-msg" id="ownerStreet_${id}Error"></span></div>
<div class="field"><label for="ownerDistrict_${id}">District Name *</label><input id="ownerDistrict_${id}" required /><span class="error-msg" id="ownerDistrict_${id}Error"></span></div>
<div class="field"><label for="ownerLocation_${id}">Location Name *</label><input id="ownerLocation_${id}" required /><span class="error-msg" id="ownerLocation_${id}Error"></span></div>
<div class="field"><label for="ownerCity_${id}">City Name *</label><input id="ownerCity_${id}" required /><span class="error-msg" id="ownerCity_${id}Error"></span></div>
<div class="field"><label for="ownerHomePhone_${id}">Home Phone</label><input id="ownerHomePhone_${id}" /><span class="error-msg" id="ownerHomePhone_${id}Error"></span></div>
<div class="field"><label for="ownerBusinessPhone_${id}">Business Phone</label><input id="ownerBusinessPhone_${id}" /><span class="error-msg" id="ownerBusinessPhone_${id}Error"></span></div>
<div class="field"><label for="ownerMobilePhone_${id}">Mobile Phone *</label><input id="ownerMobilePhone_${id}" required /><span class="error-msg" id="ownerMobilePhone_${id}Error"></span></div>
`;

export const legalOwnerBody = (id) => `
<div class="field"><label for="ownerTin_${id}">TIN *</label><input id="ownerTin_${id}" required /><span class="error-msg" id="ownerTin_${id}Error"></span></div>
<div class="field"><label for="ownerLegalName_${id}">Legal Entity Full Name *</label><input id="ownerLegalName_${id}" required /><span class="error-msg" id="ownerLegalName_${id}Error"></span></div>
<div class="field"><label for="ownerLegalHouse_${id}">House Number *</label><input id="ownerLegalHouse_${id}" required /><span class="error-msg" id="ownerLegalHouse_${id}Error"></span></div>
<div class="field"><label for="ownerLegalStreet_${id}">Street Name *</label><input id="ownerLegalStreet_${id}" required /><span class="error-msg" id="ownerLegalStreet_${id}Error"></span></div>
<div class="field"><label for="ownerLegalDistrict_${id}">District Name *</label><input id="ownerLegalDistrict_${id}" required /><span class="error-msg" id="ownerLegalDistrict_${id}Error"></span></div>
<div class="field"><label for="ownerLegalLocation_${id}">Location Name *</label><input id="ownerLegalLocation_${id}" required /><span class="error-msg" id="ownerLegalLocation_${id}Error"></span></div>
<div class="field"><label for="ownerLegalCity_${id}">City Name *</label><input id="ownerLegalCity_${id}" required /><span class="error-msg" id="ownerLegalCity_${id}Error"></span></div>
<div class="field"><label for="ownerLegalHomePhone_${id}">Home Phone</label><input id="ownerLegalHomePhone_${id}" /><span class="error-msg" id="ownerLegalHomePhone_${id}Error"></span></div>
<div class="field"><label for="ownerLegalBusinessPhone_${id}">Business Phone</label><input id="ownerLegalBusinessPhone_${id}" /><span class="error-msg" id="ownerLegalBusinessPhone_${id}Error"></span></div>
<div class="field"><label for="ownerLegalMobilePhone_${id}">Mobile Phone *</label><input id="ownerLegalMobilePhone_${id}" required /><span class="error-msg" id="ownerLegalMobilePhone_${id}Error"></span></div>
`;

export const documentCard = (id, idx) => `
<article class="dynamic-card" data-document-id="${id}">
  <div class="card-head"><h3>Document #${idx + 1}</h3><button type="button" class="btn btn-danger" data-action="remove-document" data-id="${id}">Remove</button></div>
  <div class="card-body grid">
    <div class="field"><label for="docFile_${id}">Upload File *</label><input type="file" id="docFile_${id}" accept=".pdf,.doc,.docx" required /><span class="error-msg" id="docFile_${id}Error"></span><div class="file-meta" id="docFileMeta_${id}"></div></div>
    <div class="field"><label for="docName_${id}">Document Name *</label><input id="docName_${id}" required /><span class="error-msg" id="docName_${id}Error"></span></div>
    <div class="field"><label for="docType_${id}">Document Type *</label><select id="docType_${id}" required>${options(DROPDOWNS.documentTypes)}</select><span class="error-msg" id="docType_${id}Error"></span></div>
    <div class="field"><label for="docIdentifier_${id}">Document Identifier *</label><input id="docIdentifier_${id}" required /><span class="error-msg" id="docIdentifier_${id}Error"></span></div>
    <div class="field"><label for="docDate_${id}">Document Date *</label><input id="docDate_${id}" type="date" required /><span class="error-msg" id="docDate_${id}Error"></span></div>
    <div class="field"><label for="docPreparer_${id}">Document Preparer *</label><input id="docPreparer_${id}" required /><span class="error-msg" id="docPreparer_${id}Error"></span></div>
  </div>
</article>`;


