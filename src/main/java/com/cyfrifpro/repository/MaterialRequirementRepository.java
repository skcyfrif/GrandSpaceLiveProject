package com.cyfrifpro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.MaterialRequirement;

@Repository
public interface MaterialRequirementRepository extends JpaRepository<MaterialRequirement, Long> {
	// Add custom query methods if needed
//	@Modifying
//	@Query("UPDATE MaterialRequirement m SET m.status = :status WHERE m.id = :id")
//	void updateStatus(@Param("id") Long id, @Param("status") String status);

}
