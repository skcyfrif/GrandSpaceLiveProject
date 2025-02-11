document.addEventListener("DOMContentLoaded", async () => {
    // Extract projectId from the query string
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    // If no projectId found in the URL, alert and return
    if (!projectId) {
        alert("Project ID is missing.");
        return;
    }

    // Retrieve the Bearer token from sessionStorage
    const token = sessionStorage.getItem("authToken");
    if (!token) {
        console.error("No token found. Please log in.");
        return;
    }

    try {
        // Fetch materials for the given project
        const response = await fetch(`${API_BASE_URL}/api/vendors/${projectId}/requirments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const vendors = await response.json();

            // Populate the table with material details
            const tbody = document.querySelector("table tbody");
            vendors.forEach(vendor => {
                vendor.materialDetails.forEach(material => {
                    const row = `
                        <tr>
                            <td>${projectId}</td>
                            <td>${material.materialName}</td>
                            <td>${material.quantity}</td>
                            <td>${material.quality}</td>
                            <td>${vendor.lastDate}</td>
                            <td id="status-${material.id}">${material.status}</td>
                            <td>
                                ${material.status === "SEND" ? 
                                    `<span>Sent</span>` : 
                                    `<button class="btn btn-success" id="sendBtn-${material.id}">Send</button>`}
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });
            });

            // Add click event listener to the table for all "Send" buttons
            tbody.addEventListener("click", async (event) => {
                // Check if the clicked element is a "Send" button
                if (event.target && event.target.matches("button.btn.btn-success")) {
                    const materialId = event.target.id.split('-')[1]; // Extract material ID
                    // console.log(`Sending status for material ID: ${materialId}`);

                    // Find the button and status element that was clicked
                    const sendButton = document.getElementById(`sendBtn-${materialId}`);
                    const statusCell = document.getElementById(`status-${materialId}`);
                    
                    // Disable the button to prevent further clicks
                    sendButton.disabled = true;
                    sendButton.textContent = "Sending..."; // Update button text while request is being processed

                    // Send the status update to the server
                    try {
                        const updateResponse = await fetch(`${API_BASE_URL}/api/vendors/${materialId}/status`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                                'Content-Type': 'application/json',
                            },
                        });

                        if (updateResponse.ok) {
                            // Update the material status on the page
                            statusCell.textContent = 'SEND'; // Assuming the status is updated to 'SEND'
                            sendButton.parentNode.innerHTML = `<span>Sent</span>`; // Change the button to "Sent"
                        } else {
                            sendButton.textContent = 'Send'; // Revert button text if update failed
                            alert('Failed to update the status.');
                        }
                    } catch (error) {
                        console.error("Error updating status:", error);
                        sendButton.textContent = 'Send'; // Revert button text in case of error
                        alert("Error updating status.");
                    }
                }
            });
        } else {
            console.error("Failed to fetch materials.");
            alert("Failed to fetch materials.");
        }
    } catch (error) {
        console.error("Error fetching materials:", error);
        alert("Error fetching materials.");
    }
});
