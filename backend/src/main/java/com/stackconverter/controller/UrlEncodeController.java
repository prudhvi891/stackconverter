package com.stackconverter.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/url")
public class UrlEncodeController {

    // --- URL ENCODE ---
    @GetMapping("/encode")
    public Map<String, Object> urlEncode(@RequestParam String input) {
        String encoded = URLEncoder.encode(input, StandardCharsets.UTF_8);
        return Map.of("input", input, "encoded", encoded);
    }

    // --- URL DECODE ---
    @GetMapping("/decode")
    public Map<String, Object> urlDecode(@RequestParam String input) {
        try {
            String decoded = URLDecoder.decode(input, StandardCharsets.UTF_8);
            return Map.of("input", input, "decoded", decoded);
        } catch (Exception e) {
            return Map.of("error", "Invalid URL encoded input");
        }
    }

}
