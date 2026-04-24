package com.tutorschool.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. ข้อมูลส่วนตัว (Personal Info)
    private String firstName;      // ชื่อ
    private String lastName;       // นามสกุล
    private String nationalId;     // เลขบัตรประจำตัวประชาชน
    private LocalDate dateOfBirth; // วัน/เดือน/ปีเกิด
    private String gender;         // เพศ (ชาย, หญิง)
    private String role;           // บทบาท (คุณครู, แอดมิน, เจ้าหน้าที่, นักเรียน)
    private String gradeLevel;     // ระดับชั้น
    private String profileImage;   // รูปโปรไฟล์

    // 2. ข้อมูลการติดต่อ (Contact Info)
    private String phoneNumber;    // เบอร์โทรศัพท์
    
    @Column(unique = true)
    private String email;          // อีเมล
    
    private String address;        // ที่อยู่

    // 3. ข้อมูลบัญชีผู้ใช้ (Account Info)
    @Column(unique = true)
    private String username;       // ชื่อผู้ใช้
    private String password;       // รหัสผ่าน

    // 4. ข้อมูลสำหรับแอดมินจัดการ (Admin Info)
    private String status;         // สถานะ (เช่น ใช้งานอยู่, ปิดใช้งาน, รอตรวจสอบ)
    
    @Column(columnDefinition = "TEXT")
    private String remarks;        // บันทึกเพิ่มเติม

    // 🌟 ระบบเก็บเวลาอัตโนมัติ
    @CreationTimestamp
    private LocalDateTime createdAt;

    // Constructors
    public User() {}

    // ================= Getters and Setters =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    // 🌟 Getter/Setter สำหรับเวลาที่สร้าง
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}