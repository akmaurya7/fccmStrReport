package com.example.fccmStrReport.service;

import com.example.fccmStrReport.dto.LookupItemDto;
import com.example.fccmStrReport.entity.*;
import com.example.fccmStrReport.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StrLookupService {

    private final StrCountryRepository countryRepository;
    private final StrCurrencyRepository currencyRepository;
    private final StrTransactionTypeRepository transactionTypeRepository;
    private final StrAccountTypeRepository accountTypeRepository;
    private final StrPhoneTypeRepository phoneTypeRepository;
    private final StrSuspicionCategoryRepository suspicionCategoryRepository;

    public StrLookupService(
            StrCountryRepository countryRepository,
            StrCurrencyRepository currencyRepository,
            StrTransactionTypeRepository transactionTypeRepository,
            StrAccountTypeRepository accountTypeRepository,
            StrPhoneTypeRepository phoneTypeRepository,
            StrSuspicionCategoryRepository suspicionCategoryRepository
    ) {
        this.countryRepository = countryRepository;
        this.currencyRepository = currencyRepository;
        this.transactionTypeRepository = transactionTypeRepository;
        this.accountTypeRepository = accountTypeRepository;
        this.phoneTypeRepository = phoneTypeRepository;
        this.suspicionCategoryRepository = suspicionCategoryRepository;
    }

    public List<LookupItemDto> getCountries() {
        return countryRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getCountryCode(), x.getCountryName()))
                .toList();
    }

    public List<LookupItemDto> getCurrencies() {
        return currencyRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getCurrencyCode(), x.getCurrencyName()))
                .toList();
    }

    public List<LookupItemDto> getTransactionTypes() {
        return transactionTypeRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getTransactionTypeCode(), x.getTransactionTypeName()))
                .toList();
    }

    public List<LookupItemDto> getAccountTypes() {
        return accountTypeRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getAccountTypeCode(), x.getAccountTypeName()))
                .toList();
    }

    public List<LookupItemDto> getPhoneTypes() {
        return phoneTypeRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getPhoneTypeCode(), x.getPhoneTypeName()))
                .toList();
    }

    public List<LookupItemDto> getSuspicionCategories() {
        return suspicionCategoryRepository.findAll().stream()
                .map(x -> new LookupItemDto(x.getSuspicionCategoryCode(), x.getSuspicionCategoryName()))
                .toList();
    }
}
