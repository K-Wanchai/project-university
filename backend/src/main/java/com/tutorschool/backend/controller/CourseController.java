package com.tutorschool.backend.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tutorschool.backend.model.Course;
import com.tutorschool.backend.repository.CourseRepository;

@RestController
// 🌟 แก้ไข URL ให้มีคำว่า admin ตรงกับที่ React เรียกหา (แก้บั๊ก CORS/404)
@RequestMapping("/api/admin/courses") 
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // 1. ดึงข้อมูลคอร์สทั้งหมด
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 2. ดึงข้อมูลคอร์สเดี่ยวๆ
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. เพิ่มคอร์สใหม่ (รองรับรูปภาพ)
    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestParam("courseName") String courseName,
            @RequestParam("subject") String subject,
            @RequestParam("instructor") String instructor,
            @RequestParam("learningChannel") String learningChannel,
            @RequestParam("startDate") String startDate,
            @RequestParam("hours") Integer hours,
            @RequestParam("price") Double price,
            @RequestParam("status") String status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "courseImage", required = false) MultipartFile file) {

        try {
            Course course = new Course();
            course.setCourseName(courseName);
            course.setSubject(subject);
            course.setInstructor(instructor);
            course.setLearningChannel(learningChannel);
        
        // เช็คว่ามีค่าส่งมาไหม ถ้ามีให้แปลง String เป็น LocalDate 🌟
        if (startDate != null && !startDate.isEmpty()) {
            course.setStartDate(LocalDate.parse(startDate));
        }

            course.setHours(hours);
            course.setPrice(price);
            course.setStatus(status);
            course.setDescription(description);

            // 🌟 จัดการเก็บไฟล์รูปภาพ 🌟
            if (file != null && !file.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/courses"); // แยกโฟลเดอร์เก็บคอร์ส

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(inputStream, uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                    course.setImageUrl(fileName); // เก็บชื่อไฟล์ลง DB
                }
            }

            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.ok(savedCourse);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    // 4. แก้ไขข้อมูลคอร์สเรียน
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestParam("courseName") String courseName,
            @RequestParam("subject") String subject,
            @RequestParam("instructor") String instructor,
            @RequestParam("learningChannel") String learningChannel,
            @RequestParam("startDate") String startDate,
            @RequestParam("hours") Integer hours,
            @RequestParam("price") Double price,
            @RequestParam("status") String status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "courseImage", required = false) MultipartFile file) {

        Optional<Course> courseOptional = courseRepository.findById(id);
        
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            course.setCourseName(courseName);
            course.setSubject(subject);
            course.setInstructor(instructor);
            course.setLearningChannel(learningChannel);
            
            if (startDate != null && !startDate.isEmpty()) {
                course.setStartDate(LocalDate.parse(startDate));
            }
            
            course.setHours(hours);
            course.setPrice(price);
            course.setStatus(status);
            course.setDescription(description);

            // 🌟 เช็คว่ามีการส่งไฟล์รูปใหม่มาเปลี่ยนหรือไม่ 🌟
            if (file != null && !file.isEmpty()) {
                try {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path uploadPath = Paths.get("uploads/courses"); 

                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    try (InputStream inputStream = file.getInputStream()) {
                        Files.copy(inputStream, uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                        course.setImageUrl(fileName); // อัปเดตชื่อไฟล์ลง DB
                    }
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
                }
            }
            
            Course updatedCourse = courseRepository.save(course);
            return ResponseEntity.ok(Map.of("message", "แก้ไขข้อมูลคอร์สเรียนสำเร็จ!"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. ลบคอร์ส
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "ลบคอร์สเรียนเรียบร้อยแล้ว"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}