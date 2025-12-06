package com.stackconverter.controller;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/convert")
public class FileConvertController {

    /**
     * -----------------------------------------------------------
     *  Excel → CSV Converter
     * -----------------------------------------------------------
     */
    @PostMapping("/excel-to-csv")
    public ResponseEntity<byte[]> convertExcelToCsv(@RequestParam("file") MultipartFile file) {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);
            StringBuilder csv = new StringBuilder();

            for (Row row : sheet) {
                int lastCol = row.getLastCellNum();

                for (int i = 0; i < lastCol; i++) {
                    Cell cell = row.getCell(i);

                    if (cell != null) {
                        switch (cell.getCellType()) {
                            case STRING -> csv.append(escapeCsv(cell.getStringCellValue()));
                            case NUMERIC -> csv.append(cell.getNumericCellValue());
                            case BOOLEAN -> csv.append(cell.getBooleanCellValue());
                            case FORMULA -> csv.append(cell.getCellFormula());
                            default -> csv.append("");
                        }
                    } else {
                        csv.append("");
                    }

                    // Add comma except for the last column
                    if (i < lastCol - 1) csv.append(",");
                }
                csv.append("\n");
            }

            byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=converted.csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csvBytes);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error converting Excel to CSV: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Escape CSV fields properly
     */
    private String escapeCsv(String value) {
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }

    /**
     * -----------------------------------------------------------
     *  CSV → Excel Converter
     * -----------------------------------------------------------
     */
    @PostMapping("/csv-to-excel")
    public ResponseEntity<byte[]> convertCsvToExcel(@RequestParam("file") MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Sheet1");

            // Read CSV lines
            List<String> lines = new BufferedReader(
                    new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)
            ).lines().collect(Collectors.toList());

            int rowIndex = 0;
            for (String line : lines) {
                Row row = sheet.createRow(rowIndex++);
                String[] values = parseCsvLine(line);

                for (int col = 0; col < values.length; col++) {
                    row.createCell(col).setCellValue(values[col]);
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=converted.xlsx")
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(out.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error converting CSV to Excel: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Proper CSV parsing that handles quotes & commas inside values.
     */
    private String[] parseCsvLine(String line) {
        List<String> tokens = new java.util.ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (char c : line.toCharArray()) {
            if (c == '\"') {
                inQuotes = !inQuotes; // flip flag
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }

        tokens.add(sb.toString());
        return tokens.toArray(new String[0]);
    }
}
