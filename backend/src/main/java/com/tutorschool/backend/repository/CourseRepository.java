package com.tutorschool.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutorschool.backend.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Spring Boot จัดการคำสั่ง SQL เบื้องต้นอัตโนมัติ
}