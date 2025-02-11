document.addEventListener("DOMContentLoaded", function () {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with your actual base URL
    const dispatchedProjects = document.getElementById("dispatchedProjects");

    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        dispatchedProjects.textContent = "Unauthorized";
        return;
    }

    // Fetch the total project count with Bearer token
    fetch(`${API_BASE_URL}/api/project/count-dispute-last-year`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Include Bearer token
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            // Update the span content with the total project count
            dispatchedProjects.textContent = data; // Assuming the response is a plain number
        })
        .catch(error => {
            console.error("Error fetching project count:", error);
            dispatchedProjects.textContent = "Error"; // Display error message if fetch fails
        });
});

// Function to fetch all projects and populate the table
async function fetchProjects() {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with your actual base URL
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        return;
    }

    try {
        // Send a GET request to the API with Bearer token
        const response = await fetch(`${API_BASE_URL}/api/project/dispute-projects-registered-last-year`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Include Bearer token
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }

        const projects = await response.json();

        // Get the table body element
        const tableBody = document.querySelector('#projects tbody');

        // Clear existing table rows before adding new ones
        tableBody.innerHTML = '';

        // Loop through the projects and add each project to the table
        projects.forEach(project => {
            const row = document.createElement('tr');

            // Create table cells for each project field
            const idCell = document.createElement('td');
            idCell.textContent = project.projectCode || 'N/A'; // Fallback if id is missing
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = project.name || 'No name'; // Fallback if name is missing
            row.appendChild(nameCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = project.status || 'No status'; // Fallback if status is missing
            row.appendChild(statusCell);

            // Extract client and manager names from the respective objects
            const clientName = project.client ? `${project.client.firstName}` : 'Unknown Client';
            const managerName = project.manager ? `${project.manager.firstName}` : 'Unknown Manager';

            // Populate client and manager name cells
            const clientCell = document.createElement('td');
            clientCell.textContent = clientName;
            row.appendChild(clientCell);

            const managerCell = document.createElement('td');
            managerCell.textContent = managerName;
            row.appendChild(managerCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = project.description || 'No description'; // Fallback if description is missing
            row.appendChild(descriptionCell);

            const startDateCell = document.createElement('td');
            startDateCell.textContent = project.startDate || 'Not available'; // Fallback if startDate is missing
            row.appendChild(startDateCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Call fetchProjects function when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
