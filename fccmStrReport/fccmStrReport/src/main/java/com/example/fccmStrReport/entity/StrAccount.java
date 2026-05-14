package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_account")
public class StrAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private StrReport report;

    @Column(name = "account_number", length = 34, nullable = false)
    private String accountNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_type_code", nullable = false)
    private StrAccountType accountType;

    @Column(name = "bank_name", length = 200, nullable = false)
    private String bankName;

    @Column(name = "bank_address", length = 500, nullable = false)
    private String bankAddress;
}
