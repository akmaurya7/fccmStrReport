package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_customer_phone")
public class StrCustomerPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_phone_id")
    private Long customerPhoneId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private StrCustomer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phone_type_code", nullable = false)
    private StrPhoneType phoneType;

    @Column(name = "phone_number", length = 20, nullable = false)
    private String phoneNumber;
}
