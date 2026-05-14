package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrReportCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrReportCustomerRepository extends JpaRepository<StrReportCustomer, Long> {
    List<StrReportCustomer> findByReportReportId(Long reportId);
}
