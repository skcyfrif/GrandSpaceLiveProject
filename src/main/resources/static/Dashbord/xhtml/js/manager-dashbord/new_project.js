document.addEventListener("DOMContentLoaded", async function () {
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage");
        alert("You are not logged in. Please log in first.");
        return;
    }

    try {
        // Fetch all awaiting estimates projects from last year
        const response = await fetch(`${API_BASE_URL}/api/project/awaiting-estimates-last-year`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const projects = await response.json();

        if (!Array.isArray(projects) || projects.length === 0) {
            console.warn("No projects found");
            return;
        }

        const projectContainer = document.getElementById("project-container");
        projectContainer.innerHTML = ""; // Clear previous content

        // Loop through projects and fetch redesign details for each
        for (const project of projects) {
            const projectDetails = await fetchProjectRedesignDetails(project.id);

            const projectCard = `
                <div class="col-xl-3 col-xxl-4 col-lg-4 col-sm-6" data-project-id="${project.id}">
                    <div class="card user-card">
                        <div class="card-body pb-0">
                            <div class="d-flex mb-3 align-items-center">
                                <div class="dz-media me-3">
                                    <img src="${project.photo || 'images/gs-vender-image.jpg'}" alt="Project Image">
                                </div>
                                <div>
                                    <h5 class="title mb-0">
                                        <a href="javascript:void(0);" class="project-details-btn" data-project-id="${project.id}">
                                            ${project.name}
                                        </a>
                                    </h5>
                                    <span class="text-primary">Project Id: ${project.id}</span>
                                </div>
                            </div>

                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <span class="mb-0 title">Registration Date</span> :
                                    <span class="text-black ms-2">${project.registrationDate || "N/A"}</span>
                                </li>
                                <li class="list-group-item">
                                    <span class="mb-0 title">Bid Type</span> :
                                    <span class="text-black ms-2">${project.status || "Bid"}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="card-footer">
                            <a href="javascript:void(0);" class="btn btn-outline-success btn-xs mb-1"
                                data-bs-toggle="modal" data-bs-target="#sendMessageModal">Message</a>
                            <a href="javascript:void(0);" class="btn btn-outline-danger btn-xs mb-1 cancel-bid"
                                data-project-id="${project.id}">Cancel Bid</a>
                            <a href="javascript:void(0);" class="btn btn-outline-warning btn-xs project-details-btn"
                                data-bs-toggle="modal" data-bs-target="#projectDetailsModal"
                                data-project-id="${project.id}">Project Details</a>
                        </div>
                    </div>
                </div>`;

            projectContainer.innerHTML += projectCard;
        }

        // Handle "Project Details" button click
        document.querySelectorAll(".project-details-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const projectId = this.getAttribute("data-project-id");
                sessionStorage.setItem("selectedProjectId", projectId);

                await fetchProjectDetails(projectId);
                fetchVendorDetails(); // Fetch vendor details
            });
        });

        // Handle "Cancel Bid" button click
        document.querySelectorAll(".cancel-bid").forEach(button => {
            button.addEventListener("click", function () {
                const projectId = this.getAttribute("data-project-id");
                if (confirm(`Are you sure you want to cancel the bid for project ID ${projectId}?`)) {
                    alert(`Bid for project ID ${projectId} canceled successfully!`);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching project data:", error);
    }
});

// Function to fetch project redesign details
async function fetchProjectRedesignDetails(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/project/${projectId}/redesign-details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching redesign details for project ${projectId}:`, error);
        return {};
    }
}

// Function to fetch selected project details when modal is opened
async function fetchProjectDetails(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/project/${projectId}/redesign-details`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("authToken") || localStorage.getItem("authToken")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const projectData = await response.json();

        if (!Array.isArray(projectData) || projectData.length === 0) {
            console.error("Invalid project data format.");
            return;
        }

        const projectDetails = projectData[0];
        const project = projectDetails.project;

        document.getElementById("projectName").innerText = projectDetails.projectName || project?.name || "N/A";
        document.getElementById("scopeOfWork").innerText = projectDetails.scopeOfWork || "N/A";
        document.getElementById("clientRequirements").innerText = projectDetails.clientKeyRequirements || "N/A";
        document.getElementById("submissionDeadline").innerText = projectDetails.submissionDeadline || "N/A";

    } catch (error) {
        console.error("Error fetching project details:", error);
    }
}

// ✅ Fetch Vendor (Manager) Details
async function fetchVendorDetails() {
    const managerId = sessionStorage.getItem("userId") || localStorage.getItem("managerId");
    if (!managerId) {
        console.error("No manager ID found.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/manager/${managerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("vendorId").innerText = data.id || "N/A";
        document.getElementById("vendorName").innerText = `${data.firstName} ${data.lastName}` || "N/A";
        document.getElementById("vendorPhone").innerText = data.phone || "N/A";
        document.getElementById("vendorEmail").innerText = data.email || "N/A";
    } catch (error) {
        console.error("Error fetching vendor details:", error);
    }
}

// ✅ Handle Submit Bid Button
document.addEventListener("click", async function (event) {
    if (event.target.id === "submitEstimateBtn") {
        console.log("Submit button clicked");

        const projectId = sessionStorage.getItem("selectedProjectId");
        const estimatedBudget = document.getElementById("estimateAmount").value;
        const managerId = sessionStorage.getItem("userId") || localStorage.getItem("managerId");

        console.log(`Project ID: ${projectId}`);
        console.log(`Estimated Budget: ${estimatedBudget}`);
        console.log(`Manager ID: ${managerId}`);

        if (!projectId || !estimatedBudget || !managerId) {
            alert("Please enter all details before submitting.");
            return;
        }

        const requestBody = {
            managerId: managerId,
            estimatedBudget: parseFloat(estimatedBudget) 
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/projectS/${projectId}/budget/submit`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken") || localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            console.log("Server Response:", responseData);

            if (response.ok) {
                alert("Estimate submitted successfully.");

                // ✅ Remove project card from UI
                const projectCardElement = document.querySelector(`[data-project-id="${projectId}"]`);
                if (projectCardElement) {
                    projectCardElement.remove();
                }

                // ✅ Close Vendor Details popup automatically
                const vendorDetailsModal = document.getElementById("vendorDetailsModal");
                if (vendorDetailsModal) {
                    let modalInstance = bootstrap.Modal.getInstance(vendorDetailsModal);
                    if (modalInstance) {
                        modalInstance.hide(); // Close modal
                    }
                }

                // ✅ Show message if no projects remain
                if (document.getElementById("project-container").children.length === 0) {
                    document.getElementById("project-container").innerHTML = "<p>No projects requiring estimates found.</p>";
                }

            } else {
                alert(`Error: ${responseData.message || "Failed to submit estimate."}`);
            }

        } catch (error) {
            console.error("Error submitting estimate:", error);
            alert("An error occurred. Please try again.");
        }
    }
});

