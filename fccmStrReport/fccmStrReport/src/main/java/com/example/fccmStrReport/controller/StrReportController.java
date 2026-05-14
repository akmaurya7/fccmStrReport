package com.example.fccmStrReport.controller;

import com.example.fccmStrReport.dto.StrReportRequest;
import com.example.fccmStrReport.dto.StrReportResponse;
import com.example.fccmStrReport.dto.StrSubmitXmlRequest;
import com.example.fccmStrReport.service.PgpEncryptionService;
import com.example.fccmStrReport.service.StrReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reports")
public class StrReportController {

    private final StrReportService reportService;
    private final PgpEncryptionService pgpEncryptionService;

    public StrReportController(StrReportService reportService, PgpEncryptionService pgpEncryptionService) {
        this.reportService = reportService;
        this.pgpEncryptionService = pgpEncryptionService;
    }

    @GetMapping
    public List<StrReportResponse> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{reportId}")
    public StrReportResponse getReport(@PathVariable Long reportId) {
        return reportService.getReportById(reportId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StrReportResponse createReport(@RequestBody StrReportRequest report) {
        return reportService.createReport(report);
    }

    @PostMapping(value = "/submit-xml", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> submitAndDownloadXml(@RequestBody StrSubmitXmlRequest request) {
        String xml = reportService.createReportAndGenerateXml(request);
        String entityId = request != null && request.getReport() != null ? request.getReport().getReportingEntityId() : "report";
        String baseFileName = "STR_" + (entityId == null ? "report" : entityId) + ".xml";
        byte[] encrypted = pgpEncryptionService.encryptXmlToPgp(xml.getBytes(StandardCharsets.UTF_8), baseFileName);
        String fileName = baseFileName + ".pgp";
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"; filename*=UTF-8''" + encodedFileName)
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                .header("Pragma", "no-cache")
                .header("X-Content-Type-Options", "nosniff")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(encrypted);
    }

    @PutMapping("/{reportId}")
    public StrReportResponse updateReport(@PathVariable Long reportId, @RequestBody StrReportRequest report) {
        return reportService.updateReport(reportId, report);
    }

    @DeleteMapping("/{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
    }
}
