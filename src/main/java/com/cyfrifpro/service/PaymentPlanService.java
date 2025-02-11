package com.cyfrifpro.service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.ClientBudget;
import com.cyfrifpro.model.PaymentPlan;
import com.cyfrifpro.repository.ClientBudgetRepository;
import com.cyfrifpro.repository.PaymentPlanRepository;

@Service
public class PaymentPlanService {

	@Autowired
	private PaymentPlanRepository paymentPlanRepository;

	@Autowired
	private ClientBudgetRepository clientBudgetRepository;

	public void generatePaymentPlan(Long clientBudgetId) {
		// Fetch the ClientBudget by its ID from the repository
		ClientBudget clientBudget = clientBudgetRepository.findById(clientBudgetId)
				.orElseThrow(() -> new IllegalArgumentException("ClientBudget not found with ID: " + clientBudgetId));

		// Check if there are already 5 payment plans for the client budget
		long existingPaymentPlansCount = paymentPlanRepository.countByClientBudget(clientBudget);
		if (existingPaymentPlansCount >= 5) {
			throw new IllegalStateException("Payment plans have already been generated 5 times for this ClientBudget.");
		}

		// Get the final budget from the client budget
		BigDecimal finalBudget = clientBudget.getFinalBudget();

		// Calculate the phase amount by dividing the final budget by 5 for 5 phases
		BigDecimal phaseAmount = finalBudget.divide(BigDecimal.valueOf(5), 2, BigDecimal.ROUND_HALF_UP);

		// Set the start date for payment (can be modified to a specific date if needed)
		LocalDate startDate = LocalDate.now();

		// Create a list to store the payment plans for each phase
		List<PaymentPlan> paymentPlans = new ArrayList<>();

		// Loop through and create 5 payment plans, one for each phase
		for (int i = 1; i <= 5; i++) {
			PaymentPlan paymentPlan = new PaymentPlan();
			paymentPlan.setClientBudget(clientBudget);
			paymentPlan.setPhase(i);
			paymentPlan.setAmountDue(phaseAmount);
			paymentPlan.setDueDate(startDate.plusMonths(i)); // Set due date to be one month later for each phase
			paymentPlan.setPaid(false); // Mark as not paid initially

			paymentPlans.add(paymentPlan);
		}

		// Save all the generated payment plans to the database
		paymentPlanRepository.saveAll(paymentPlans);
	}

	public BigDecimal getUnpaidBalanceByClientId(Long clientId) {
		// Fetch all ClientBudgets for the given client ID
		List<ClientBudget> clientBudgets = clientBudgetRepository.findByClientId(clientId);

		if (clientBudgets.isEmpty()) {
			throw new RuntimeException("No client budget found for the given client ID: " + clientId);
		}

		// Initialize the unpaid balance
		BigDecimal unpaidBalance = BigDecimal.ZERO;

		// Loop through each ClientBudget and fetch unpaid payment plans
		for (ClientBudget clientBudget : clientBudgets) {
			List<PaymentPlan> unpaidPayments = paymentPlanRepository.findByClientBudgetIdAndPaid(clientBudget.getId(),
					false);

			// Sum up the amountDue for all unpaid payments
			for (PaymentPlan paymentPlan : unpaidPayments) {
				unpaidBalance = unpaidBalance.add(paymentPlan.getAmountDue());
			}
		}

		return unpaidBalance;
	}

	// ✅ Method to calculate the total paid balance by clientId
	public BigDecimal getTotalPaidBalance(Long clientId) {
		// Fetch all ClientBudgets associated with the given client ID
		List<ClientBudget> clientBudgets = clientBudgetRepository.findByClientId(clientId);

		BigDecimal totalPaidBalance = BigDecimal.ZERO; // Initialize total paid balance

		// Loop through each client budget and calculate the total paid balance
		for (ClientBudget clientBudget : clientBudgets) {
			List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudget.getId());

			for (PaymentPlan paymentPlan : paymentPlans) {
				if (paymentPlan.isPaid()) {
					totalPaidBalance = totalPaidBalance.add(paymentPlan.getAmountDue());
				}
			}
		}
		return totalPaidBalance;
	}

	public List<LocalDate> getAllUnpaidDueDates(Long clientId) {
		return paymentPlanRepository.findUnpaidDueDatesByClientId(clientId);
	}
	
//	public LocalDate getEarliestUnpaidDueDate(Long clientId) {
//        Pageable limit = PageRequest.of(0, 1); // Fetch only 1 result
//        List<LocalDate> dates = paymentPlanRepository.findEarliestUnpaidDueDateByClientId(clientId, limit);
//        return dates.isEmpty() ? null : dates.get(0); // Return first due date or null
//    }

	public List<PaymentPlan> getPaidPaymentPlans() {
		return paymentPlanRepository.findByPaidTrue();
	}

	public List<PaymentPlan> getPaymentPlansByClientId(Long clientId) {
		// Fetch all ClientBudgets for the given client ID
		List<ClientBudget> clientBudgets = clientBudgetRepository.findByClientId(clientId);

		// Initialize an empty list to store payment plans
		List<PaymentPlan> paymentPlans = new ArrayList<>();

		// For each ClientBudget, fetch its payment plans and add to the list
		for (ClientBudget clientBudget : clientBudgets) {
			paymentPlans.addAll(paymentPlanRepository.findByClientBudgetId(clientBudget.getId()));
		}

		return paymentPlans;
	}

	public BigDecimal getFinalBudget(Long clientBudgetId) {
		// Fetch the ClientBudget by its ID
		ClientBudget clientBudget = clientBudgetRepository.findById(clientBudgetId)
				.orElseThrow(() -> new RuntimeException("ClientBudget not found"));

		// Return the final budget associated with the ClientBudget
		return clientBudget.getFinalBudget();
	}

	public BigDecimal getTotalPaidAmount(Long clientBudgetId) {
		// Fetch the ClientBudget by its ID
		ClientBudget clientBudget = clientBudgetRepository.findById(clientBudgetId)
				.orElseThrow(() -> new RuntimeException("ClientBudget not found"));

		// Fetch all payment plans for the given ClientBudget
		List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudgetId);

		// Calculate the total paid amount
		BigDecimal totalPaidAmount = BigDecimal.ZERO;

		for (PaymentPlan paymentPlan : paymentPlans) {
			if (paymentPlan.isPaid()) {
				totalPaidAmount = totalPaidAmount.add(paymentPlan.getAmountDue());
			}
		}

		return totalPaidAmount;
	}

	public long countPaidPhases(Long clientBudgetId) {
		// Fetch the ClientBudget by its ID
		ClientBudget clientBudget = clientBudgetRepository.findById(clientBudgetId)
				.orElseThrow(() -> new RuntimeException("ClientBudget not found"));

		// Fetch all payment plans for the given ClientBudget
		List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudgetId);

		// Count the number of paid phases
		long paidPhasesCount = paymentPlans.stream().filter(PaymentPlan::isPaid) // Filter only the phases that are paid
				.count(); // Count the number of paid phases

		return paidPhasesCount;
	}

	public BigDecimal getRemainingAmount(Long clientBudgetId) {
		// Fetch the ClientBudget by its ID
		ClientBudget clientBudget = clientBudgetRepository.findById(clientBudgetId)
				.orElseThrow(() -> new RuntimeException("ClientBudget not found"));

		// Fetch all payment plans for the given ClientBudget
		List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudgetId);

		// Calculate the remaining amount (sum of the amountDue for unpaid phases)
		BigDecimal remainingAmount = paymentPlans.stream().filter(paymentPlan -> !paymentPlan.isPaid()) // Filter only
																										// unpaid phases
				.map(PaymentPlan::getAmountDue) // Map to the amountDue for each unpaid phase
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the amounts

		return remainingAmount;
	}

	public BigDecimal getTotalFinalBudget() {
		// Fetch all ClientBudgets from the repository
		List<ClientBudget> clientBudgets = clientBudgetRepository.findAll();

		// Calculate the total final budget by summing up the finalBudget of each
		// ClientBudget
		BigDecimal totalFinalBudget = clientBudgets.stream().map(ClientBudget::getFinalBudget) // Extract the
																								// finalBudget from each
																								// ClientBudget
				.filter(finalBudget -> finalBudget != null) // Ensure no null values are included
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum all finalBudget values

		return totalFinalBudget;
	}

	public BigDecimal getTotalPaidAmountForAllProjects() {
		// Fetch all the ClientBudgets
		List<ClientBudget> clientBudgets = clientBudgetRepository.findAll();

		// Initialize total paid amount to zero
		BigDecimal totalPaidAmount = BigDecimal.ZERO;

		// Loop through all client budgets and sum the paid amounts
		for (ClientBudget clientBudget : clientBudgets) {
			// Fetch all payment plans for each ClientBudget
			List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudget.getId());

			// Sum up the paid amounts for each payment plan
			for (PaymentPlan paymentPlan : paymentPlans) {
				if (paymentPlan.isPaid()) {
					totalPaidAmount = totalPaidAmount.add(paymentPlan.getAmountDue());
				}
			}
		}

		// Return the total paid amount
		return totalPaidAmount;
	}

	public BigDecimal getTotalAmountToBePaidForAllProjects() {
		// Fetch all the ClientBudgets
		List<ClientBudget> clientBudgets = clientBudgetRepository.findAll();

		// Initialize total amount to be paid to zero
		BigDecimal totalAmountToBePaid = BigDecimal.ZERO;

		// Loop through all client budgets and sum the amount to be paid
		for (ClientBudget clientBudget : clientBudgets) {
			// Fetch all payment plans for each ClientBudget
			List<PaymentPlan> paymentPlans = paymentPlanRepository.findByClientBudgetId(clientBudget.getId());

			// Sum up the amount due for unpaid phases
			for (PaymentPlan paymentPlan : paymentPlans) {
				if (!paymentPlan.isPaid()) { // Only consider unpaid phases
					totalAmountToBePaid = totalAmountToBePaid.add(paymentPlan.getAmountDue());
				}
			}
		}

		// Return the total amount to be paid
		return totalAmountToBePaid;
	}

	public List<PaymentPlan> getAllPaymentPlans() {
		return paymentPlanRepository.findAll();
	}

}
