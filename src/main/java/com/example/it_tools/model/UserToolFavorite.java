package com.example.it_tools.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user_tool_favorites")
@CompoundIndex(name = "user_tool_idx", def = "{'user.$id': 1, 'toolName': 1}", unique = true)
public class UserToolFavorite {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private String toolName;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Constructor with fields (excluding id and createdAt which are auto-generated)
    public UserToolFavorite(User user, String toolName) {
        this.user = user;
        this.toolName = toolName;
        this.createdAt = LocalDateTime.now();
    }
}