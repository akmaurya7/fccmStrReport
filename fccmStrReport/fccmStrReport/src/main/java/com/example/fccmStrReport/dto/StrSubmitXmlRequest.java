package com.example.fccmStrReport.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StrSubmitXmlRequest {
    private StrReportRequest report;
    private List<TransactionItem> transactions;
    private List<ParticipantItem> participants;
    private List<AccountItem> accounts;
    private List<DocumentItem> documents;

    @Getter
    @Setter
    public static class TransactionItem {
        private String transactionDate;
        private String amount;
        private String currencyCode;
        private String transactionType;
        private String country;
        private String branch;
    }

    @Getter
    @Setter
    public static class ParticipantItem {
        private String participantType;
        private String participantRole;
        private String idType;
        private String passportCountry;
        private String idNumber;
        private String firstName;
        private String middleName;
        private String lastName;
        private String dob;
        private String fatherFirstName;
        private String fatherLastName;
        private String tin;
        private String legalName;
        private String houseNumber;
        private String streetName;
        private String districtName;
        private String locationName;
        private String cityName;
        private String homePhone;
        private String businessPhone;
        private String mobilePhone;
    }

    @Getter
    @Setter
    public static class AccountItem {
        private String accountNumber;
        private String accountType;
        private String bankName;
        private String bankAddress;
        private List<OwnerItem> owners;
    }

    @Getter
    @Setter
    public static class OwnerItem {
        private String ownerType;
        private String idType;
        private String passportCountry;
        private String idNumber;
        private String firstName;
        private String middleName;
        private String lastName;
        private String dob;
        private String fatherFirstName;
        private String fatherLastName;
        private String tin;
        private String legalName;
        private String houseNumber;
        private String streetName;
        private String districtName;
        private String locationName;
        private String cityName;
        private String homePhone;
        private String businessPhone;
        private String mobilePhone;
    }

    @Getter
    @Setter
    public static class DocumentItem {
        private String name;
        private String type;
        private String identifier;
        private String date;
        private String preparer;
        private String fileName;
        private String fileContentBase64;
    }
}
