package com.eqly.eqly_backend.user.controller;

import com.eqly.eqly_backend.user.entity.User;
import com.eqly.eqly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    // register new user
    @PostMapping
    public ResponseEntity<User> registerUser(@RequestBody User user){
        log.info("REST: Register user request for email: {}", user.getEmail());

        User createdUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // get user by id
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId){
        log.info("REST: Get user by ID: {}", userId);

        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email){
        log.info("REST: Get user by email: {}", email);

        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("REST: Get all users");

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {
        log.info("REST: Update user with ID: {}", id);

        User updatedUser = userService.updateUser(id, user);

        return ResponseEntity.ok(updatedUser);
    }

    // delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("REST: Delete user with ID: {}", id);

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}
