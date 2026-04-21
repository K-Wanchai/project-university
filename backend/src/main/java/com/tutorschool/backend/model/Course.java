package com.tutorschool.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String courseName;      // ชื่อคอร์ส
    
    private String subject;         // วิชา
    private String gradeLevel;      // ระดับชั้น
    private String instructor;      // ผู้สอน
    private String status;          // สถานะ
    private LocalDate startDate;    // วันเริ่มสอน
    private Double price;           // ราคา
    private Integer hours;          // ชั่วโมงเรียน
    
    @Column(columnDefinition = "TEXT")
    private String description;     // คำอธิบายคอร์ส
    
    private String learningChannel; // ช่องทางการเรียน
    private String imageUrl;        // ภาพประกอบ

    // Constructors
    public Course() {}

    // ================= Getters and Setters =================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getHours() { return hours; }
    public void setHours(Integer hours) { this.hours = hours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLearningChannel() { return learningChannel; }
    public void setLearningChannel(String learningChannel) { this.learningChannel = learningChannel; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}