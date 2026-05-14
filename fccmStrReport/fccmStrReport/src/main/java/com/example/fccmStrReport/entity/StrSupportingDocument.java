package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_supporting_document")
public class StrSupportingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private StrReport report;

    @Column(name = "file_name", length = 255, nullable = false)
    private String fileName;

    @Lob
    @Column(name = "file_content", nullable = false)
    private byte[] fileContent;

    @Column(name = "document_name", length = 255, nullable = false)
    private String documentName;

    @Column(name = "document_type", length = 50, nullable = false)
    private String documentType;

    @Column(name = "document_identifier", length = 200, nullable = false)
    private String documentIdentifier;

    @Column(name = "document_date", nullable = false)
    private LocalDate documentDate;

    @Column(name = "document_preparer", length = 200, nullable = false)
    private String documentPreparer;
}
