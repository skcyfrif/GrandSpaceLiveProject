package com.cyfrifpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.Vendor;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {
    // Add custom query methods if needed
	List<Vendor> findByProjectId(Long projectId);
	List<Vendor> findByManagerId(Long managerId);

}
