package com.thegrind.backend.controller;

import com.thegrind.backend.model.User;
import com.thegrind.backend.repository.UserRepository;
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
    public String register(@RequestBody User user) {

        userRepository.saveUser(user);

        return "Registration successful";
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        try {

            User existingUser =
                    userRepository.findUserByEmail(user.getEmail());

            if (existingUser.getPassword().equals(user.getPassword())) {

                return existingUser;

            } else {

                return null;
            }

        } catch (Exception e) {

            return null;
        }
    }
  
}