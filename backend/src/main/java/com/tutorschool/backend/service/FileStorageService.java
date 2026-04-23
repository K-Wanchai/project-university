package com.tutorschool.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // กำหนดที่อยู่โฟลเดอร์ที่จะเก็บไฟล์ (มันจะสร้างโฟลเดอร์ uploads/profiles ให้อัตโนมัติ)
    private final Path fileStorageLocation = Paths.get("uploads/profiles").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("ไม่สามารถสร้างโฟลเดอร์สำหรับเก็บไฟล์รูปภาพได้", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // ดึงชื่อไฟล์เดิมและนามสกุลไฟล์ (.jpg, .png)
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // สุ่มชื่อไฟล์ใหม่ด้วย UUID เพื่อป้องกันไฟล์ชื่อซ้ำกัน
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // กำหนด Path ที่จะนำไฟล์ไปวาง
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

            // บันทึกไฟล์ลงเครื่อง
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFileName; // คืนค่า "ชื่อไฟล์" เพื่อนำไปบันทึกใน Database
            
        } catch (IOException ex) {
            throw new RuntimeException("ไม่สามารถบันทึกไฟล์ " + file.getOriginalFilename() + " ได้ กรุณาลองใหม่อีกครั้ง", ex);
        }
    }
}