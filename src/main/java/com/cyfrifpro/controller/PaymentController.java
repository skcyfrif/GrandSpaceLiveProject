package com.cyfrifpro.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.PaymentPlan;
//import com.cyfrifpro.repository.ClientBudgetRepository;
import com.cyfrifpro.repository.PaymentPlanRepository;
import com.cyfrifpro.service.PaymentPlanService;

@RestController
@RequestMapping("/api/payment")
//@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PaymentController {

	@Autowired
	private PaymentPlanService paymentPlanService;

	@Autowired
	private PaymentPlanRepository paymentPlanRepository;

//	@Autowired
//	private ClientBudgetRepository clientBudgetRepository;

	@PostMapping("/generate-plan/{clientBudgetId}")
	public ResponseEntity<String> generatePaymentPlan(@PathVariable Long clientBudgetId) {
		try {
			paymentPlanService.generatePaymentPlan(clientBudgetId);
			return ResponseEntity.ok("Payment plan generated successfully for ClientBudget ID: " + clientBudgetId);
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/getAll")
	public List<PaymentPlan> getAllPaymentPlans() {
		return paymentPlanService.getAllPaymentPlans();
	}

	@GetMapping("/paid")
	public List<PaymentPlan> getPaidPaymentPlans() {
		return paymentPlanService.getPaidPaymentPlans();
	}

	@PutMapping("/pay/{clientBudgetId}/{phase}")
	public String payForPhase(@PathVariable Long clientBudgetId, @PathVariable int phase) {
		// Fetch the PaymentPlan based on clientBudgetId and phase
		PaymentPlan paymentPlan = paymentPlanRepository.findByClientBudgetIdAndPhase(clientBudgetId, phase).orElseThrow(
				() -> new RuntimeException("PaymentPlan not found for the given clientBudgetId and phase"));

		// Check if the payment for this phase has already been made
		if (paymentPlan.isPaid()) {
			return "Payment for phase " + phase + " has already been made.";
		}

		// Mark the payment as done
		paymentPlan.setPaid(true);

		// Save the updated PaymentPlan
		paymentPlanRepository.save(paymentPlan);

		return "Payment for phase " + phase + " is successful.";
	}

	// ✅ Get Unpaid Balance by Client ID
	@GetMapping("/unpaid-balance/{clientId}")
	public ResponseEntity<BigDecimal> getUnpaidBalance(@PathVariable Long clientId) {
		BigDecimal unpaidBalance = paymentPlanService.getUnpaidBalanceByClientId(clientId);
		return ResponseEntity.ok(unpaidBalance);
	}

	// ✅ API to get total paid balance by clientId
	@GetMapping("/paid-balance/{clientId}")
	public ResponseEntity<BigDecimal> getTotalPaidBalance(@PathVariable Long clientId) {
		BigDecimal totalPaidBalance = paymentPlanService.getTotalPaidBalance(clientId);
		return ResponseEntity.ok(totalPaidBalance);
	}

	@GetMapping("/unpaid-duedates/{clientId}")
	public ResponseEntity<List<LocalDate>> getAllUnpaidDueDates(@PathVariable Long clientId) {
	    List<LocalDate> unpaidDueDates = paymentPlanService.getAllUnpaidDueDates(clientId);
	    return unpaidDueDates.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(unpaidDueDates);
	}
	
//	@GetMapping("/earliest-unpaid-due-date/{clientId}")
//    public ResponseEntity<LocalDate> getEarliestUnpaidDueDate(@PathVariable Long clientId) {
//        LocalDate earliestDueDate = paymentPlanService.getEarliestUnpaidDueDate(clientId);
//        return earliestDueDate != null ? ResponseEntity.ok(earliestDueDate) : ResponseEntity.noContent().build();
//    }
	
	@GetMapping("/by-client/{clientId}")
	public ResponseEntity<List<PaymentPlan>> getPaymentPlansByClientId(@PathVariable Long clientId) {
		List<PaymentPlan> paymentPlans = paymentPlanService.getPaymentPlansByClientId(clientId);
		return ResponseEntity.ok(paymentPlans);
	}

	@GetMapping("/payment-plans/{clientBudgetId}")
	public List<PaymentPlan> getPaymentPlans(@PathVariable Long clientBudgetId) {
		// Fetch all payment plans for the given client budget
		return paymentPlanRepository.findByClientBudgetId(clientBudgetId);
	}
	
	@GetMapping("/final-budget/{clientBudgetId}")
	public BigDecimal getFinalBudget(@PathVariable Long clientBudgetId) {
		// Call the service to get the final budget
		return paymentPlanService.getFinalBudget(clientBudgetId);
	}

	@GetMapping("/total-paid/{clientBudgetId}")
	public BigDecimal getTotalPaidAmount(@PathVariable Long clientBudgetId) {
		// Call the service to get the total paid amount for the client budget
		return paymentPlanService.getTotalPaidAmount(clientBudgetId);
	}

	@GetMapping("/paid-phases/{clientBudgetId}")
	public long countPaidPhases(@PathVariable Long clientBudgetId) {
		// Call the service to count the paid phases for the client budget
		return paymentPlanService.countPaidPhases(clientBudgetId);
	}

	@GetMapping("/remaining-amount/{clientBudgetId}")
	public BigDecimal getRemainingAmount(@PathVariable Long clientBudgetId) {
		// Call the service to get the remaining amount for the client budget
		return paymentPlanService.getRemainingAmount(clientBudgetId);
	}

	// Endpoint to get the total final budget of all existing client budgets
	@GetMapping("/total-final-budget")
	public BigDecimal getTotalFinalBudget() {
		// Call the service method to get the total final budget
		return paymentPlanService.getTotalFinalBudget();
	}

	// Endpoint to get the total paid amount of all projects
	@GetMapping("/total-paid-amount")
	public BigDecimal getTotalPaidAmount() {
		// Call the service method to get the total paid amount for all projects
		return paymentPlanService.getTotalPaidAmountForAllProjects();
	}

	// Endpoint to get the total amount to be paid for all projects
	@GetMapping("/total-amount-to-be-paid")
	public BigDecimal getTotalAmountToBePaid() {
		// Call the service method to get the total amount to be paid for all projects
		return paymentPlanService.getTotalAmountToBePaidForAllProjects();
	}

}
