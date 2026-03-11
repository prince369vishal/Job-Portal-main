package com.getjob.repository;

import com.getjob.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByOrganizationId(Long organizationId);
    List<Job> findByIsFeaturedTrue();
}
