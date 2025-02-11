// const API_BASE_URL = 'http://localhost:9090';

// Function to fetch all client budgets and populate payment plans
async function fetchBudgetData() {
    try {
        // Fetch client budgets from the API
        const response = await fetch(`${API_BASE_URL}/api/client-budget/getAll`);
        if (response.ok) {
            const budgets = await response.json(); // Assuming the API returns a JSON array
            for (const budget of budgets) {
                // Fetch payment plans for each clientBudgetId
                await fetchPaymentPlans(budget.id);
            }
        } else {
            console.error('Failed to fetch client budgets:', response.status);
        }
    } catch (error) {
        console.error('Error fetching client budgets:', error);
    }
}

// Function to fetch payment plans for a specific clientBudgetId
async function fetchPaymentPlans(clientBudgetId) {
    try {
        // Fetch payment plans for the specific clientBudgetId
        const response = await fetch(`${API_BASE_URL}/api/payment/payment-plans/${clientBudgetId}`);
        if (response.ok) {
            const paymentPlans = await response.json(); // Assuming the API returns a JSON array
            populateTable(paymentPlans); // Populate the table with payment plan data
        } else {
            console.error('Failed to fetch payment plans:', response.status);
        }
    } catch (error) {
        console.error('Error fetching payment plans:', error);
    }
}

// Function to populate the table with payment plan data
function populateTable(paymentPlans) {
    const tableBody = document.getElementById('budgetTableBody');
    
    paymentPlans.forEach(plan => {
        const row = document.createElement('tr');
        
        // Pr.Id Cell
        const projectIdCell = document.createElement('td');
        projectIdCell.textContent = plan.clientBudget.project.id || 'N/A';
        row.appendChild(projectIdCell);
        
        // Approved Budget Cell
        const approvedBudgetCell = document.createElement('td');
        approvedBudgetCell.textContent = plan.clientBudget.finalBudget || 'N/A';
        row.appendChild(approvedBudgetCell);
        
        // Phases Cell
        const phaseCell = document.createElement('td');
        phaseCell.textContent = plan.phase || 'N/A';
        row.appendChild(phaseCell);
        
        // Paid/Unpaid Cell
        const paidCell = document.createElement('td');
        paidCell.textContent = plan.paid ? 'Paid' : 'Unpaid';
        row.appendChild(paidCell);
        
        // Due Amount Cell
        const dueAmountCell = document.createElement('td');
        dueAmountCell.textContent = plan.amountDue || 'N/A';
        row.appendChild(dueAmountCell);
        
        // Due Date Cell
        const dueDateCell = document.createElement('td');
        dueDateCell.textContent = plan.dueDate || 'N/A';
        row.appendChild(dueDateCell);
        
        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Initialize the fetch function when the page loads
document.addEventListener('DOMContentLoaded', fetchBudgetData);
