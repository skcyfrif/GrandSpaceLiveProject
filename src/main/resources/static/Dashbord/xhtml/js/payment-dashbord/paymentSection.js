// Function to fetch data and populate the table
async function fetchPaymentData() {
    const clientId = sessionStorage.getItem("userId"); // Retrieve clientId from sessionStorage
    if (!clientId) {
        console.error("Client ID is not set in sessionStorage.");
        return;
    }

    const apiUrl = `${API_BASE_URL}/api/payment/by-client/${clientId}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const paymentData = await response.json();
        // console.log(paymentData);
        

        // Select the table body
        const tableBody = document.getElementById("budgetTableBodyNeww");
        tableBody.innerHTML = ""; // Clear existing rows

        // Populate the table with fetched data
        paymentData.forEach(payment => {
            // console.log(payment);
            
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${payment.clientBudget.project.projectCode || "N/A"}</td>
                <td>${payment.clientBudget.finalBudget || "N/A"}</td>
                <td>${payment.phase || "N/A"}</td>
                <td>
                    ${payment.paid ? "Paid" : `<button class="pay-button" data-clientBudgetId="${payment.clientBudget.id}" data-phase="${payment.phase}">Pay</button>`}
                </td>
                <td>${payment.amountDue || "N/A"}</td>
                <td>${payment.dueDate || "N/A"}</td>
            `;

            tableBody.appendChild(row);
            // console.log(tableBody);
            
        });

        // Add event listeners to the pay buttons
        document.querySelectorAll(".pay-button").forEach(button => {
            button.addEventListener("click", async (event) => {
                const clientBudgetId = button.getAttribute("data-clientBudgetId");
                const phase = button.getAttribute("data-phase");

                try {
                    const payApiUrl = `${API_BASE_URL}/api/payment/pay/${clientBudgetId}/${phase}`;
                    const payResponse = await fetch(payApiUrl, { method: "PUT" });

                    if (!payResponse.ok) {
                        throw new Error(`Payment API error! Status: ${payResponse.status}`);
                    }

                    alert("Payment successful!");
                    fetchPaymentData(); // Refresh the table after payment
                } catch (error) {
                    console.error("Error processing payment:", error);
                    alert("Payment failed. Please try again.");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching payment data:", error);
    }
}

// Call the function to populate the table on page load
document.addEventListener("DOMContentLoaded", fetchPaymentData);



















// // const API_BASE_URL = 'http://localhost:9090';

// // Function to fetch all client budgets and populate payment plans
// async function fetchBudgetData() {
//     try {
//         // Fetch client budgets from the API
//         const response = await fetch(`${API_BASE_URL}/api/client-budget/getAll`);
//         if (response.ok) {
//             const budgets = await response.json(); // Assuming the API returns a JSON array
//             for (const budget of budgets) {
//                 // Fetch payment plans for each clientBudgetId
//                 await fetchPaymentPlans(budget.id);
//             }
//         } else {
//             console.error('Failed to fetch client budgets:', response.status);
//         }
//     } catch (error) {
//         console.error('Error fetching client budgets:', error);
//     }
// }

// // Function to fetch payment plans for a specific clientBudgetId
// async function fetchPaymentPlans(clientBudgetId) {
//     try {
//         // Fetch payment plans for the specific clientBudgetId
//         const response = await fetch(`${API_BASE_URL}/api/payment/payment-plans/${clientBudgetId}`);
//         if (response.ok) {
//             const paymentPlans = await response.json(); // Assuming the API returns a JSON array
//             populateTable(clientBudgetId, paymentPlans); // Populate the table with payment plan data
//         } else {
//             console.error('Failed to fetch payment plans:', response.status);
//         }
//     } catch (error) {
//         console.error('Error fetching payment plans:', error);
//     }
// }

// // Function to populate the table with payment plan data
// function populateTable(clientBudgetId, paymentPlans) {
//     const tableBody = document.getElementById('budgetTableBody');
    
//     paymentPlans.forEach(plan => {
//         const row = document.createElement('tr');
        
//         // Pr.Id Cell
//         const projectIdCell = document.createElement('td');
//         projectIdCell.textContent = plan.clientBudget.project.id || 'N/A';
//         row.appendChild(projectIdCell);
        
//         // Approved Budget Cell
//         const approvedBudgetCell = document.createElement('td');
//         approvedBudgetCell.textContent = plan.clientBudget.finalBudget || 'N/A';
//         row.appendChild(approvedBudgetCell);
        
//         // Phases Cell
//         const phaseCell = document.createElement('td');
//         phaseCell.textContent = plan.phase || 'N/A';
//         row.appendChild(phaseCell);
        
//         // Paid/Unpaid Cell with Button
//         const paidCell = document.createElement('td');
//         const paidButton = document.createElement('button');
//         paidButton.textContent = plan.paid ? 'Paid' : 'Unpaid';
//         paidButton.classList.add('btn', plan.paid ? 'btn-success' : 'btn-warning');
//         paidButton.onclick = () => handlePayment(clientBudgetId, plan.phase, paidButton);
//         paidCell.appendChild(paidButton);
//         row.appendChild(paidCell);
        
//         // Due Amount Cell
//         const dueAmountCell = document.createElement('td');
//         dueAmountCell.textContent = plan.amountDue || 'N/A';
//         row.appendChild(dueAmountCell);
        
//         // Due Date Cell
//         const dueDateCell = document.createElement('td');
//         dueDateCell.textContent = plan.dueDate || 'N/A';
//         row.appendChild(dueDateCell);
        
//         // Append the row to the table body
//         tableBody.appendChild(row);
//     });
// }

// // Function to handle payment when the "Unpaid" button is clicked
// async function handlePayment(clientBudgetId, phase, button) {
//     try {
//         // API call to mark the phase as paid
//         const response = await fetch(`${API_BASE_URL}/api/payment/pay/${clientBudgetId}/${phase}`, {
//             method: 'PUT', // Updated to use PUT method
//         });

//         if (response.ok) {
//             // Update the button text and style after successful payment
//             button.textContent = 'Paid';
//             button.classList.remove('btn-warning');
//             button.classList.add('btn-success');
//             button.disabled = true; // Disable the button after marking as paid
//             alert(`Phase ${phase} for Client Budget ID ${clientBudgetId} has been marked as paid.`);
//         } else {
//             console.error('Failed to process payment:', response.status);
//             alert('Failed to mark the phase as paid. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error processing payment:', error);
//         alert('An error occurred while processing the payment. Please try again.');
//     }
// }

// // Initialize the fetch function when the page loads
// document.addEventListener('DOMContentLoaded', fetchBudgetData);
