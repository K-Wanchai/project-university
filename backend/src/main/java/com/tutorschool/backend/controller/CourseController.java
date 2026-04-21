package com.tutorschool.backend.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutorschool.backend.model.Course;
import com.tutorschool.backend.repository.CourseRepository;

@RestController
@RequestMapping("/api/courses")
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

    // 3. เพิ่มคอร์สใหม่
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    // 4. แก้ไขข้อมูลคอร์สเรียน
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            course.setCourseName(courseDetails.getCourseName());
            course.setSubject(courseDetails.getSubject());
            course.setGradeLevel(courseDetails.getGradeLevel());
            course.setInstructor(courseDetails.getInstructor());
            course.setStatus(courseDetails.getStatus());
            course.setStartDate(courseDetails.getStartDate());
            course.setPrice(courseDetails.getPrice());
            course.setHours(courseDetails.getHours());
            course.setDescription(courseDetails.getDescription());
            course.setLearningChannel(courseDetails.getLearningChannel());
            course.setImageUrl(courseDetails.getImageUrl());
            
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