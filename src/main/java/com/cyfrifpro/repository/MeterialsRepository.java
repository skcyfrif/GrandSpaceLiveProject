package com.cyfrifpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.Meterials;

@Repository
public interface MeterialsRepository extends JpaRepository<Meterials, Long> {

	List<Meterials> findByProjectId(Long projectId);	
}
