package com.example.fccmStrReport;

import org.springframework.boot.SpringApplication;

public class TestFccmStrReportApplication {

	public static void main(String[] args) {
		SpringApplication.from(FccmStrReportApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
