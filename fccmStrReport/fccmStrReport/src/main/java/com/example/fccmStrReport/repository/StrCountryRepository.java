package com.example.fccmStrReport.repository;

import com.example.fccmStrReport.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StrCountryRepository extends JpaRepository<StrCountry, String> {
    Optional<StrCountry> findByCountryName(String countryName);
}
