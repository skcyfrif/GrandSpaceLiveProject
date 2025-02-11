// URL to fetch manager data

const API_BASE_URL = "http://localhost:9090";
// const API_BASE_URL = "https://grandspace.co.in";
const apiUrl = `${API_BASE_URL}/api/manager/findAll`;

// Function to fetch manager data
async function fetchManagerData() {
    try {
        const response = await fetch(apiUrl);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse JSON response
        const managers = await response.json();

        // Populate the table
        populateManagerTable(managers);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Function to populate the table with manager data
function populateManagerTable(managers) {
    const tableBody = document.querySelector(".table-responsive-md tbody");
    
    // Clear the table body (in case of previous data)
    tableBody.innerHTML = "";

    // Loop through the managers and add rows to the table
    managers.forEach((manager) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${manager.id || "N/A"}</strong></td>
            <td>${manager.firstName || "N/A"}</td>
            <td>${manager.lastName || "N/A"}</td>
            <td>${manager.email || "N/A"}</td>
            <td>${manager.phone || "N/A"}</td>
            <td>${manager.state || "N/A"}</td>
            <td>${manager.city || "N/A"}</td>
            <td>${manager.qualifications || "N/A"}</td>
            <td>${manager.experience || "N/A"} years</td>
            <td>${manager.premium ? "Yes" : "No"}</td>
            <td>${manager.assignedProjectId || "None"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch manager data on page load
document.addEventListener("DOMContentLoaded", fetchManagerData);
