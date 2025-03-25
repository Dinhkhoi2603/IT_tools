package com.example.it_tools.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users") // Lưu vào MongoDB
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private Role role; // Dùng ENUM thay vì Set<Role>
}
