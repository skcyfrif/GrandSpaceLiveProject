async function fetchBudgetData() {
    try {
        // Fetching data from the API
        const response = await fetch(`${API_BASE_URL}/api/client-budget/getAll`);
        // const response = await fetch('http://localhost:9090/api/client-budget/getAll');
        
        if (response.ok) {
            const budgets = await response.json(); // Assuming the API returns a JSON array
            
            const tableBody = document.getElementById('budgetTableBody');
            tableBody.innerHTML = ''; // Clear existing rows before populating
            
            // Loop through each budget and create a table row
            budgets.forEach(budget => {
                const row = document.createElement('tr');
                
                // Pr.Id Cell
                const projectIdCell = document.createElement('td');
                projectIdCell.textContent = budget.project.id || 'N/A'; // Adjust according to API response
                row.appendChild(projectIdCell);
                
                // Material Budget Cell
                const materialBudgetCell = document.createElement('td');
                materialBudgetCell.textContent = budget.materialBudget || 'Not Selected'; // Adjust according to API response
                row.appendChild(materialBudgetCell);
                
                // With Material Cell
                // const withMaterialCell = document.createElement('td');
                // withMaterialCell.textContent = budget.withMaterials || 'Not Selected'; // Adjust according to API response
                // row.appendChild(withMaterialCell);
                
                // Client Estimate Cell
                const clientEstimateCell = document.createElement('td');
                clientEstimateCell.textContent = budget.clientProjectBudget || 'N/A'; // Adjust according to API response
                row.appendChild(clientEstimateCell);
                
                // Vendor Estimate Cell
                const vendorEstimateCell = document.createElement('td');
                vendorEstimateCell.textContent = budget.managerEstimate || 'N/A'; // Adjust according to API response
                row.appendChild(vendorEstimateCell);
                
                // Approved Budget Cell
                const approvedBudgetCell = document.createElement('td');
                approvedBudgetCell.textContent = budget.finalBudget || 'N/A'; // Adjust according to API response
                row.appendChild(approvedBudgetCell);
                
                // Action Cell with a "Publish" button
                const actionCell = document.createElement('td');
                const publishButton = document.createElement('button');
                publishButton.textContent = 'Publish';
                publishButton.classList.add('btn', 'btn-primary');
                publishButton.onclick = () => handlePublish(budget.project.id, budget.projectBudget.manager.id, budget.id); // Pass managerId and clientBudgetId
                actionCell.appendChild(publishButton);
                row.appendChild(actionCell);
                
                // Append the row to the table body
                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to handle the "Publish" button click
async function handlePublish(projectId, managerId, clientBudgetId) {
    try {
        console.log('Publishing budget for project ID:', projectId, 'with Manager ID:', managerId);
        
        // First API call: Assign Manager to Project
        const responseAssignManager = await fetch(`${API_BASE_URL}/api/project/assignManager/${projectId}`, {
            method: 'PUT', // PUT method for assigning the manager
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token if needed
            },
            body: JSON.stringify({
                managerId: managerId,
            }),
        });

        if (responseAssignManager.ok) {
            alert(`Manager with ID: ${managerId} has been assigned to Project ID: ${projectId}`);
            console.log('Assign Manager request successful');
            
            // Second API call: Generate Payment Plan (POST request)
            const responseGeneratePlan = await fetch(`${API_BASE_URL}/api/payment/generate-plan/${clientBudgetId}`, {
                method: 'POST', // POST method for generating the payment plan
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token if needed
                },
                body: JSON.stringify({
                    clientBudgetId: clientBudgetId // Sending the clientBudgetId as part of the body if needed by the API
                }),
            });

            if (responseGeneratePlan.ok) {
                console.log('Payment plan generated successfully');
                alert(`Payment plan for Client Budget ID: ${clientBudgetId} has been generated.`);
            } else {
                console.error('Failed to generate payment plan:', responseGeneratePlan.status);
                alert('PLAN HAS BEEN GENERATED.');
            }

        } else {
            console.error('Failed to assign manager:', responseAssignManager.status);
            alert('Failed to assign manager. Please try again.');
        }
    } catch (error) {
        console.error('Error during publish:', error);
        alert('An error occurred while publishing. Please try again.');
    }
}

// Initialize the fetch function when the page loads
document.addEventListener('DOMContentLoaded', fetchBudgetData);



