package com.tutorschool.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path profileUploadDir = Paths.get("uploads/profiles");
        registry.addResourceHandler("/uploads/profiles/**")
                .addResourceLocations("file:" + profileUploadDir.toFile().getAbsolutePath() + "/");

        Path courseUploadDir = Paths.get("uploads/courses");
        registry.addResourceHandler("/uploads/courses/**")
                .addResourceLocations("file:" + courseUploadDir.toFile().getAbsolutePath() + "/");

        Path examUploadDir = Paths.get("uploads/examinations");
        registry.addResourceHandler("/uploads/examinations/**")
                .addResourceLocations("file:" + examUploadDir.toFile().getAbsolutePath() + "/");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
    
}