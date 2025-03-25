package com.example.it_tools.security;

import ch.qos.logback.classic.Logger;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.LoggerFactory;
@Component
public class JwtUtil {
    private static final Logger logger = (Logger) LoggerFactory.getLogger(JwtUtil.class);
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    // ✅ Tạo token JWT với roles
    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles); // ✅ Thêm roles vào claims

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // ✅ Trích xuất username từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ✅ Trích xuất expiration time từ token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ✅ Trích xuất roles từ token
    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    // ✅ Hàm trích xuất claims chung
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ✅ Giải mã JWT và lấy toàn bộ claims
    Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Kiểm tra token có hết hạn chưa
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Kiểm tra token có hợp lệ với user không
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String extractedUsername = extractUsername(token);

        // 🔍 Log để kiểm tra giá trị
        System.out.println("Roles từ token: " + extractRoles(token));
        System.out.println("Token hợp lệ? " + (extractedUsername.equals(userDetails.getUsername()) && !isTokenExpired(token)));
        return extractedUsername.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
