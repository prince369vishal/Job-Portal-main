package com.getjob.service;

import com.getjob.entity.*;
import com.getjob.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository,
                          EducationRepository educationRepository, ExperienceRepository experienceRepository,
                          SkillRepository skillRepository, CertificationRepository certificationRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
    }

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Transactional
    public Profile createOrUpdateBasicInfo(Long userId, Map<String, Object> data) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Profile profile = profileRepository.findByUserId(userId).orElse(new Profile());
        profile.setUser(user);
        profile.setHeadline((String) data.get("headline"));
        profile.setBio((String) data.get("bio"));
        profile.setPhone((String) data.get("phone"));
        profile.setLocation((String) data.get("location"));
        profile.setWebsite((String) data.get("website"));
        profile.setPhotoUrl((String) data.get("photoUrl"));
        return profileRepository.save(profile);
    }

    @Transactional
    public Education addEducation(Long profileId, Map<String, Object> data) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        Education edu = new Education();
        edu.setProfile(profile);
        edu.setInstitution((String) data.get("institution"));
        edu.setDegree((String) data.get("degree"));
        edu.setFieldOfStudy((String) data.get("fieldOfStudy"));
        edu.setAchievements((String) data.get("achievements"));
        edu.setIsCurrentlyStudying((Boolean) data.getOrDefault("currentlyStudying", false));
        if (data.get("startDate") != null && !((String) data.get("startDate")).isEmpty()) {
            edu.setStartDate(LocalDate.parse(((String) data.get("startDate")) + "-01"));
        }
        if (data.get("endDate") != null && !((String) data.get("endDate")).isEmpty()) {
            edu.setEndDate(LocalDate.parse(((String) data.get("endDate")) + "-01"));
        }
        return educationRepository.save(edu);
    }

    @Transactional
    public Experience addExperience(Long profileId, Map<String, Object> data) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        Experience exp = new Experience();
        exp.setProfile(profile);
        exp.setCompany((String) data.get("company"));
        exp.setPosition((String) data.get("position"));
        exp.setEmploymentType((String) data.get("employmentType"));
        exp.setLocation((String) data.get("location"));
        exp.setResponsibilities((String) data.get("responsibilities"));
        exp.setTechnologies((String) data.get("technologies"));
        exp.setIsCurrentlyWorking((Boolean) data.getOrDefault("currentlyWorking", false));
        if (data.get("startDate") != null && !((String) data.get("startDate")).isEmpty()) {
            exp.setStartDate(LocalDate.parse(((String) data.get("startDate")) + "-01"));
        }
        if (data.get("endDate") != null && !((String) data.get("endDate")).isEmpty()) {
            exp.setEndDate(LocalDate.parse(((String) data.get("endDate")) + "-01"));
        }
        return experienceRepository.save(exp);
    }

    @Transactional
    public void updateSkills(Long profileId, Map<String, Object> data) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        skillRepository.deleteByProfileId(profileId);

        @SuppressWarnings("unchecked")
        List<String> technical = (List<String>) data.getOrDefault("technical", List.of());
        technical.forEach(name -> {
            Skill s = new Skill();
            s.setProfile(profile);
            s.setSkillType("TECHNICAL");
            s.setName(name);
            skillRepository.save(s);
        });

        @SuppressWarnings("unchecked")
        List<String> soft = (List<String>) data.getOrDefault("soft", List.of());
        soft.forEach(name -> {
            Skill s = new Skill();
            s.setProfile(profile);
            s.setSkillType("SOFT");
            s.setName(name);
            skillRepository.save(s);
        });

        @SuppressWarnings("unchecked")
        List<Map<String, String>> languages = (List<Map<String, String>>) data.getOrDefault("languages", List.of());
        languages.forEach(lang -> {
            Skill s = new Skill();
            s.setProfile(profile);
            s.setSkillType("LANGUAGE");
            s.setName(lang.get("language"));
            s.setProficiency(lang.get("proficiency"));
            skillRepository.save(s);
        });

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> certs = (List<Map<String, Object>>) data.getOrDefault("certifications", List.of());
        certs.forEach(cert -> {
            Certification c = new Certification();
            c.setProfile(profile);
            c.setName((String) cert.get("name"));
            c.setIssuingOrganization((String) cert.get("organization"));
            if (cert.get("date") != null && !((String) cert.get("date")).isEmpty()) {
                c.setIssueDate(LocalDate.parse(((String) cert.get("date")) + "-01"));
            }
            c.setCredentialId((String) cert.get("credentialId"));
            certificationRepository.save(c);
        });
    }
}
