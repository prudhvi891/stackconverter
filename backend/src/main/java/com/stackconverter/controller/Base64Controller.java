package com.stackconverter.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

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

    // ───────────────────────────────────────────────────────────────
    // 3️⃣ FILE → BASE64 (Upload a normal file, return Base64 text file)
    // ───────────────────────────────────────────────────────────────
    @PostMapping("/file/encode")
    public ResponseEntity<?> encodeFile(@RequestParam("file") MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String encoded = Base64.getEncoder().encodeToString(bytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=encoded_base64.txt")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(encoded.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error encoding file: " + e.getMessage()).getBytes());
        }
    }

    // ───────────────────────────────────────────────────────────────
    // 4️⃣ BASE64 FILE → TEXT FILE
    // ───────────────────────────────────────────────────────────────
    @PostMapping("/file/decode")
    public ResponseEntity<?> decodeBase64File(@RequestParam("file") MultipartFile file) {
        try {
            String base64Content = new String(file.getBytes(), StandardCharsets.UTF_8);
            byte[] decodedBytes = Base64.getDecoder().decode(base64Content);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=decoded_output.txt")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(decodedBytes);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(("Invalid Base64 content").getBytes());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(("Error decoding Base64 file: " + e.getMessage()).getBytes());
        }
    }
}
