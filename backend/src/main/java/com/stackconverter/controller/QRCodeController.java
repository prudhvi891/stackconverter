package com.stackconverter.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;

import java.awt.*;
import java.awt.image.BufferedImage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QRCodeController {


    @GetMapping("/image")
    public ResponseEntity<byte[]> generateQr(
            @RequestParam String text,
            @RequestParam(defaultValue = "png") String format,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(defaultValue = "#000000") String darkColorHex,
            @RequestParam(defaultValue = "#FFFFFF") String lightColorHex
    ) {
        try {

            // Convert HEX → Color
            Color darkColor = Color.decode(darkColorHex);
            Color lightColor = Color.decode(lightColorHex);

            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.CHARACTER_SET, "UTF-8",
                    EncodeHintType.MARGIN, 1
            );

            BitMatrix matrix = new MultiFormatWriter().encode(
                    text, BarcodeFormat.QR_CODE, size, size, hints
            );

            BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < size; x++) {
                for (int y = 0; y < size; y++) {
                    boolean bit = matrix.get(x, y);
                    image.setRGB(x, y, bit ? darkColor.getRGB() : lightColor.getRGB());
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            format = format.toLowerCase();
            if (format.equals("jpg")) format = "jpeg";

            ImageIO.write(image, format, baos);

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "image/" + format)
                    .body(baos.toByteArray());

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(("Error generating QR: " + e.getMessage()).getBytes());
        }
    }


    @GetMapping("/base64")
    public Map<String, Object> generateQrBase64(
            @RequestParam String text,
            @RequestParam(defaultValue = "png") String format,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(defaultValue = "#000000") String darkColorHex,
            @RequestParam(defaultValue = "#FFFFFF") String lightColorHex
    ) {
        try {
            Color darkColor = Color.decode(darkColorHex);
            Color lightColor = Color.decode(lightColorHex);

            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.CHARACTER_SET, "UTF-8",
                    EncodeHintType.MARGIN, 1
            );

            BitMatrix matrix = new MultiFormatWriter().encode(
                    text, BarcodeFormat.QR_CODE, size, size, hints
            );

            BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < size; x++) {
                for (int y = 0; y < size; y++) {
                    boolean bit = matrix.get(x, y);
                    image.setRGB(x, y, bit ? darkColor.getRGB() : lightColor.getRGB());
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            if (format.equals("jpg")) format = "jpeg";

            ImageIO.write(image, format, baos);

            String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());

            return Map.of(
                    "text", text,
                    "format", format,
                    "size", size,
                    "darkColor", darkColorHex,
                    "lightColor", lightColorHex,
                    "imageBase64", base64
            );

        } catch (Exception e) {
            return Map.of("error", "Error generating QR: " + e.getMessage());
        }
    }


}
