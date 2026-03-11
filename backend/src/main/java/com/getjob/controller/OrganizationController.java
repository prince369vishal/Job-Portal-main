package com.getjob.controller;

import com.getjob.dto.ApiResponse;
import com.getjob.entity.Organization;
import com.getjob.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllOrganizations() {
        List<Organization> orgs = organizationService.getAllOrganizations();
        return ResponseEntity.ok(ApiResponse.success(orgs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getOrganizationById(@PathVariable Long id) {
        try {
            Organization org = organizationService.getOrganizationById(id);
            return ResponseEntity.ok(ApiResponse.success(org));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
