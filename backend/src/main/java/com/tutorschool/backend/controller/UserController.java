package com.tutorschool.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // นำเข้า FileStorageService
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tutorschool.backend.model.User;
import com.tutorschool.backend.repository.UserRepository;
import com.tutorschool.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService; // เรียกใช้งาน Service สำหรับจัดการไฟล์

    // 1. ดึงรายชื่อผู้ใช้ทั้งหมด (สำหรับหน้าตารางแอดมิน)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. ดึงข้อมูลผู้ใช้รายบุคคล (สำหรับกดปุ่มแก้ไข)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. เพิ่มผู้ใช้ใหม่โดย Admin
    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("username") String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam("status") String status,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        // เช็คว่า Username ซ้ำหรือไม่
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "ชื่อผู้ใช้นี้มีคนใช้แล้ว"));
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setPassword(password); // หมายเหตุ: ในระบบจริงควรเข้ารหัส (Hash) ก่อนเซฟ
        user.setPhoneNumber(phoneNumber);
        user.setEmail(email);
        user.setRole(role);
        user.setStatus(status);
        user.setRemarks(remarks);

        // จัดการเซฟไฟล์รูปภาพลงเครื่อง (ถ้ามีการแนบไฟล์มา)
        if (profileImage != null && !profileImage.isEmpty()) {
            String fileName = fileStorageService.storeFile(profileImage);
            user.setProfileImage(fileName); // เอาชื่อไฟล์ที่ได้ไปเก็บในฐานข้อมูล
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // 4. อัปเดตข้อมูลผู้ใช้ (แก้ไขข้อมูล/เปลี่ยนสถานะ)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("username") String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam("status") String status,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setUsername(username);
            
            // อัปเดตรหัสผ่าน เฉพาะกรณีที่ผู้ใช้กรอกรหัสผ่านใหม่เข้ามาเท่านั้น
            if (password != null && !password.isEmpty()) {
                user.setPassword(password);
            }
            
            user.setPhoneNumber(phoneNumber);
            user.setEmail(email);
            user.setRole(role);
            user.setStatus(status);
            user.setRemarks(remarks);

            // จัดการอัปเดตไฟล์รูปภาพใหม่ (ถ้ามีการแนบไฟล์มา)
            if (profileImage != null && !profileImage.isEmpty()) {
                String fileName = fileStorageService.storeFile(profileImage);
                user.setProfileImage(fileName); // เขียนทับชื่อรูปเดิม
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "อัปเดตข้อมูลสำเร็จ"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. ลบผู้ใช้
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "ลบผู้ใช้เรียบร้อยแล้ว"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. ดึงจำนวนผู้ใช้งานทั้งหมด (สำหรับหน้า Dashboard)
    @GetMapping("/count")
    public ResponseEntity<?> getUserCount() {
        long count = userRepository.count(); 
        return ResponseEntity.ok(Map.of("totalUsers", count));
    }
}