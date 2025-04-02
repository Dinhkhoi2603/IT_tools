package com.example.it_tools.controller;

import com.example.it_tools.security.JwtUtil;
import com.example.it_tools.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/github")
public class GitHubAuthController {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userService;
    @Autowired
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.github.redirect-uri}")
    private String redirectUri;

    public GitHubAuthController(JwtUtil jwtUtil, CustomUserDetailsService userService, RestTemplate restTemplate) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> githubLogin(@RequestParam("code") String code, HttpServletResponse response) {
        System.out.println("Received GitHub OAuth callback with code: " + code);

        if (code == null || code.isEmpty()) {
            System.out.println("Error: Code is missing or empty");
            return ResponseEntity.badRequest().build();
        }

        // 🔹 Lấy Access Token từ GitHub
        String accessToken = getAccessToken(code);
        if (accessToken == null) {
            System.out.println("Error: Failed to retrieve GitHub access token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("GitHub Access Token: " + accessToken);

        // 🔹 Lấy thông tin user từ GitHub
        Map<String, Object> userInfo = getUserInfo(accessToken);
        if (userInfo == null) {
            System.out.println("Error: Failed to fetch user info from GitHub");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("GitHub User Info: " + userInfo);

        // Lấy email nếu có, nếu không thì lấy từ API emails
        String email = (String) userInfo.get("email");
        if (email == null) {
            email = getUserEmail(accessToken);
        }
        if (email == null) {
            System.out.println("Error: No verified email found for the user");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("User Email: " + email);

        String name = (String) userInfo.get("name");
        if (name == null || name.isEmpty()) {
            name = (String) userInfo.get("login"); // Gán login làm tên mặc định
        }
        System.out.println("User Name: " + name);

        // 🔹 Đăng ký user nếu chưa có
        userService.registerIfNotExists(email, name);
        System.out.println("User registered or already exists");

        // 🔹 Tạo JWT
        UserDetails userDetails = userService.loadUserByUsername(name);
        String token = jwtUtil.generateToken(userDetails);
        System.out.println("Generated JWT Token: " + token);

        // 🔹 Chuyển hướng về Frontend với token
        String frontendUrl = "http://localhost:5173/auth/github/callback?token=" + token;
        System.out.println("Redirecting to frontend: " + frontendUrl);
        response.setHeader("Location", frontendUrl);

        return ResponseEntity.status(302).build();
    }


    // 📌 Hàm lấy Access Token từ GitHub
    private String getAccessToken(String code) {
        System.out.println("Requesting GitHub Access Token...");

        String tokenUrl = "https://github.com/login/oauth/access_token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        body.put("redirect_uri", redirectUri);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, Map.class);

        System.out.println("GitHub Response: " + response.getBody());

        if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
            System.err.println("Failed to get access token.");
            return null;
        }

        return (String) response.getBody().get("access_token");
    }


    // 📌 Hàm lấy thông tin user từ GitHub
    private Map<String, Object> getUserInfo(String accessToken) {
        String userUrl = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userUrl, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    // 📌 Hàm lấy email nếu GitHub API không trả về email trong `/user`
    private String getUserEmail(String accessToken) {
        String emailUrl = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(emailUrl, HttpMethod.GET, request, List.class);
        if (response.getBody() == null || response.getBody().isEmpty()) {
            return null;
        }

        for (Object obj : response.getBody()) {
            Map<String, Object> emailInfo = (Map<String, Object>) obj;
            if ((boolean) emailInfo.get("primary") && (boolean) emailInfo.get("verified")) {
                return (String) emailInfo.get("email");
            }
        }
        return null;
    }
}
