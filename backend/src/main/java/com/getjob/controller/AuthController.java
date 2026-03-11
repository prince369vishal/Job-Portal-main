package com.getjob.controller;

import com.getjob.dto.ApiResponse;
import com.getjob.dto.LoginRequest;
import com.getjob.dto.SignupRequest;
import com.getjob.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<?>> signup(@Valid @RequestBody SignupRequest request) {
        try {
            var result = authService.signup(request);
            return ResponseEntity.ok(ApiResponse.success("Account created successfully", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<?>> signin(@Valid @RequestBody LoginRequest request) {
        try {
            var result = authService.signin(request);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
