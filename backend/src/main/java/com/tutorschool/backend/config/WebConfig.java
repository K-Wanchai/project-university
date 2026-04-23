package com.tutorschool.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        // 1. อนุญาตให้เข้าถึงรูปโปรไฟล์ผู้ใช้งาน
        Path profileUploadDir = Paths.get("uploads/profiles");
        String profileUploadPath = profileUploadDir.toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/profiles/**")
                .addResourceLocations("file:" + profileUploadPath + "/");

        // 🌟 2. อนุญาตให้เข้าถึงรูปคอร์สเรียน (เพิ่มใหม่) 🌟
        Path courseUploadDir = Paths.get("uploads/courses");
        String courseUploadPath = courseUploadDir.toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/courses/**")
                .addResourceLocations("file:" + courseUploadPath + "/");
    }
}