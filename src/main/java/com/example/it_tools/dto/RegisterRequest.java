package com.example.it_tools.dto;

import com.example.it_tools.model.Role;
import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}
