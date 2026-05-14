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
@Table(name = "str_phone_type")
public class StrPhoneType {

    @Id
    @Column(name = "phone_type_code", length = 20, nullable = false)
    private String phoneTypeCode;

    @Column(name = "phone_type_name", length = 50, nullable = false)
    private String phoneTypeName;
}
