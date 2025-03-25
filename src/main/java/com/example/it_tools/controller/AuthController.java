    package com.example.it_tools.controller;

    import com.example.it_tools.dto.AuthResponse;
    import com.example.it_tools.dto.LoginRequest;
    import com.example.it_tools.dto.RegisterRequest;
    import com.example.it_tools.service.AuthService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/auth")
    public class AuthController {
        private final AuthService authService;

        public AuthController(AuthService authService) {
            this.authService = authService;
        }

        @PostMapping("/register")
        public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
            System.out.println("📌 Login request received: " + request.getUsername());
            return ResponseEntity.ok(authService.register(request));
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
            System.out.println("📌 Login request received: " + request.getUsername());
            return ResponseEntity.ok(authService.login(request));
        }
    }
