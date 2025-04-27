package com.example.it_tools.controller;

import org.iban4j.Iban;
import org.iban4j.IbanFormatException;
import org.iban4j.IbanUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/iban")
public class IbanParserController {

    @PostMapping("/parse")
    public ResponseEntity<?> parseIban(@RequestBody Map<String, String> body) {
        String ibanInput = body.get("iban");

        try {
            // Normalize IBAN (remove spaces and upper-case)
            String normalizedIban = ibanInput.replaceAll("\\s+", "").toUpperCase();

            // Validate IBAN (format + checksum)
            IbanUtil.validate(normalizedIban);

            // Parse IBAN object
            Iban iban = Iban.valueOf(normalizedIban);

            Map<String, Object> result = new HashMap<>();
            result.put("isValid", true);
            result.put("countryCode", iban.getCountryCode().name());
            result.put("bban", iban.getBban());
            result.put("friendlyFormat", formatFriendly(normalizedIban));
            result.put("compactFormat", normalizedIban);

            return ResponseEntity.ok(result);

        } catch (IbanFormatException | IllegalArgumentException e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("isValid", false);
            errorResult.put("error", "Invalid IBAN: " + e.getMessage());
            return ResponseEntity.ok(errorResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong.");
        }
    }

    private String formatFriendly(String iban) {
        return iban.replaceAll("(.{4})(?!$)", "$1 ").trim();
    }
}
