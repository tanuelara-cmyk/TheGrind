package com.thegrind.backend.controller;

import com.thegrind.backend.model.User;
import com.thegrind.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            userRepository.saveUser(user);

            return ResponseEntity.ok(user);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {

            User existingUser =
                    userRepository.findUserByEmail(user.getEmail());

            if (existingUser == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not found");
            }

            if (existingUser.getPassword().equals(user.getPassword())) {

                return ResponseEntity.ok(existingUser);

            } else {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid password");
            }

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}