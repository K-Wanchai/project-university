package com.tutorschool.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                
                // เปิดอนุญาตเส้นทางเหล่านี้ให้เข้าถึงได้โดยไม่ต้องล็อกอิน (เพื่อการทดสอบ)
                .requestMatchers("/api/auth/**", "/api/admin/**", "/api/courses/**", "/error").permitAll()
                
                .anyRequest().authenticated()
            );

        return http.build();
    }
}