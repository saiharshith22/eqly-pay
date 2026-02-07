package com.eqly.eqly_backend.user.service;

import com.eqly.eqly_backend.exception.EmailAlreadyExistsException;
import com.eqly.eqly_backend.exception.ResourceNotFoundException;
import com.eqly.eqly_backend.user.entity.User;
import com.eqly.eqly_backend.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    /**
     * Register a new user
     * @param user User object with registration details
     * @return Saved user
     * @throws IllegalArgumentException if email already exists
     */
    @Transactional
    public User registerUser(User user){
        log.info("Attempting to register user with email: {}", user.getEmail());

        if(userRepository.existsByEmail(user.getEmail())){
            log.warn("Registration failed: Email {} already exists", user.getEmail());
            throw new EmailAlreadyExistsException(user.getEmail());
        }

        // validate user
        validateUser(user);

        // save user
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
    /**
     * Validate user data
     * @param user User to validate
     */
    private void validateUser(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        // Basic email format validation
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    // get user by id
    /**
     * Find user by ID
     * @param id User ID
     * @return User if found
     * @throws IllegalArgumentException if user not found
     */
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        log.debug("Fetching user with ID: {}", id);

        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    // get user by email

    // update user
    @Transactional
    public User updateUser(Long id, User updatedUser) {
        log.info("Updating user with ID: {}", id);

        User existingUser = getUserById(id);

        // Update fields (only non-null values)
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getUpiId() != null) {
            existingUser.setUpiId(updatedUser.getUpiId());
        }

        // Email update requires uniqueness check
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new EmailAlreadyExistsException(updatedUser.getEmail());
            }
            existingUser.setEmail(updatedUser.getEmail());
        }

        User saved = userRepository.save(existingUser);
        log.info("User updated successfully: {}", saved.getId());

        return saved;
    }


    // delete user
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }

        userRepository.deleteById(id);
        log.info("User deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        log.debug("Fetching user with email: {}", email);
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        log.debug("Fetching all users");
        return userRepository.findAll();
    }
}
