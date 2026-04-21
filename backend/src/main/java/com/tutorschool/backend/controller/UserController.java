package com.tutorschool.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutorschool.backend.model.User;
import com.tutorschool.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class UserController {


    @Autowired
    private UserRepository userRepository;

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
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "ชื่อผู้ใช้นี้มีคนใช้แล้ว"));
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // 4. อัปเดตข้อมูลผู้ใช้ (แก้ไขข้อมูล/เปลี่ยนสถานะ)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setNationalId(userDetails.getNationalId()); // อัปเดตเลขบัตรประชาชน
            user.setRole(userDetails.getRole());
            user.setStatus(userDetails.getStatus());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setEmail(userDetails.getEmail());
            user.setRemarks(userDetails.getRemarks());
            
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
        // userRepository.count() คือคำสั่งนับจำนวนแถวทั้งหมดในตาราง users
        long count = userRepository.count(); 
        
        // ส่งกลับไปเป็น JSON รูปแบบ {"totalUsers": จำนวนจริง}
        return ResponseEntity.ok(Map.of("totalUsers", count));
    }
}