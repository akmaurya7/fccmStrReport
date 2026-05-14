package com.example.fccmStrReport.controller;

import com.example.fccmStrReport.dto.LookupItemDto;
import com.example.fccmStrReport.service.StrLookupService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/lookups")
public class StrLookupController {

    private final StrLookupService lookupService;

    public StrLookupController(StrLookupService lookupService) {
        this.lookupService = lookupService;
    }

    @GetMapping("/countries")
    public List<LookupItemDto> getCountries() {
        return lookupService.getCountries();
    }

    @GetMapping("/currencies")
    public List<LookupItemDto> getCurrencies() {
        return lookupService.getCurrencies();
    }

    @GetMapping("/transaction-types")
    public List<LookupItemDto> getTransactionTypes() {
        return lookupService.getTransactionTypes();
    }

    @GetMapping("/account-types")
    public List<LookupItemDto> getAccountTypes() {
        return lookupService.getAccountTypes();
    }

    @GetMapping("/phone-types")
    public List<LookupItemDto> getPhoneTypes() {
        return lookupService.getPhoneTypes();
    }

    @GetMapping("/suspicion-categories")
    public List<LookupItemDto> getSuspicionCategories() {
        return lookupService.getSuspicionCategories();
    }
}
