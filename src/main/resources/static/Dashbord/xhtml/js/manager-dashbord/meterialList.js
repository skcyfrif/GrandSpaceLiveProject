document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#tbodyy");

    try {
        // Base API URL
        // const API_BASE_URL = "http://localhost:9090";
        const API_BASE_URL = "http://88.222.241.45:2001";

        // const API_BASE_URL = "https://grandspace.co.in";

        // Retrieve managerId and token from sessionStorage (modify if stored elsewhere)
        const managerId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("authToken"); 

        if (!managerId) {
            console.error("Manager ID not found in session.");
            alert("Manager ID is missing. Please log in again.");
            return;
        }

        if (!token) {
            console.error("Token not found in session.");
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        // Fetch data from the updated API endpoint with authentication header
        const response = await fetch(`${API_BASE_URL}/api/vendors/materials/manager/${managerId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const vendors = await response.json(); // Parse the response as JSON

            // Iterate over each vendor and their material details
            vendors.forEach(vendor => {
                vendor.materialDetails.forEach(material => {
                    // Create a new table row
                    const row = `
                        <tr>
                            <td>${vendor.projectId}</td>
                            <td>${material.materialName}</td>
                            <td>${material.quantity}</td>
                            <td>${material.quality}</td>
                            <td>${vendor.lastDate}</td>
                            <td>${material.status}</td>
                        </tr>
                    `;

                    // Append the row to the table body
                    tableBody.innerHTML += row;
                });
            });
        } else {
            console.error("Failed to fetch vendors. Status:", response.status);
            alert("Failed to fetch data from the API.");
        }
    } catch (error) {
        console.error("Error fetching vendors:", error);
        alert("An error occurred while fetching data.");
    }
});
