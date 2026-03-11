package com.getjob.service;

import com.getjob.dto.LoginRequest;
import com.getjob.dto.SignupRequest;
import com.getjob.entity.User;
import com.getjob.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(hashPassword(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", mapUserToResponse(user));
        response.put("token", "mock-jwt-token-" + user.getId());
        return response;
    }

    public Map<String, Object> signin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!verifyPassword(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("user", mapUserToResponse(user));
        response.put("token", "mock-jwt-token-" + user.getId());
        return response;
    }

    private String hashPassword(String password) {
        return "hashed_" + password;
    }

    private boolean verifyPassword(String raw, String hashed) {
        return ("hashed_" + raw).equals(hashed);
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("email", user.getEmail());
        map.put("firstName", user.getFirstName());
        map.put("lastName", user.getLastName());
        return map;
    }
}
