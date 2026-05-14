package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrTransactionRepository extends JpaRepository<StrTransaction, Long> {
    List<StrTransaction> findByReportReportId(Long reportId);
}
