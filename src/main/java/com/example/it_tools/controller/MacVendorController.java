package com.example.it_tools.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mac")
public class MacVendorController {

    private final RestTemplate restTemplate;

    public MacVendorController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/{macAddress}")
    public ResponseEntity<?> getVendorInfo(@PathVariable String macAddress) {
        String url = "https://www.macvendorlookup.com/api/v2/" + macAddress;
        try {
            ResponseEntity<Object[]> response = restTemplate.getForEntity(url, Object[].class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch vendor info");
        }
    }
}
