package com.example.fccmStrReport.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StrReportRequest {
    private String reportingEntityId;
    private String reportType;
    private String reportIdentifier;
    private LocalDate submitDate;
    private String transactionStatus;
    private LocalDate reportPreparationDate;
    private LocalDate reportTransmissionDate;
    private String suspicionCategoryCode;
    private String suspicionDescription;
}
