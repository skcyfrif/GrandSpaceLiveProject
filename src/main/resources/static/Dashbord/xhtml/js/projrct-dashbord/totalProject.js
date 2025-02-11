const token = sessionStorage.getItem("authToken");
document.addEventListener("DOMContentLoaded", function () {
    const totalProjectsSpan = document.getElementById("totalProjects");

    // Get the token from sessionStorage

    if (!token) {
        console.error("No token found in sessionStorage");
        totalProjectsSpan.textContent = "Unauthorized";
        return;
    }

    fetch(`${API_BASE_URL}/api/project/projects/count`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Include the Bearer token
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            totalProjectsSpan.textContent = data; // Assuming the response is a plain number
            // console.log("Total Projects:", data);
        })
        .catch(error => {
            console.error("Error fetching project count:", error);
            totalProjectsSpan.textContent = "Error"; // Display error message if fetch fails
        });
});

document.addEventListener("DOMContentLoaded", async function () {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with your actual base URL
    const tableBody = document.querySelector("table tbody");

    if (!tableBody) {
        console.error("Table body element not found in the DOM.");
        return;
    }

    // Retrieve token from sessionStorage
    // const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        tableBody.innerHTML = `<tr><td colspan="7">Unauthorized: Please log in</td></tr>`;
        return;
    }

    try {
        // Fetch data from the API with Authorization header
        const response = await fetch(`${API_BASE_URL}/api/project/projects/last-year`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Include the Bearer token
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }

        const projects = await response.json();

        // Clear existing rows (if any)
        tableBody.innerHTML = "";

        // Populate table rows dynamically
        projects.forEach(project => {
            const row = document.createElement("tr");

            // Project ID
            const idCell = document.createElement("td");
            idCell.textContent = project.projectCode || "N/A";
            row.appendChild(idCell);

            // Project Name
            const nameCell = document.createElement("td");
            nameCell.textContent = project.name || "No Name";
            row.appendChild(nameCell);

            // Status
            const statusCell = document.createElement("td");
            statusCell.textContent = project.status || "No Status";
            row.appendChild(statusCell);

            // Client Name
            const clientCell = document.createElement("td");
            clientCell.textContent = project.client && project.client.firstName
                ? project.client.firstName
                : "Unknown Client";
            row.appendChild(clientCell);

            // Assigned Manager
            const managerCell = document.createElement("td");
            managerCell.textContent = project.manager && project.manager.firstName
                ? project.manager.firstName
                : "Unknown Manager";
            row.appendChild(managerCell);

            // Registration Date
            const dateCell = document.createElement("td");
            dateCell.textContent = project.registrationDate || "No Date";
            row.appendChild(dateCell);

            // Description with button
            const descriptionCell = document.createElement("td");
            const viewButton = document.createElement("button");
            viewButton.textContent = "View";
            viewButton.classList.add("btn", "btn-info", "btn-sm"); // Add Bootstrap classes for styling

            // Add click event to the button
            viewButton.addEventListener("click", () => {
                showModal(project.description || "No Description Available");
            });

            descriptionCell.appendChild(viewButton);
            row.appendChild(descriptionCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching or populating projects:", error);
        tableBody.innerHTML = `<tr><td colspan="7">Error loading data</td></tr>`;
    }
});

// Function to show the modal with project description
function showModal(description) {
    const modal = document.getElementById("viewModal");
    const descriptionElement = document.getElementById("projectDescription");

    descriptionElement.textContent = description;
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("viewModal");
    modal.style.display = "none";
}




/////////////////////////////

