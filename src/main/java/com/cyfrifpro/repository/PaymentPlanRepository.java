package com.cyfrifpro.repository;

import java.time.LocalDate;
//import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
//import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.ClientBudget;
import com.cyfrifpro.model.PaymentPlan;

@Repository
public interface PaymentPlanRepository extends JpaRepository<PaymentPlan, Long> {
	List<PaymentPlan> findByClientBudgetId(Long clientBudgetId);

	Optional<PaymentPlan> findByClientBudgetIdAndPhase(Long clientBudgetId, int phase);

	long countByClientBudget(ClientBudget clientBudget);

	List<PaymentPlan> findByPaidTrue();

	List<PaymentPlan> findByClientBudgetIdAndPaid(Long clientBudgetId, boolean paid);

//	 List<PaymentPlan> findByClientBudgetIdAndPaidFalse(Long clientBudgetId);
	Optional<PaymentPlan> findFirstByClientBudgetIdAndPaidFalseOrderByIdAsc(Long clientBudgetId);

	@Query("SELECT p.dueDate FROM PaymentPlan p WHERE p.clientBudget.client.id = :clientId AND p.paid = false ORDER BY p.dueDate ASC")
	List<LocalDate> findUnpaidDueDatesByClientId(@Param("clientId") Long clientId);

//	@Query("SELECT p.dueDate FROM PaymentPlan p WHERE p.clientBudget.client.id = :clientId AND p.paid = false ORDER BY p.dueDate DESC")
//    List<LocalDate> findEarliestUnpaidDueDateByClientId(@Param("clientId") Long clientId, Pageable pageable);

}
