package com.example.it_tools.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok("👤 Profile of user: " + userDetails.getUsername());
    }
}
