package com.tutorschool.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutorschool.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Used for registration validation to ensure uniqueness
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Used for the login page which accepts either username or email
    Optional<User> findByUsernameOrEmail(String username, String email);
}