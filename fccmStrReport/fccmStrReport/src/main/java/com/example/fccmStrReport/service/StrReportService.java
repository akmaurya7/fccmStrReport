package com.example.fccmStrReport.service;

import com.example.fccmStrReport.dto.StrReportRequest;
import com.example.fccmStrReport.dto.StrReportResponse;
import com.example.fccmStrReport.dto.StrSubmitXmlRequest;
import com.example.fccmStrReport.entity.*;
import com.example.fccmStrReport.mapper.StrReportMapper;
import com.example.fccmStrReport.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
public class StrReportService {

    private final StrReportRepository reportRepository;
    private final StrReportingEntityRepository reportingEntityRepository;
    private final StrSuspicionCategoryRepository suspicionCategoryRepository;
    private final StrReportMapper reportMapper;
    private final StrTransactionRepository transactionRepository;
    private final StrCurrencyRepository currencyRepository;
    private final StrTransactionTypeRepository transactionTypeRepository;
    private final StrCountryRepository countryRepository;
    private final StrCustomerRepository customerRepository;
    private final StrPhoneTypeRepository phoneTypeRepository;
    private final StrCustomerPhoneRepository customerPhoneRepository;
    private final StrReportCustomerRepository reportCustomerRepository;
    private final StrAccountRepository accountRepository;
    private final StrAccountTypeRepository accountTypeRepository;
    private final StrAccountCustomerRepository accountCustomerRepository;
    private final StrSupportingDocumentRepository supportingDocumentRepository;

    public StrReportService(
            StrReportRepository reportRepository,
            StrReportingEntityRepository reportingEntityRepository,
            StrSuspicionCategoryRepository suspicionCategoryRepository,
            StrReportMapper reportMapper,
            StrTransactionRepository transactionRepository,
            StrCurrencyRepository currencyRepository,
            StrTransactionTypeRepository transactionTypeRepository,
            StrCountryRepository countryRepository,
            StrCustomerRepository customerRepository,
            StrPhoneTypeRepository phoneTypeRepository,
            StrCustomerPhoneRepository customerPhoneRepository,
            StrReportCustomerRepository reportCustomerRepository,
            StrAccountRepository accountRepository,
            StrAccountTypeRepository accountTypeRepository,
            StrAccountCustomerRepository accountCustomerRepository,
            StrSupportingDocumentRepository supportingDocumentRepository
    ) {
        this.reportRepository = reportRepository;
        this.reportingEntityRepository = reportingEntityRepository;
        this.suspicionCategoryRepository = suspicionCategoryRepository;
        this.reportMapper = reportMapper;
        this.transactionRepository = transactionRepository;
        this.currencyRepository = currencyRepository;
        this.transactionTypeRepository = transactionTypeRepository;
        this.countryRepository = countryRepository;
        this.customerRepository = customerRepository;
        this.phoneTypeRepository = phoneTypeRepository;
        this.customerPhoneRepository = customerPhoneRepository;
        this.reportCustomerRepository = reportCustomerRepository;
        this.accountRepository = accountRepository;
        this.accountTypeRepository = accountTypeRepository;
        this.accountCustomerRepository = accountCustomerRepository;
        this.supportingDocumentRepository = supportingDocumentRepository;
    }

    public List<StrReportResponse> getAllReports() {
        return reportRepository.findAll().stream().map(reportMapper::toResponse).toList();
    }

    public StrReportResponse getReportById(Long reportId) {
        StrReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));
        return reportMapper.toResponse(report);
    }

    public StrReportResponse createReport(StrReportRequest request) {
        StrReport report = new StrReport();
        applyRequest(report, request);
        StrReport saved = reportRepository.save(report);
        return reportMapper.toResponse(saved);
    }

    @Transactional
    public String createReportAndGenerateXml(StrSubmitXmlRequest request) {
        if (request == null || request.getReport() == null) {
            throw new IllegalArgumentException("Report payload is required.");
        }

        StrReport report = new StrReport();
        applyRequest(report, request.getReport());
        StrReport savedReport = reportRepository.save(report);

        saveTransactions(savedReport, request.getTransactions());
        saveParticipants(savedReport, request.getParticipants());
        saveAccounts(savedReport, request.getAccounts());
        saveDocuments(savedReport, request.getDocuments());

        return buildXml(reportMapper.toResponse(savedReport), request);
    }

    public StrReportResponse updateReport(Long reportId, StrReportRequest request) {
        StrReport existing = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));
        applyRequest(existing, request);
        StrReport saved = reportRepository.save(existing);
        return reportMapper.toResponse(saved);
    }

    private void applyRequest(StrReport target, StrReportRequest request) {
        StrReportingEntity reportingEntity = reportingEntityRepository.findById(request.getReportingEntityId())
                .orElseThrow(() -> new IllegalArgumentException("Reporting entity not found: " + request.getReportingEntityId()));
        StrSuspicionCategory suspicionCategory = suspicionCategoryRepository.findById(request.getSuspicionCategoryCode())
                .orElseThrow(() -> new IllegalArgumentException("Suspicion category not found: " + request.getSuspicionCategoryCode()));

        target.setReportingEntity(reportingEntity);
        target.setReportType(request.getReportType());
        target.setReportIdentifier(request.getReportIdentifier());
        target.setSubmitDate(request.getSubmitDate());
        target.setTransactionStatus(request.getTransactionStatus());
        target.setReportPreparationDate(request.getReportPreparationDate());
        target.setReportTransmissionDate(request.getReportTransmissionDate());
        target.setSuspicionCategory(suspicionCategory);
        target.setSuspicionDescription(request.getSuspicionDescription());
    }

    private void saveTransactions(StrReport report, List<StrSubmitXmlRequest.TransactionItem> items) {
        if (items == null) return;
        for (StrSubmitXmlRequest.TransactionItem i : items) {
            StrTransaction t = new StrTransaction();
            t.setReport(report);
            t.setTransactionDate(parseDate(i.getTransactionDate()));
            t.setTransactionAmount(parseAmount(i.getAmount()));
            t.setCurrency(currencyRepository.findById(nvl(i.getCurrencyCode()))
                    .orElseThrow(() -> new IllegalArgumentException("Invalid currency: " + i.getCurrencyCode())));
            t.setTransactionType(transactionTypeRepository.findByTransactionTypeName(nvl(i.getTransactionType()))
                    .orElseThrow(() -> new IllegalArgumentException("Invalid transaction type: " + i.getTransactionType())));
            String countryCode = toCountryCode(i.getCountry());
            t.setCountry(countryRepository.findById(countryCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid country: " + i.getCountry())));
            t.setBranch(nvl(i.getBranch()));
            transactionRepository.save(t);
        }
    }

    private void saveParticipants(StrReport report, List<StrSubmitXmlRequest.ParticipantItem> items) {
        if (items == null) return;
        for (StrSubmitXmlRequest.ParticipantItem i : items) {
            StrCustomer c = new StrCustomer();
            c.setCustomerType(nvl(i.getParticipantType()));
            c.setIdType(emptyToNull(i.getIdType()));
            c.setPassportCountry(resolveCountry(i.getPassportCountry()));
            c.setIdNumber(emptyToNull(i.getIdNumber()));
            c.setFirstName(emptyToNull(i.getFirstName()));
            c.setMiddleName(emptyToNull(i.getMiddleName()));
            c.setLastName(emptyToNull(i.getLastName()));
            c.setDob(parseNullableDate(i.getDob()));
            c.setFatherFirstName(emptyToNull(i.getFatherFirstName()));
            c.setFatherLastName(emptyToNull(i.getFatherLastName()));
            c.setTin(emptyToNull(i.getTin()));
            c.setLegalEntityFullName(emptyToNull(i.getLegalName()));
            c.setHouseNumber(nvl(i.getHouseNumber()));
            c.setStreetName(nvl(i.getStreetName()));
            c.setDistrictName(nvl(i.getDistrictName()));
            c.setLocationName(nvl(i.getLocationName()));
            c.setCityName(nvl(i.getCityName()));
            StrCustomer savedCustomer = customerRepository.save(c);

            savePhone(savedCustomer, "HOME", i.getHomePhone());
            savePhone(savedCustomer, "BUSINESS", i.getBusinessPhone());
            savePhone(savedCustomer, "MOBILE", i.getMobilePhone());

            StrReportCustomer rc = new StrReportCustomer();
            rc.setReport(report);
            rc.setCustomer(savedCustomer);
            rc.setParticipantRole(nvl(i.getParticipantRole()));
            reportCustomerRepository.save(rc);
        }
    }

    private void saveAccounts(StrReport report, List<StrSubmitXmlRequest.AccountItem> items) {
        if (items == null) return;
        for (StrSubmitXmlRequest.AccountItem i : items) {
            StrAccount a = new StrAccount();
            a.setReport(report);
            a.setAccountNumber(nvl(i.getAccountNumber()));
            String acctCode = toAccountTypeCode(i.getAccountType());
            a.setAccountType(accountTypeRepository.findById(acctCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid account type: " + i.getAccountType())));
            a.setBankName(nvl(i.getBankName()));
            a.setBankAddress(nvl(i.getBankAddress()));
            StrAccount saved = accountRepository.save(a);

            if (i.getOwners() == null) continue;
            for (StrSubmitXmlRequest.OwnerItem o : i.getOwners()) {
                StrCustomer owner = new StrCustomer();
                owner.setCustomerType(nvl(o.getOwnerType()));
                owner.setIdType(emptyToNull(o.getIdType()));
                owner.setPassportCountry(resolveCountry(o.getPassportCountry()));
                owner.setIdNumber(emptyToNull(o.getIdNumber()));
                owner.setFirstName(emptyToNull(o.getFirstName()));
                owner.setMiddleName(emptyToNull(o.getMiddleName()));
                owner.setLastName(emptyToNull(o.getLastName()));
                owner.setDob(parseNullableDate(o.getDob()));
                owner.setFatherFirstName(emptyToNull(o.getFatherFirstName()));
                owner.setFatherLastName(emptyToNull(o.getFatherLastName()));
                owner.setTin(emptyToNull(o.getTin()));
                owner.setLegalEntityFullName(emptyToNull(o.getLegalName()));
                owner.setHouseNumber(nvl(o.getHouseNumber()));
                owner.setStreetName(nvl(o.getStreetName()));
                owner.setDistrictName(nvl(o.getDistrictName()));
                owner.setLocationName(nvl(o.getLocationName()));
                owner.setCityName(nvl(o.getCityName()));
                StrCustomer savedOwner = customerRepository.save(owner);

                savePhone(savedOwner, "HOME", o.getHomePhone());
                savePhone(savedOwner, "BUSINESS", o.getBusinessPhone());
                savePhone(savedOwner, "MOBILE", o.getMobilePhone());

                StrAccountCustomer ac = new StrAccountCustomer();
                ac.setAccount(saved);
                ac.setCustomer(savedOwner);
                ac.setOwnerRole("OWNER");
                accountCustomerRepository.save(ac);
            }
        }
    }

    private void saveDocuments(StrReport report, List<StrSubmitXmlRequest.DocumentItem> items) {
        if (items == null) return;
        for (StrSubmitXmlRequest.DocumentItem i : items) {
            StrSupportingDocument d = new StrSupportingDocument();
            d.setReport(report);
            d.setFileName(nvl(i.getFileName(), "document.pdf"));
            d.setFileContent(decodeBase64(i.getFileContentBase64()));
            d.setDocumentName(nvl(i.getName()));
            d.setDocumentType(nvl(i.getType()));
            d.setDocumentIdentifier(nvl(i.getIdentifier()));
            d.setDocumentDate(parseDate(i.getDate()));
            d.setDocumentPreparer(nvl(i.getPreparer()));
            supportingDocumentRepository.save(d);
        }
    }

    private void savePhone(StrCustomer c, String code, String number) {
        if (number == null || number.isBlank()) return;
        StrCustomerPhone p = new StrCustomerPhone();
        p.setCustomer(c);
        p.setPhoneType(phoneTypeRepository.findById(code).orElseThrow());
        p.setPhoneNumber(number.trim());
        customerPhoneRepository.save(p);
    }

    public void deleteReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }

    private String buildXml(StrReportResponse r, StrSubmitXmlRequest full) {
        String transactions = full.getTransactions() == null ? "" : full.getTransactions().stream()
                .map(t -> "<transaction><transactionDate>%s</transactionDate><amount>%s</amount><currencyCode>%s</currencyCode><transactionType>%s</transactionType><country>%s</country><branch>%s</branch></transaction>"
                        .formatted(xml(t.getTransactionDate()), xml(t.getAmount()), xml(t.getCurrencyCode()), xml(t.getTransactionType()), xml(t.getCountry()), xml(t.getBranch())))
                .reduce("", String::concat);
        String participants = full.getParticipants() == null ? "" : full.getParticipants().stream()
                .map(p -> "<participant><participantType>%s</participantType><participantRole>%s</participantRole><idType>%s</idType><passportCountry>%s</passportCountry><idNumber>%s</idNumber><firstName>%s</firstName><middleName>%s</middleName><lastName>%s</lastName><dob>%s</dob><fatherFirstName>%s</fatherFirstName><fatherLastName>%s</fatherLastName><tin>%s</tin><legalName>%s</legalName><houseNumber>%s</houseNumber><streetName>%s</streetName><districtName>%s</districtName><locationName>%s</locationName><cityName>%s</cityName><homePhone>%s</homePhone><businessPhone>%s</businessPhone><mobilePhone>%s</mobilePhone></participant>"
                        .formatted(xml(p.getParticipantType()), xml(p.getParticipantRole()), xml(p.getIdType()), xml(p.getPassportCountry()), xml(p.getIdNumber()), xml(p.getFirstName()), xml(p.getMiddleName()), xml(p.getLastName()), xml(p.getDob()), xml(p.getFatherFirstName()), xml(p.getFatherLastName()), xml(p.getTin()), xml(p.getLegalName()), xml(p.getHouseNumber()), xml(p.getStreetName()), xml(p.getDistrictName()), xml(p.getLocationName()), xml(p.getCityName()), xml(p.getHomePhone()), xml(p.getBusinessPhone()), xml(p.getMobilePhone())))
                .reduce("", String::concat);
        String accounts = full.getAccounts() == null ? "" : full.getAccounts().stream().map(a -> {
            String owners = a.getOwners() == null ? "" : a.getOwners().stream()
                    .map(o -> "<owner><ownerType>%s</ownerType><idType>%s</idType><passportCountry>%s</passportCountry><idNumber>%s</idNumber><firstName>%s</firstName><middleName>%s</middleName><lastName>%s</lastName><dob>%s</dob><fatherFirstName>%s</fatherFirstName><fatherLastName>%s</fatherLastName><tin>%s</tin><legalName>%s</legalName><houseNumber>%s</houseNumber><streetName>%s</streetName><districtName>%s</districtName><locationName>%s</locationName><cityName>%s</cityName><homePhone>%s</homePhone><businessPhone>%s</businessPhone><mobilePhone>%s</mobilePhone></owner>"
                            .formatted(xml(o.getOwnerType()), xml(o.getIdType()), xml(o.getPassportCountry()), xml(o.getIdNumber()), xml(o.getFirstName()), xml(o.getMiddleName()), xml(o.getLastName()), xml(o.getDob()), xml(o.getFatherFirstName()), xml(o.getFatherLastName()), xml(o.getTin()), xml(o.getLegalName()), xml(o.getHouseNumber()), xml(o.getStreetName()), xml(o.getDistrictName()), xml(o.getLocationName()), xml(o.getCityName()), xml(o.getHomePhone()), xml(o.getBusinessPhone()), xml(o.getMobilePhone())))
                    .reduce("", String::concat);
            return "<account><accountNumber>%s</accountNumber><accountType>%s</accountType><bankName>%s</bankName><bankAddress>%s</bankAddress><owners>%s</owners></account>"
                    .formatted(xml(a.getAccountNumber()), xml(a.getAccountType()), xml(a.getBankName()), xml(a.getBankAddress()), owners);
        }).reduce("", String::concat);
        String documents = full.getDocuments() == null ? "" : full.getDocuments().stream()
                .map(d -> "<document><name>%s</name><type>%s</type><identifier>%s</identifier><date>%s</date><preparer>%s</preparer><fileName>%s</fileName></document>"
                        .formatted(xml(d.getName()), xml(d.getType()), xml(d.getIdentifier()), xml(d.getDate()), xml(d.getPreparer()), xml(d.getFileName())))
                .reduce("", String::concat);

        return ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<strReport>"
                + "<reportId>" + safe(r.getReportId()) + "</reportId>"
                + "<reportingEntityId>" + xml(r.getReportingEntityId()) + "</reportingEntityId>"
                + "<reportType>" + xml(r.getReportType()) + "</reportType>"
                + "<reportIdentifier>" + xml(r.getReportIdentifier()) + "</reportIdentifier>"
                + "<submitDate>" + safe(r.getSubmitDate()) + "</submitDate>"
                + "<transactionStatus>" + xml(r.getTransactionStatus()) + "</transactionStatus>"
                + "<reportPreparationDate>" + safe(r.getReportPreparationDate()) + "</reportPreparationDate>"
                + "<reportTransmissionDate>" + safe(r.getReportTransmissionDate()) + "</reportTransmissionDate>"
                + "<suspicionCategoryCode>" + xml(r.getSuspicionCategoryCode()) + "</suspicionCategoryCode>"
                + "<suspicionCategoryName>" + xml(r.getSuspicionCategoryName()) + "</suspicionCategoryName>"
                + "<suspicionDescription>" + xml(r.getSuspicionDescription()) + "</suspicionDescription>"
                + "<createdAt>" + safe(r.getCreatedAt()) + "</createdAt>"
                + "<transactions>" + transactions + "</transactions>"
                + "<participants>" + participants + "</participants>"
                + "<accounts>" + accounts + "</accounts>"
                + "<supportingDocuments>" + documents + "</supportingDocuments>"
                + "</strReport>");
    }

    private byte[] decodeBase64(String b64) {
        if (b64 == null || b64.isBlank()) return "EMPTY".getBytes(StandardCharsets.UTF_8);
        return Base64.getDecoder().decode(b64);
    }

    private String toCountryCode(String value) {
        if (value == null || value.isBlank()) return "AFG";
        String v = value.trim();
        if (v.length() == 3) return v.toUpperCase();
        return countryRepository.findByCountryName(v).map(StrCountry::getCountryCode).orElse("AFG");
    }

    private StrCountry resolveCountry(String country) {
        if (country == null || country.isBlank()) return null;
        String code = toCountryCode(country);
        return countryRepository.findById(code).orElse(null);
    }

    private String toAccountTypeCode(String value) {
        if (value == null || value.isBlank()) return "SAVINGS";
        String v = value.trim();
        return accountTypeRepository.findById(v).map(StrAccountType::getAccountTypeCode)
                .or(() -> accountTypeRepository.findByAccountTypeName(v).map(StrAccountType::getAccountTypeCode))
                .orElse(v);
    }

    private LocalDate parseDate(String value) {
        return LocalDate.parse(value);
    }

    private LocalDate parseNullableDate(String value) {
        return (value == null || value.isBlank()) ? null : LocalDate.parse(value);
    }

    private BigDecimal parseAmount(String value) {
        return new BigDecimal(value);
    }

    private String xml(String v) {
        if (v == null) return "";
        return v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&apos;");
    }

    private String safe(Object v) {
        return v == null ? "" : v.toString();
    }

    private String nvl(String v) {
        return v == null ? "" : v.trim();
    }

    private String nvl(String v, String def) {
        return (v == null || v.isBlank()) ? def : v.trim();
    }

    private String emptyToNull(String v) {
        return (v == null || v.isBlank()) ? null : v.trim();
    }
}

