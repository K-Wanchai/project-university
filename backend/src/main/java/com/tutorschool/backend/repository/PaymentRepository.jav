package com.tutorschool.backend.repository;

import com.tutorschool.backend.model.Payment;
import org.springframework.data.jpa.repository.jpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{
     List<Payment> findAllByOrderByCreatedAtDesc();

     List<Payment> findByStatusOrderByCreatedAtDesc(String status);
    
}



