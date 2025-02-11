async function populateProjectBudgets() {
    try {
        // Retrieve clientId from sessionStorage
        const clientId = sessionStorage.getItem('userId');
        if (!clientId) {
            console.error('Client ID not found in session storage.');
            return;
        }

        // Fetch data from the API with the clientId
        const response = await fetch(`${API_BASE_URL}/api/admin/client/${clientId}`);
        if (response.ok) {
            const budgets = await response.json();

            // Locate the <tbody> inside the table
            const tableBody = document.querySelector('table.table-bordered tbody');
            tableBody.innerHTML = ''; // Clear existing rows, if any

            // Populate table rows
            budgets.forEach(budget => {
                const row = document.createElement('tr');

                // Project Name
                const prNameCell = document.createElement('td');
                prNameCell.textContent = budget.project.name || 'N/A'; // Adjust according to your data structure
                row.appendChild(prNameCell);

                // With Material
                const withMaterialCell = document.createElement('td');
                withMaterialCell.textContent = budget.budgetWithMaterials || 'N/A';
                row.appendChild(withMaterialCell);

                // Confirmation Dropdown
                const confirmationCell = document.createElement('td');
                const dropdown = document.createElement('select');
                dropdown.classList.add('form-select'); // Add Bootstrap class for styling (if applicable)

                // Default Placeholder Option (Confirmation)
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // No value for the placeholder
                defaultOption.textContent = 'Confirmation'; // Displayed text
                defaultOption.disabled = true; // Prevent selection
                defaultOption.selected = true; // Show as the default
                dropdown.appendChild(defaultOption);

                // Option 1: With Material
                const optionWithMaterial = document.createElement('option');
                optionWithMaterial.value = 'withMaterial';
                optionWithMaterial.textContent = 'With Material';
                dropdown.appendChild(optionWithMaterial);

                // Add event listener for the dropdown change
                dropdown.addEventListener('change', async () => {
                    const selectedValue = dropdown.value; // Get selected value
                    const withMaterials = selectedValue === 'withMaterial'; // Determine boolean value

                    // Show confirmation dialog to the user
                    const confirmationMessage = `You selected "${selectedValue === 'withMaterial' ? 'With Material' : 'Without Material'}". Do you want to confirm this choice?`;
                    if (!confirm(confirmationMessage)) {
                        // Reset dropdown to the default state if the user cancels
                        dropdown.value = '';
                        return;
                    }

                    try {
                        // Get the token from sessionStorage (or wherever it's stored)
                        const token = sessionStorage.getItem('authToken');
                        if (!token) {
                            console.error('Token not found in session storage.');
                            return;
                        }

                        // POST request to the confirmation API with the token in the headers
                        const confirmResponse = await fetch(`${API_BASE_URL}/api/client-budget/confirm/${budget.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`, // Pass the token in the header
                            },
                            body: JSON.stringify({ withMaterials }),
                        });

                        if (confirmResponse.ok) {
                            alert('Confirmation updated successfully.');

                            // Remove the row after confirmation
                            row.remove();
                        } else {
                            console.error('Failed to confirm:', confirmResponse.status);
                            alert('Budget already confirmed for this project.');
                        }
                    } catch (error) {
                        console.error('Error updating confirmation:', error);
                        alert('Error updating confirmation.');
                    }
                });

                // Check if this budget is already confirmed and disable the dropdown if necessary
                if (budget.isConfirmed) { // Assuming `isConfirmed` is a field in the response
                    dropdown.disabled = true; // Disable dropdown for confirmed budgets
                    dropdown.title = 'This budget has already been confirmed.';
                }

                // Append dropdown to the cell and cell to the row
                confirmationCell.appendChild(dropdown);
                row.appendChild(confirmationCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching project budgets:', error);
    }
}

// Call the function to populate the table when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateProjectBudgets);

// console.log("Updated populateProjectBudgets loaded.");
