package com.example.it_tools.repository;

import com.example.it_tools.model.User;
import com.example.it_tools.model.UserToolFavorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserToolFavoriteRepository extends MongoRepository<UserToolFavorite, String> {
    
    // Find all favorites for a specific user
    List<UserToolFavorite> findByUser(User user);
    
    // Find a specific favorite by user and tool name
    Optional<UserToolFavorite> findByUserAndToolName(User user, String toolName);
    
    // Delete a favorite by user and tool name
    void deleteByUserAndToolName(User user, String toolName);
    
    // Check if a tool is favorited by a user
    boolean existsByUserAndToolName(User user, String toolName);
}