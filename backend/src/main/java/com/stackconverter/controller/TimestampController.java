package com.stackconverter.controller;

import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Map;

//Not using currently, JS taking care of time conversion in UI
@RestController
@RequestMapping("/api/timestamp")
public class TimestampController {

    @GetMapping("/to-date")
    public Map<String, Object> convertUnixToDate(@RequestParam long unix) {
        Instant instant = Instant.ofEpochSecond(unix);
        ZonedDateTime dateTime = instant.atZone(ZoneId.systemDefault());

        return Map.of(
                "unix", unix,
                "readable", dateTime.toString()
        );
    }

    @GetMapping("/to-unix")
    public Map<String, Object> convertDateToUnix(@RequestParam String dateTime) {
        ZonedDateTime parsed = ZonedDateTime.parse(dateTime);
        long unix = parsed.toEpochSecond();

        return Map.of(
                "input", dateTime,
                "unix", unix
        );
    }
}
