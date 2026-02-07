package com.eqly.eqly_backend.user.repository;

import com.eqly.eqly_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods (Spring generates SQL automatically!)
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
