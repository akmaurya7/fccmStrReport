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
@Table(name = "str_country")
public class StrCountry {

    @Id
    @Column(name = "country_code", length = 3, nullable = false)
    private String countryCode;

    @Column(name = "country_name", length = 100, nullable = false)
    private String countryName;
}

