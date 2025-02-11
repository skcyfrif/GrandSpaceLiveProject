package com.cyfrifpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cyfrifpro.model.ProjectRedesign;

public interface ProjectRedesignRepository extends JpaRepository<ProjectRedesign, Long> {
	List<ProjectRedesign> findByProjectId(Long projectId);
}
