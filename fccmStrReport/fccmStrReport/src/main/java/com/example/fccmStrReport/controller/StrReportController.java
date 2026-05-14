package com.example.fccmStrReport.controller;

import com.example.fccmStrReport.dto.StrReportRequest;
import com.example.fccmStrReport.dto.StrReportResponse;
import com.example.fccmStrReport.dto.StrSubmitXmlRequest;
import com.example.fccmStrReport.service.StrReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reports")
public class StrReportController {

    private final StrReportService reportService;

    public StrReportController(StrReportService reportService) {
        this.reportService = reportService;
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

    @PostMapping(value = "/submit-xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<byte[]> submitAndDownloadXml(@RequestBody StrSubmitXmlRequest request) {
        String xml = reportService.createReportAndGenerateXml(request);
        String entityId = request != null && request.getReport() != null ? request.getReport().getReportingEntityId() : "report";
        String fileName = "STR_" + (entityId == null ? "report" : entityId) + ".xml";
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.getBytes(StandardCharsets.UTF_8));
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
