package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_report")
public class StrReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporting_entity_id", nullable = false)
    private StrReportingEntity reportingEntity;

    @Column(name = "report_type", length = 10, nullable = false)
    private String reportType;

    @Column(name = "report_identifier", length = 15)
    private String reportIdentifier;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "transaction_status", length = 20, nullable = false)
    private String transactionStatus;

    @Column(name = "report_preparation_date", nullable = false)
    private LocalDate reportPreparationDate;

    @Column(name = "report_transmission_date", nullable = false)
    private LocalDate reportTransmissionDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "suspicion_category_code", nullable = false)
    private StrSuspicionCategory suspicionCategory;

    @Column(name = "suspicion_description", length = 2000, nullable = false)
    private String suspicionDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
