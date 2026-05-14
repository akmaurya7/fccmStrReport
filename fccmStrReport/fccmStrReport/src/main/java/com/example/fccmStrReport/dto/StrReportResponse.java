package com.example.fccmStrReport.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class StrReportResponse {
    private Long reportId;
    private String reportingEntityId;
    private String reportType;
    private String reportIdentifier;
    private LocalDate submitDate;
    private String transactionStatus;
    private LocalDate reportPreparationDate;
    private LocalDate reportTransmissionDate;
    private String suspicionCategoryCode;
    private String suspicionCategoryName;
    private String suspicionDescription;
    private LocalDateTime createdAt;
}
