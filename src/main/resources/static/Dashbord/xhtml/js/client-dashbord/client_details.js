// URL to fetch client data
const API_BASE_URL = "http://localhost:9090";
// const API_BASE_URL = "https://grandspace.co.in";
const apiUrl = `${API_BASE_URL}/api/client/findAll`;

// Function to dynamically add CSS to the document
function addCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
        /* Pagination button styling */
        .dataTables_paginate .paginate_button {
            border-radius: 50px !important;
            background-color:rgb(20, 235, 49) !important;
            color: white !important;
            padding: 8px 15px !important;
            margin: 0 5px;
            text-align: center;
            cursor: pointer;
        }
        
        /* Pagination button hover effect */
        .dataTables_paginate .paginate_button:hover {
            background-color: #0056b3 !important;
        }

        /* Table responsive styling */
        .table-responsive-md {
            overflow-x: auto;
        }

        /* Styling table headers */
        th {
            background-color: #007bff;
            color: white;
            text-align: left;
            padding: 12px;
        }

        /* Styling table rows */
        td {
            padding: 10px;
            text-align: left;
        }

        /* Add hover effect for rows */
        tr:hover {
            background-color: #f1f1f1;
        }
    `;
    document.head.appendChild(style);
}

// Function to fetch client data
async function fetchClientData() {
    // Retrieve the Bearer token from sessionStorage
    const token = sessionStorage.getItem("authToken");

    // Check if the token exists
    if (!token) {
        console.error("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse JSON response
        const clients = await response.json();

        // Populate the table
        populateClientTable(clients);

        // Initialize DataTable after populating the table
        $('#clientTable').DataTable({
            "paging": true,           // Enable pagination
            "searching": true,       // Enable search box
            "lengthChange": true,    // Enable the option to change page length
            "pageLength": 10,        // Set default page length
            "ordering": true,        // Enable sorting
            "info": true,            // Show table information
            "autoWidth": false,      // Disable auto width
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Function to populate the table with client data
function populateClientTable(clients) {
    const tableBody = document.querySelector(".table-responsive-md tbody");
    
    // Clear the table body (in case of previous data)
    tableBody.innerHTML = "";

    // Loop through the clients and add rows to the table
    clients.forEach((client) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${client.id}</strong></td>
            <td>${client.firstName}</td>
            <td>${client.lastName}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.state}</td>
            <td>${client.city}</td>
            <td>${client.currentAddress}</td>
            <td>${client.premium ? "Yes" : "No"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch client data on page load and add CSS
document.addEventListener("DOMContentLoaded", () => {
    addCSS(); // Add custom styles
    fetchClientData(); // Fetch and populate client data
});
