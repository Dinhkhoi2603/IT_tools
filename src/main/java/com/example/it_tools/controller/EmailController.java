package com.example.it_tools.controller;

import com.example.it_tools.dto.EmailRequest;
import com.example.it_tools.dto.EmailResponse;
import com.example.it_tools.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/parse")
    public ResponseEntity<?> parseEmail(@RequestBody EmailRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        EmailResponse response = emailService.parseEmail(request);
        return ResponseEntity.ok(response);
    }
}
