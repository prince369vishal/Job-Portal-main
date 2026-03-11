package com.getjob.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "org_type")
    private String orgType;

    @Column(name = "employee_count")
    private String employeeCount;

    @Column(name = "open_positions")
    private Integer openPositions = 0;

    @Column(columnDefinition = "TEXT")
    private String tags;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getOrgType() { return orgType; }
    public void setOrgType(String orgType) { this.orgType = orgType; }
    public String getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(String employeeCount) { this.employeeCount = employeeCount; }
    public Integer getOpenPositions() { return openPositions; }
    public void setOpenPositions(Integer openPositions) { this.openPositions = openPositions; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
