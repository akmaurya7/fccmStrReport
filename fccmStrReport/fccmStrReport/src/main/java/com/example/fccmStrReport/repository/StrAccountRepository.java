package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrAccountRepository extends JpaRepository<StrAccount, Long> {
    List<StrAccount> findByReportReportId(Long reportId);
}
