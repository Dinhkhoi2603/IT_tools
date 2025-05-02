package com.example.it_tools.controller;

import com.example.it_tools.model.User;
import com.example.it_tools.model.UserToolFavorite;
import com.example.it_tools.repository.UserRepository;
import com.example.it_tools.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    /**
     * GET /api/favorites
     * Retrieve all favorites for the current authenticated user
     */
    @GetMapping
    public ResponseEntity<List<String>> getUserFavorites() {
        String userId = getCurrentUserId();
        List<String> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    /**
     * POST /api/favorites
     * Add a tool to the current user's favorites
     */
    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, String> request) {
        String toolName = request.get("toolName");
        
        if (toolName == null || toolName.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Tool name is required"));
        }

        String userId = getCurrentUserId();
        UserToolFavorite favorite = favoriteService.addFavorite(userId, toolName);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "Tool added to favorites",
                    "toolName", favorite.getToolName()
                ));
    }

    /**
     * DELETE /api/favorites/{toolName}
     * Remove a tool from the current user's favorites
     */
    @DeleteMapping("/{toolName}")
    public ResponseEntity<?> removeFavorite(@PathVariable String toolName) {
        String userId = getCurrentUserId();
        
        // Check if tool is in favorites before removing
        if (!favoriteService.isFavorite(userId, toolName)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tool not found in favorites"));
        }
        
        favoriteService.removeFavorite(userId, toolName);
        
        return ResponseEntity
                .ok()
                .body(Map.of("message", "Tool removed from favorites"));
    }

    /**
     * Helper method to get the current authenticated user's ID
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        Object principal = authentication.getPrincipal();
        
        // Check if principal is Spring Security's UserDetails
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            // Find your user by username to get ID
            return userRepository.findByUsername(username)
                   .orElseThrow(() -> new RuntimeException("User not found: " + username))
                   .getId();
        } 
        // Check if principal is a String (username)
        else if (principal instanceof String) {
            String username = (String) principal;
            return userRepository.findByUsername(username)
                   .orElseThrow(() -> new RuntimeException("User not found: " + username))
                   .getId();
        }
        
        // If neither case matches, use authentication.getName() as a fallback
        return userRepository.findByUsername(authentication.getName())
               .orElseThrow(() -> new RuntimeException("User not found: " + authentication.getName()))
               .getId();
    }
}