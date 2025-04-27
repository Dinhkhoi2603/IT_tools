package com.example.it_tools.controller;

import com.google.i18n.phonenumbers.*;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/phone")
public class PhoneParserController {

    private final PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();

    @PostMapping("/parse")
    public ResponseEntity<?> parsePhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String country = body.get("country");

        try {
            PhoneNumber number = phoneUtil.parse(phone, country);
            boolean isValid = phoneUtil.isValidNumber(number);
            boolean isPossible = phoneUtil.isPossibleNumber(number);
            PhoneNumberUtil.PhoneNumberType type = phoneUtil.getNumberType(number);

            Map<String, Object> result = new HashMap<>();
            result.put("country", phoneUtil.getRegionCodeForNumber(number));
            result.put("countryName", new Locale("", phoneUtil.getRegionCodeForNumber(number)).getDisplayCountry());
            result.put("callingCode", phoneUtil.getCountryCodeForRegion(country));
            result.put("isValid", isValid);
            result.put("isPossible", isPossible);
            result.put("type", type.toString());
            result.put("international", phoneUtil.format(number, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL));
            result.put("national", phoneUtil.format(number, PhoneNumberUtil.PhoneNumberFormat.NATIONAL));
            result.put("e164", phoneUtil.format(number, PhoneNumberUtil.PhoneNumberFormat.E164));
            result.put("rfc3966", phoneUtil.format(number, PhoneNumberUtil.PhoneNumberFormat.RFC3966));

            return ResponseEntity.ok(result);
        } catch (NumberParseException e) {
            return ResponseEntity.badRequest().body("Invalid phone number: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong.");
        }
    }
}
