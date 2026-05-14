package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_currency")
public class StrCurrency {

    @Id
    @Column(name = "currency_code", length = 3, nullable = false)
    private String currencyCode;

    @Column(name = "currency_name", length = 100)
    private String currencyName;
}
