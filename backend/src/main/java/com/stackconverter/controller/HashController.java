package com.stackconverter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

@RestController
@RequestMapping("/api/hash")
public class HashController {

    @GetMapping("/generate")
    public ResponseEntity<?> generateHash(
            @RequestParam String input,
            @RequestParam(defaultValue = "sha256") String algorithm
    ) {
        try {
            String normalizedAlgo = normalizeAlgorithm(algorithm);
            String hash = hashString(input, normalizedAlgo);

            return ResponseEntity.ok()
                    .body(new HashResponse(normalizedAlgo.toUpperCase(Locale.ROOT), hash));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Invalid algorithm or server error."));
        }
    }

    // Utility to generate hash
    private String hashString(String input, String algorithm) throws Exception {
        MessageDigest digest = MessageDigest.getInstance(algorithm);
        byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));

        // convert bytes to hex
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            hexString.append(String.format("%02x", b));
        }

        return hexString.toString();
    }

    // Normalize algorithm names (MD5/md5 → MD5)
    private String normalizeAlgorithm(String algo) {
        algo = algo.toLowerCase(Locale.ROOT);
        return switch (algo) {
            case "md5" -> "MD5";
            case "sha1", "sha-1" -> "SHA-1";
            case "sha256", "sha-256" -> "SHA-256";
            case "sha384", "sha-384" -> "SHA-384";
            case "sha512", "sha-512" -> "SHA-512";
            default -> throw new IllegalArgumentException("Unsupported algorithm");
        };
    }

    // Response classes
    record HashResponse(String algorithm, String hash) {}
    record ErrorResponse(String error) {}
}
