document.addEventListener("DOMContentLoaded", function () {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with your actual base URL
    const confirmedProjects = document.getElementById("confirmedProjects");

    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        confirmedProjects.textContent = "Unauthorized";
        return;
    }

    // Fetch the total project count
    fetch(`${API_BASE_URL}/api/project/count-not-assigned-projects-last-year`, {
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
        return response.json();
    })
    .then(data => {
        confirmedProjects.textContent = data; // Update UI with count
    })
    .catch(error => {
        console.error("Error fetching project count:", error);
        confirmedProjects.textContent = "Error"; // Display error message if fetch fails
    });
});

// Function to fetch all projects and populate the table
async function fetchProjects() {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with actual base URL
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        return;
    }

    try {
        // Fetch data from the API with Authorization header
        const response = await fetch(`${API_BASE_URL}/api/project/not-assigned-projects-registered-last-year`, {
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
        // console.log(projects); // Log response

        // Get the table body element
        const tableBody = document.querySelector("#projects tbody");

        // Clear existing table rows
        tableBody.innerHTML = "";

        // Populate the table with project data
        projects.forEach(project => {
            const row = document.createElement("tr");

            // Project ID
            const idCell = document.createElement("td");
            idCell.textContent = project.projectCode || "N/A";
            row.appendChild(idCell);

            // Project Name
            const nameCell = document.createElement("td");
            nameCell.textContent = project.name || "No name";
            row.appendChild(nameCell);

            // Status
            const statusCell = document.createElement("td");
            statusCell.textContent = project.status || "No status";
            row.appendChild(statusCell);

            // Client Name
            const clientCell = document.createElement("td");
            clientCell.textContent = project.client ? project.client.firstName : "Unknown Client";
            row.appendChild(clientCell);

            // Assigned Manager
            const managerCell = document.createElement("td");
            managerCell.textContent = project.manager ? project.manager.firstName : "Unknown Manager";
            row.appendChild(managerCell);

            // Description
            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = project.description || "No description";
            row.appendChild(descriptionCell);

            // Start Date
            const startDateCell = document.createElement("td");
            startDateCell.textContent = project.startDate || "Not available";
            row.appendChild(startDateCell);

            // Append row to table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

// Call fetchProjects function when the page loads
document.addEventListener("DOMContentLoaded", fetchProjects);
