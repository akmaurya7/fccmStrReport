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
@Table(name = "str_transaction_type")
public class StrTransactionType {

    @Id
    @Column(name = "transaction_type_code", length = 40, nullable = false)
    private String transactionTypeCode;

    @Column(name = "transaction_type_name", length = 100, nullable = false)
    private String transactionTypeName;
}
