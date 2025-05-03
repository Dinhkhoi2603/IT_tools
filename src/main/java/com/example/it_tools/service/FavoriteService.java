package com.example.it_tools.service;

import com.example.it_tools.model.User;
import com.example.it_tools.model.UserToolFavorite;
import com.example.it_tools.repository.UserRepository;
import com.example.it_tools.repository.UserToolFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserToolFavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    
    /**
     * Get all favorite tool names for a user
     */
    public List<String> getUserFavorites(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return favoriteRepository.findByUser(user)
                .stream()
                .map(UserToolFavorite::getToolName)
                .collect(Collectors.toList());
    }
    
    /**
     * Add a tool to user favorites
     */
    public UserToolFavorite addFavorite(String userId, String toolName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already favorited
        if (favoriteRepository.existsByUserAndToolName(user, toolName)) {
            return favoriteRepository.findByUserAndToolName(user, toolName)
                    .orElseThrow(() -> new RuntimeException("Favorite not found"));
        }
        
        // Create new favorite
        UserToolFavorite favorite = new UserToolFavorite(user, toolName);
        return favoriteRepository.save(favorite);
    }
    
    /**
     * Remove a tool from user favorites
     */
    @Transactional
    public void removeFavorite(String userId, String toolName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        favoriteRepository.deleteByUserAndToolName(user, toolName);
    }
    
    /**
     * Check if a tool is in user favorites
     */
    public boolean isFavorite(String userId, String toolName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return favoriteRepository.existsByUserAndToolName(user, toolName);
    }
}