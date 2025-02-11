let selectedProjectId = null; // Variable to store the selected projectId
let allBudgets = []; // To store all budgets fetched from the API

// const API_BASE_URL = 'http://localhost:9090'; // Replace with your actual API base URL

// Function to fetch all budgets and initialize the project filter and table
async function fetchBudgets() {
    try {
        const token = sessionStorage.getItem("authToken");  // Retrieve the Bearer token from sessionStorage

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/projectS/budgets`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            allBudgets = await response.json(); // Store all budgets globally
            populateProjectFilter(allBudgets); // Populate the project filter dropdown
            renderTable(allBudgets); // Render the table with fetched budgets
        } else {
            console.error('Failed to fetch budgets:', response.status);
        }
    } catch (error) {
        console.error('Error fetching budgets:', error);
    }
}

// Fetch budgets for a specific project ID
async function fetchBudgetsByProjectId(projectId) {
    try {
        const token = sessionStorage.getItem("authToken");  // Retrieve the Bearer token from sessionStorage

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/projectS/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

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

// Populate the project filter dropdown with unique project IDs
function populateProjectFilter(budgets) {
    const projectFilter = document.getElementById('projectFilter');
    const projectIds = [...new Set(budgets.map((budget) => budget.project.id))]; // Extract unique project IDs

    projectFilter.innerHTML = '<option value="">All Projects</option>'; // Default option
    projectIds.forEach((projectId) => {
        const option = document.createElement('option');
        option.value = projectId;
        option.textContent = projectId;
        projectFilter.appendChild(option);
    });

    // Add event listener for dropdown changes
    projectFilter.addEventListener('change', () => {
        selectedProjectId = projectFilter.value; // Update the selected project ID
        if (selectedProjectId) {
            fetchBudgetsByProjectId(selectedProjectId); // Fetch and display budgets for the selected project
        } else {
            renderTable(allBudgets); // Show all budgets if no specific project is selected
        }
    });
}

// Render the budget table
function renderTable(budgets) {
    const tableBody = document.getElementById('budgetTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (budgets.length === 0) {
        // Display a message if no budgets are available
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8; // Adjust based on the number of columns
        cell.textContent = 'No budgets available for the selected project.';
        cell.classList.add('text-center');
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    budgets.forEach((budget) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${budget.id || 'N/A'}</td>
            <td>${budget.project.projectCode || 'No Project ID'}</td>
            <td>${budget.project.budget || 'No Budget'}</td>
            <td>${budget.manager.id || 'No ID'}</td>
            <td>${budget.estimatedBudget || 'No Estimate'}</td>
            <td>${budget.uploadDate || 'No Date'}</td>
            <td>${budget.status || 'Not Selected'}</td>
        `;

        const actionCell = document.createElement('td');
        const selectButton = document.createElement('button');
        selectButton.textContent = budget.status === 'SELECTED' ? 'Selected' : 'Select';
        selectButton.classList.add('btn', budget.status === 'SELECTED' ? 'btn-secondary' : 'btn-primary');
        selectButton.disabled = budget.status === 'SELECTED';

        // Handle button click to open the popup
        if (budget.status !== 'SELECTED') {
            selectButton.onclick = () => openPopup(budget.project.id, budget.id);
        }

        actionCell.appendChild(selectButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Open the popup for budget selection
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

// Close the popup
function closePopup() {
    document.getElementById('budgetPopup').style.display = 'none';
}

// Handle budget selection submission
async function handleSubmit() {
    const projectId = document.getElementById('projectId').value;
    const managerBudgetId = document.getElementById('managerBudgetId').value;
    const materialCost = document.getElementById('materialCost').value;
    const profitMargin = document.getElementById('profitMargin').value;

    const token = sessionStorage.getItem("authToken");  // Retrieve the Bearer token from sessionStorage

    if (!token) {
        console.error("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/project/${projectId}/select-budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Pass the Bearer token here
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
            fetchBudgets(); // Refresh the table after successful selection
        } else {
            alert('Failed to select budget. Please try again.');
        }
    } catch (error) {
        console.error('Error selecting budget:', error);
        alert('An error occurred while selecting the budget.');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', fetchBudgets);
