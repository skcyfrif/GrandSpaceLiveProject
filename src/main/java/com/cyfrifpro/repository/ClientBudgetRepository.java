package com.cyfrifpro.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cyfrifpro.model.ClientBudget;

public interface ClientBudgetRepository extends JpaRepository<ClientBudget, Long> {
	ClientBudget findByProjectId(Long projectId);

//	 Optional<ClientBudget> findByProjectId(Long projectId);
	boolean existsByProjectBudgetId(Long projectBudgetId);

	List<ClientBudget> findByProject_Client_Id(Long clientId);

	List<ClientBudget> findByClientId(Long clientId);

	@Query("SELECT cb.finalBudget FROM ClientBudget cb WHERE cb.client.id = :clientId")
	Optional<BigDecimal> findFinalBudgetByClientId(@Param("clientId") Long clientId);
}
