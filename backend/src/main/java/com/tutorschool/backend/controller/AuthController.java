package com.tutorschool.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutorschool.backend.model.User;
import com.tutorschool.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Adjust this for your frontend URL in production
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Endpoint for "สมัครสมาชิก" (Registration)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        // Note: In a real application, you MUST hash the password before saving!
        // e.g., user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    // Endpoint for "เข้าสู่ระบบ" (Login)
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        // Find user by either username or email based on the frontend input
        Optional<User> userOptional = userRepository.findByUsernameOrEmail(
                loginRequest.getIdentifier(), 
                loginRequest.getIdentifier()
        );

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validate password (In production, use passwordEncoder.matches())
            if (user.getPassword().equals(loginRequest.getPassword())) {
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("message", "Login successful!");
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message", "Invalid password"));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message", "User not found"));
    }
}

// DTO for incoming login requests
class LoginRequest {
    private String identifier; // Maps to "ชื่อผู้ใช้ / อีเมล"
    private String password;   // Maps to "รหัสผ่าน"

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}