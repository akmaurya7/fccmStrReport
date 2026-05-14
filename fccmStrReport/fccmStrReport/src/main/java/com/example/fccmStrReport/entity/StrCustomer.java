package com.example.fccmStrReport.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "str_customer")
public class StrCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_type", length = 20, nullable = false)
    private String customerType;

    @Column(name = "id_type", length = 20)
    private String idType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passport_country_code")
    private StrCountry passportCountry;

    @Column(name = "id_number", length = 40)
    private String idNumber;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "father_first_name", length = 100)
    private String fatherFirstName;

    @Column(name = "father_last_name", length = 100)
    private String fatherLastName;

    @Column(name = "tin", length = 30)
    private String tin;

    @Column(name = "legal_entity_full_name", length = 200)
    private String legalEntityFullName;

    @Column(name = "house_number", length = 100, nullable = false)
    private String houseNumber;

    @Column(name = "street_name", length = 200, nullable = false)
    private String streetName;

    @Column(name = "district_name", length = 200, nullable = false)
    private String districtName;

    @Column(name = "location_name", length = 200, nullable = false)
    private String locationName;

    @Column(name = "city_name", length = 200, nullable = false)
    private String cityName;
}
