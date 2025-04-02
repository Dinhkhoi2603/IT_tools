package com.example.it_tools.service;

import com.example.it_tools.model.Role;
import com.example.it_tools.model.User;
import com.example.it_tools.repository.UserRepository;
import com.example.it_tools.security.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new UserPrincipal(user);
    }
    public void registerIfNotExists(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name); // Hoặc có thể set tên khác nếu cần
            newUser.setPassword(""); // Vì OAuth không dùng mật khẩu
            newUser.setRole(Role.valueOf("USER")); // Gán quyền mặc định

            userRepository.save(newUser);
        }
    }
}
