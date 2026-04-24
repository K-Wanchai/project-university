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

                // 🌟 เพิ่ม "/uploads/courses/**" เพื่ออนุญาตให้โหลดรูปภาพคอร์สได้
                .requestMatchers(
                    "/api/auth/**", 
                    "/api/admin/**", 
                    "/api/courses/**", 
                    "/api/examinations/**",
                    "/error",
                    "/uploads/profiles/**",   // รูปผู้ใช้งาน
                    "/uploads/courses/**"     // 🌟 รูปคอร์สเรียน
                ).permitAll()
                
                .anyRequest().authenticated()
            );

        return http.build();
    }
}