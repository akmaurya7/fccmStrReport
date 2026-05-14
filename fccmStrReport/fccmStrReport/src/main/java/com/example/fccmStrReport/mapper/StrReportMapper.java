package com.example.fccmStrReport.mapper;

import com.example.fccmStrReport.dto.StrReportResponse;
import com.example.fccmStrReport.entity.StrReport;
import org.springframework.stereotype.Component;

@Component
public class StrReportMapper {

    public StrReportResponse toResponse(StrReport report) {
        StrReportResponse dto = new StrReportResponse();
        dto.setReportId(report.getReportId());
        dto.setReportingEntityId(report.getReportingEntity().getReportingEntityId());
        dto.setReportType(report.getReportType());
        dto.setReportIdentifier(report.getReportIdentifier());
        dto.setSubmitDate(report.getSubmitDate());
        dto.setTransactionStatus(report.getTransactionStatus());
        dto.setReportPreparationDate(report.getReportPreparationDate());
        dto.setReportTransmissionDate(report.getReportTransmissionDate());
        dto.setSuspicionCategoryCode(report.getSuspicionCategory().getSuspicionCategoryCode());
        dto.setSuspicionCategoryName(report.getSuspicionCategory().getSuspicionCategoryName());
        dto.setSuspicionDescription(report.getSuspicionDescription());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
