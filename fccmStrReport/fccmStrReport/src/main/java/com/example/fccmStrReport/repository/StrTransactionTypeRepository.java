package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.StrTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StrTransactionTypeRepository extends JpaRepository<StrTransactionType, String> {
    Optional<StrTransactionType> findByTransactionTypeName(String transactionTypeName);
}
