package com.getjob.repository;

import com.getjob.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByProfileId(Long profileId);
    @Modifying
    @Query("DELETE FROM Skill s WHERE s.profile.id = :profileId")
    void deleteByProfileId(Long profileId);
}
