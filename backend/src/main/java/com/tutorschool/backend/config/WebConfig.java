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
        // ดึงที่อยู่ไฟล์แบบเต็ม (Absolute Path) จากเครื่องคอมพิวเตอร์ของคุณ
        Path uploadDir = Paths.get("uploads/profiles");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // ตั้งค่าให้เข้าถึงรูปภาพได้ โดยใช้ file: ตามด้วย Path เต็มของเครื่อง
        registry.addResourceHandler("/uploads/profiles/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}