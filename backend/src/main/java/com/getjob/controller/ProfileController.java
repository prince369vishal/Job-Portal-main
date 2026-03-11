package com.getjob.controller;

import com.getjob.dto.ApiResponse;
import com.getjob.entity.Education;
import com.getjob.entity.Experience;
import com.getjob.entity.Profile;
import com.getjob.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getProfileByUserId(@PathVariable Long userId) {
        try {
            Profile profile = profileService.getProfileByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/user/{userId}/basic")
    public ResponseEntity<ApiResponse<?>> createOrUpdateBasicInfo(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> data) {
        try {
            Profile profile = profileService.createOrUpdateBasicInfo(userId, data);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{profileId}/education")
    public ResponseEntity<ApiResponse<?>> addEducation(
            @PathVariable Long profileId,
            @RequestBody Map<String, Object> data) {
        try {
            Education education = profileService.addEducation(profileId, data);
            return ResponseEntity.ok(ApiResponse.success(education));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{profileId}/experience")
    public ResponseEntity<ApiResponse<?>> addExperience(
            @PathVariable Long profileId,
            @RequestBody Map<String, Object> data) {
        try {
            Experience experience = profileService.addExperience(profileId, data);
            return ResponseEntity.ok(ApiResponse.success(experience));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{profileId}/skills")
    public ResponseEntity<ApiResponse<?>> updateSkills(
            @PathVariable Long profileId,
            @RequestBody Map<String, Object> data) {
        try {
            profileService.updateSkills(profileId, data);
            return ResponseEntity.ok(ApiResponse.success("Skills updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
