package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrCustomerPhone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrCustomerPhoneRepository extends JpaRepository<StrCustomerPhone, Long> {
    List<StrCustomerPhone> findByCustomerCustomerId(Long customerId);
}
