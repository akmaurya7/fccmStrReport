package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrSupportingDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrSupportingDocumentRepository extends JpaRepository<StrSupportingDocument, Long> {
    List<StrSupportingDocument> findByReportReportId(Long reportId);
}
