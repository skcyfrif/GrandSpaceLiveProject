document.addEventListener("DOMContentLoaded", async function () {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with your actual API base URL
    const clientId = sessionStorage.getItem("userId"); // Get clientId from sessionStorage

    if (!clientId) {
        console.error("Client ID not found in session storage.");
        return;
    }

    const tableBody = document.getElementById("budgetTableBodyNew");

    if (!tableBody) {
        console.error("Table body element not found in the DOM.");
        return;
    }

    try {
        // Fetch data from the API
        const response = await fetch(`${API_BASE_URL}/api/client-budget/by-client/${clientId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch budgets: ${response.status} ${response.statusText}`);
        }

        const budgets = await response.json();
        // console.log(budgets);
        

        // Clear any existing rows
        tableBody.innerHTML = "";

        // Populate table rows with data
        budgets.forEach(budget => {
            const row = document.createElement("tr");
            // console.log(budget.project.id);

            // Project ID
            const idCell = document.createElement("td");
            idCell.textContent = budget.project.id || "N/A";
            row.appendChild(idCell);
            // console.log(idCell);
            

            // Material Budget
            const materialBudgetCell = document.createElement("td");
            materialBudgetCell.textContent = budget.materialBudget || "N/A";
            row.appendChild(materialBudgetCell);

            // Approved Budget
            const approvedBudgetCell = document.createElement("td");
            approvedBudgetCell.textContent = budget.finalBudget || "N/A";
            row.appendChild(approvedBudgetCell);

            // Status
            const statusCell = document.createElement("td");
            statusCell.textContent = budget.project.status || "Pending";
            row.appendChild(statusCell);

            // Append the row to the table body
            tableBody.appendChild(row);
            // console.log(tableBody);
            
        });
    } catch (error) {
        console.error("Error fetching or populating budget data:", error);
        tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
    }
});
