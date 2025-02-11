// Function to fetch data and populate the cards
async function fetchAndPopulateCards() {
    const apiUrl = `${API_BASE_URL}/api/project/awaiting-estimates-last-year`;

    try {
        // Retrieve the Bearer token from sessionStorage
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const projects = await response.json(); // Assuming the API returns an array of projects

        const container = document.getElementById("cardsContainer"); // Parent element for cards
        container.innerHTML = ""; // Clear any existing cards

        projects.forEach((project) => {
            const card = document.createElement("div");
            card.className = "col-xl-3 col-xxl-4 col-lg-4 col-sm-6";

            card.innerHTML = `
                <div class="card user-card">
                    <div class="card-body pb-0">
                        <div class="d-flex mb-3 align-items-center">
                            <div class="dz-media me-3">
                                <img src="images/gs-vender-image.jpg" alt="Vendor Image">
                            </div>
                            <div>
                                <h5 class="title mb-0"><a href="agent-profile.html">Name: ${project.name || "N/A"}</a></h5>
                                <span class="text-primary">Description: ${project.description || "N/A"}</span>
                            </div>
                        </div>
                        <p class="fs-12">Area: ${project.areaInSquareFeet || "N/A"}</p>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between">
                                <div class="answering d-flex">
                                    <span class="mb-0 title">Registration-Date:<span class="text-black ms-2">${project.registrationDate || "N/A"}</span>
                                </div>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                <div class="answering d-flex">
                                    <span class="mb-0 title">Vender-Estimated-Date:<span class="text-black ms-2">${project.estimatedByVendor || "N/A"}</span>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <span class="mb-0 title">Bid Type</span> :
                                <span class="text-black ms-2">Bid</span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer">
                        <a href="javascript:void(0);" class="btn btn-outline-success btn-xs mb-1"
                            data-bs-toggle="modal" data-bs-target="#sendMessageModal">Message</a>
                        <a href="javascript:void(0);" 
                            class="btn btn-outline-danger btn-xs mb-1 bid-button" 
                            data-project-id="${project.id}">Bid</a>
                        <a href="javascript:void(0);" 
                            class="btn btn-outline-danger btn-xs mb-1 cancel-bid">Cancel Bid</a>
                        <a href="#" class="btn btn-outline-warning btn-xs">Acknowledge</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        // Add event listeners for "Cancel Bid" buttons
        document.querySelectorAll('.cancel-bid').forEach(button => {
            button.addEventListener('click', function () {
                // Show confirmation dialog
                const confirmation = confirm("Are you sure you want to cancel the bid?");
                if (confirmation) {
                    alert("Bid has been successfully canceled.");
                    // Logic to remove the card or update the UI
                    const card = this.closest('.user-card');
                    if (card) {
                        card.remove();
                    }
                }
            });
        });

        // Add event listeners for "Bid" buttons
        document.querySelectorAll('.bid-button').forEach(button => {
            button.addEventListener('click', function () {
                const projectId = this.getAttribute("data-project-id");
                openBidModal(projectId);
            });
        });

    } catch (error) {
        console.error("Error fetching and populating cards:", error);
    }
}

// Function to open the bid modal
function openBidModal(projectId) {
    const modal = document.getElementById("bidModal");
    const projectIdField = document.getElementById("projectId");
    const managerIdField = document.getElementById("managerId");

    // Get Manager ID from sessionStorage
    const managerId = sessionStorage.getItem("userId");

    if (!managerId) {
        console.error("Manager ID is not available in sessionStorage.");
        return; // Exit the function if Manager ID is not set
    }

    // Set project ID and Manager ID in the modal
    projectIdField.value = projectId;  // Set project ID (read-only)
    managerIdField.value = managerId;  // Set Manager ID (read-only)

    const bootstrapModal = new bootstrap.Modal(modal); // Use Bootstrap Modal
    bootstrapModal.show();
}

// Add event listener for Submit Bid button
document.getElementById("submitBidButton").addEventListener("click", async function () {
    const projectId = document.getElementById("projectId").value;
    const managerId = document.getElementById("managerId").value;
    const estimatedBudget = document.getElementById("estimatedBudget").value;

    if (!projectId || !managerId || !estimatedBudget) {
        alert("Please fill out all fields before submitting the bid.");
        return;
    }

    try {
        // Retrieve the Bearer token from sessionStorage
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/projectS/${projectId}/budget/submit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,  // Pass the Bearer token here
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                projectId: projectId,
                managerId: managerId,
                estimatedBudget: estimatedBudget
            })
        });

        if (response.ok) {
            alert("Bid submitted successfully!");

            // Close the modal
            const modalElement = document.getElementById("bidModal");
            const bootstrapModal = bootstrap.Modal.getInstance(modalElement); // Retrieve modal instance
            bootstrapModal.hide(); // Hide the modal
        } else {
            alert("Your bid is already submitted.");
        }
    } catch (error) {
        console.error("Error submitting bid:", error);
        alert("Error submitting bid. Please try again.");
    }
});

// Call the function to populate cards on page load
document.addEventListener("DOMContentLoaded", fetchAndPopulateCards);
