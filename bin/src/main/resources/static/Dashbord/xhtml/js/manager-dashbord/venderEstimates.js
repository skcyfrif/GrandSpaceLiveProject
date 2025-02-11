let selectedProjectId = null; // Variable to store the selected projectId
let allBudgets = []; // To store all budgets fetched from the API

async function fetchBudgets() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/projectS/budgets`);
        if (response.ok) {
            allBudgets = await response.json(); // Store all budgets globally
            populateProjectFilter(allBudgets); // Populate the project filter dropdown
            renderTable(allBudgets); // Render the table with fetched budgets
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch budgets for a specific project from the API
async function fetchBudgetsByProjectId(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/projectS/project/${projectId}`);
        if (response.ok) {
            const filteredBudgets = await response.json();
            renderTable(filteredBudgets); // Render table with filtered budgets
        } else {
            console.error('Failed to fetch budgets for project:', response.status);
        }
    } catch (error) {
        console.error('Error fetching budgets for project:', error);
    }
}

function populateProjectFilter(budgets) {
    const projectFilter = document.getElementById('projectFilter');
    const projectIds = [...new Set(budgets.map(budget => budget.project.id))]; // Extract unique project IDs

    // Populate the dropdown
    projectFilter.innerHTML = '<option value="">All Projects</option>'; // Default option
    projectIds.forEach(projectId => {
        const option = document.createElement('option');
        option.value = projectId;
        option.textContent = projectId;
        projectFilter.appendChild(option);
    });

    // Add event listener for filtering the table
    projectFilter.addEventListener('change', () => {
        selectedProjectId = projectFilter.value; // Update selected project ID
        if (selectedProjectId) {
            fetchBudgetsByProjectId(selectedProjectId); // Fetch budgets for the selected project
        } else {
            renderTable(allBudgets); // Render all budgets if no project is selected
        }
    });
}

function renderTable(budgets) {
    const tableBody = document.getElementById('budgetTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (budgets.length === 0) {
        // Show a message if no budgets are available
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.textContent = 'No budgets available for the selected project.';
        cell.classList.add('text-center');
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    budgets.forEach(budget => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = budget.id || 'N/A';
        row.appendChild(idCell);

        const projectIdCell = document.createElement('td');
        projectIdCell.textContent = budget.project.id || 'No Project Id';
        row.appendChild(projectIdCell);

        const projectBudgetCell = document.createElement('td');
        projectBudgetCell.textContent = budget.project.budget || 'No Budget';
        row.appendChild(projectBudgetCell);

        const budgetIdCell = document.createElement('td');
        budgetIdCell.textContent = budget.manager.id || 'No ID';
        row.appendChild(budgetIdCell);

        const vendorEstimateCell = document.createElement('td');
        vendorEstimateCell.textContent = budget.estimatedBudget || 'No Estimate';
        row.appendChild(vendorEstimateCell);

        const estimateDateCell = document.createElement('td');
        estimateDateCell.textContent = budget.uploadDate || 'No Estimate Date';
        row.appendChild(estimateDateCell);

        const actionCell = document.createElement('td');
        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.classList.add('btn', 'btn-primary');
        selectButton.onclick = () => openPopup(budget.project.id, budget.id);

        actionCell.appendChild(selectButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function openPopup(projectId, managerBudgetId) {
    document.getElementById('projectId').value = projectId;
    document.getElementById('managerBudgetId').value = managerBudgetId;

    const popup = document.getElementById('budgetPopup');
    popup.style.display = 'flex';

    document.getElementById('cancelPopup').onclick = closePopup;
    document.getElementById('closePopup').onclick = closePopup;

    document.getElementById('budgetForm').onsubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };
}

function closePopup() {
    document.getElementById('budgetPopup').style.display = 'none';
}

async function handleSubmit() {
    const projectId = document.getElementById('projectId').value;
    const managerBudgetId = document.getElementById('managerBudgetId').value;
    const materialCost = document.getElementById('materialCost').value;
    const profitMargin = document.getElementById('profitMargin').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/project/${projectId}/select-budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                managerBudgetId,
                materialCost,
                profitMargin,
            }),
        });

        if (response.ok) {
            alert('Budget selected successfully!');
            closePopup();
        } else {
            alert('Failed to select budget. Please try again.');
        }
    } catch (error) {
        console.error('Error selecting budget:', error);
        alert('An error occurred while selecting the budget.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchBudgets);
