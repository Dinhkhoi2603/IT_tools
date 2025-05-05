package com.example.it_tools.controller;

import com.example.it_tools.model.User;
import com.example.it_tools.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping("/upgrade-to-premium")
    public ResponseEntity<?> upgradeToPremium(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .map(user -> {
                    // Cập nhật trạng thái Premium
                    user.setPremium(true);
                    userRepository.save(user); // Lưu lại thay đổi vào cơ sở dữ liệu
                    return ResponseEntity.ok(user); // Trả về người dùng đã được cập nhật
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
