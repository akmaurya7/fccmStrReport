package com.example.fccmStrReport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_reporting_entity")
public class StrReportingEntity {

    @Id
    @Column(name = "reporting_entity_id", length = 30, nullable = false)
    private String reportingEntityId;
}
