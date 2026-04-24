package com.tutorschool.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tutorschool.backend.model.Examination;

public interface ExaminationRepository extends JpaRepository<Examination, Long> {
}