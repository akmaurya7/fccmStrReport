package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrAccountType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StrAccountTypeRepository extends JpaRepository<StrAccountType, String> {
    Optional<StrAccountType> findByAccountTypeName(String accountTypeName);
}
