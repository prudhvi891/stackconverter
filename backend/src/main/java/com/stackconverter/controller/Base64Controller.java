package com.stackconverter.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/api/base64")
public class Base64Controller {

    // Response Records (Java 21)
    public record EncodeResponse(String encoded) {}
    public record DecodeResponse(String decoded) {}
    public record ErrorResponse(String error) {}

    // ───────────────────────────────────────────────────────────────
    // 1️⃣  TEXT → BASE64
    // ───────────────────────────────────────────────────────────────
    @GetMapping("/encode")
    public ResponseEntity<?> encodeText(@RequestParam String input) {
        try {
            String encoded = Base64.getEncoder()
                    .encodeToString(input.getBytes(StandardCharsets.UTF_8));

            return ResponseEntity.ok(new EncodeResponse(encoded));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ErrorResponse("Encoding failed: " + e.getMessage()));
        }
    }

    // ───────────────────────────────────────────────────────────────
    // 2️⃣ BASE64 → TEXT
    // ───────────────────────────────────────────────────────────────
    @GetMapping("/decode")
    public ResponseEntity<?> decodeText(@RequestParam String input) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(input);
            String decoded = new String(decodedBytes, StandardCharsets.UTF_8);

            return ResponseEntity.ok(new DecodeResponse(decoded));

        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(new ErrorResponse("Invalid Base64 string"));
        }
    }

    // ============================================================
    // 1️⃣ FILE → BASE64 (.txt)
    // ============================================================
    @PostMapping("/file/encode")
    public ResponseEntity<?> encodeFile(@RequestParam("file") MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String encoded = Base64.getEncoder().encodeToString(bytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"encoded_base64.txt\"")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(encoded.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error encoding file: " + e.getMessage()).getBytes());
        }
    }


    // ============================================================
    // 2️⃣ BASE64 → ORIGINAL FILE (CSV/Excel/Binary detection)
    // ============================================================
    @PostMapping("/file/decode")
    public ResponseEntity<?> decodeBase64File(@RequestParam("file") MultipartFile file) {
        try {
            String base64Content = new String(file.getBytes(), StandardCharsets.UTF_8).trim();

            // Strip common prefixes like data:*;base64,
            if (base64Content.contains(",")) {
                String[] parts = base64Content.split(",", 2);
                if (parts[0].contains("base64")) {
                    base64Content = parts[1];
                }
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Content);

            // Detect file extension
            String extension = detectFileExtension(decodedBytes);
            String filename = "decoded_output" + extension;

            // Detect MIME
            String contentType = guessMime(extension);

            String cdHeader = "attachment; filename=\"" + filename +
                    "\"; filename*=UTF-8''" + filename;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, cdHeader)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(decodedBytes);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(("Invalid Base64 content").getBytes());

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error decoding Base64 file: " + e.getMessage()).getBytes());
        }
    }


    // ============================================================
    // 🔍 FILE TYPE DETECTION (CSV + Excel + Guru Binary Scan)
    // ============================================================
    private String detectFileExtension(byte[] bytes) {

        // 1️⃣ CSV / TXT detection (high accuracy)
        if (looksLikeText(bytes)) {
            String text = new String(bytes, StandardCharsets.UTF_8);

            // CSV heuristic
            if (looksLikeCSV(text)) return ".csv";

            return ".txt"; // fallback instead of .bin
        }

        // 2️⃣ Excel XLSX → ZIP-based, contains xl/workbook.xml
        if (isXLSX(bytes)) return ".xlsx";

        // 3️⃣ Excel XLS (old binary)
        if (startsWith(bytes, new byte[]{
                (byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0, (byte) 0xA1, (byte) 0xB1, 0x1A, (byte) 0xE1
        }, 0)) {
            return ".xls";
        }

        // 4️⃣ Binary formats (Guru scan up to 512 bytes)
        int limit = Math.min(bytes.length, 512);

        for (int offset = 0; offset < limit; offset++) {

            // JPG
            if (startsWith(bytes, new byte[]{(byte) 0xFF, (byte) 0xD8}, offset))
                return ".jpg";

            // PNG
            if (startsWith(bytes, new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47}, offset))
                return ".png";

            // GIF
            if (startsWith(bytes, "GIF89a".getBytes(), offset) ||
                    startsWith(bytes, "GIF87a".getBytes(), offset))
                return ".gif";

            // PDF
            if (startsWith(bytes, "%PDF".getBytes(), offset))
                return ".pdf";

            // ZIP container (docx/xlsx/pptx)
            if (startsWith(bytes, new byte[]{0x50, 0x4B, 0x03, 0x04}, offset))
                return ".zip";

            // MP3
            if (startsWith(bytes, new byte[]{(byte) 0xFF, (byte) 0xFB}, offset))
                return ".mp3";

            // MP4 ("ftyp")
            if (offset + 8 < limit &&
                    bytes[offset + 4] == 'f' &&
                    bytes[offset + 5] == 't' &&
                    bytes[offset + 6] == 'y' &&
                    bytes[offset + 7] == 'p')
                return ".mp4";
        }

        // Default fallback
        return ".txt"; // NOT .bin
    }


    // ============================================================
    // TEXT DETECTION
    // ============================================================
    private boolean looksLikeText(byte[] bytes) {
        int printable = 0, total = Math.min(bytes.length, 2048);

        for (int i = 0; i < total; i++) {
            byte b = bytes[i];

            if (b == '\n' || b == '\r' || b == '\t' || b == 32) {
                printable++;
                continue;
            }

            if (b >= 32 && b <= 126) {
                printable++;
            }
        }

        return ((double) printable / total) > 0.90;
    }

    private boolean looksLikeCSV(String text) {
        return text.contains(",") && text.contains("\n") && !text.contains("{") && !text.contains("<");
    }


    // ============================================================
    // XLSX DETECTION (ZIP with xl/workbook.xml)
    // ============================================================
    private boolean isXLSX(byte[] bytes) {
        try (ZipInputStream zin = new ZipInputStream(new java.io.ByteArrayInputStream(bytes))) {
            ZipEntry entry;

            while ((entry = zin.getNextEntry()) != null) {
                String name = entry.getName().toLowerCase();

                if (name.equals("[content_types].xml")) continue;

                if (name.equals("xl/workbook.xml") || name.startsWith("xl/worksheets/"))
                    return true;
            }
        } catch (Exception ignored) {}

        return false;
    }


    // ============================================================
    // MIME TYPE MAP
    // ============================================================
    private String guessMime(String ext) {
        return switch (ext) {
            case ".png" -> "image/png";
            case ".jpg" -> "image/jpeg";
            case ".gif" -> "image/gif";
            case ".pdf" -> "application/pdf";
            case ".xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case ".xls" -> "application/vnd.ms-excel";
            case ".csv" -> "text/csv";
            default -> "text/plain";
        };
    }


    // ============================================================
    // Helper
    // ============================================================
    private boolean startsWith(byte[] data, byte[] signature, int offset) {
        if (data.length < offset + signature.length) return false;
        for (int i = 0; i < signature.length; i++) {
            if (data[offset + i] != signature[i]) return false;
        }
        return true;
    }

}
