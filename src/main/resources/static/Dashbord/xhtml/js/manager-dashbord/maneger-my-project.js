// Function to fetch and populate project data
async function fetchAndPopulateTable() {
    const managerId = sessionStorage.getItem("userId");

    if (!managerId) {
        console.error("Manager ID not found in sessionStorage.");
        return;
    }

    const apiUrl = `${API_BASE_URL}/api/project/manager/${managerId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const projects = await response.json();
        const tableBody = document.getElementById("projectTableBody");
        tableBody.innerHTML = ""; // Clear existing table rows

        projects.forEach((project) => {
            const showActionButtons = project.status === "ASSIGNED"; // ✅ Show buttons only if status is "ASSIGNED"

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${project.projectCode || "N/A"}</td>
                <td>${project.name || "N/A"}</td>
                <td>${project.status || "N/A"}</td>
                <td>${project.areaInSquareFeet || "N/A"}</td>
                <td>${project.client.email || "N/A"}</td>
                <td>${project.client.phone || "N/A"}</td>
                <td>
                    <button class="upload-btn" data-project-id="${project.id}">Upload Image</button>
                    <input type="file" class="file-input" style="display:none" />
                </td>
                <td>
                    ${showActionButtons ? `
                        <button class="btn btn-success accept-btn" data-project-id="${project.id}">Accept</button>
                        <button class="btn btn-danger deny-btn" data-project-id="${project.id}">Deny</button>
                    ` : ""}
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Attach event listeners AFTER adding rows
        attachEventListeners();

    } catch (error) {
        console.error("Error fetching and populating table:", error);
    }
}

// ✅ Function to attach event listeners to buttons
function attachEventListeners() {
    document.querySelectorAll(".accept-btn").forEach(button => {
        button.addEventListener("click", function () {
            const projectId = this.getAttribute("data-project-id");
            acceptProject(projectId);
        });
    });

    document.querySelectorAll(".deny-btn").forEach(button => {
        button.addEventListener("click", function () {
            const projectId = this.getAttribute("data-project-id");
            denyProject(projectId);
        });
    });

    document.querySelectorAll(".upload-btn").forEach(button => {
        button.addEventListener("click", function () {
            const fileInput = this.nextElementSibling;
            fileInput.click();
        });

        button.nextElementSibling.addEventListener("change", async function () {
            const projectId = button.getAttribute("data-project-id");
            const file = this.files[0];
            if (file) {
                await uploadImage(projectId, file);
            }
        });
    });
}

// ✅ Function to accept project using POST method
async function acceptProject(projectId) {
    const managerId = sessionStorage.getItem("userId");

    if (!managerId) {
        console.error("Manager ID not found in sessionStorage.");
        alert("Manager ID is missing. Please log in again.");
        return;
    }

    const apiUrl = `${API_BASE_URL}/api/manager/${managerId}/accept-project/${projectId}`;
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    if (!token) {
        console.error("Token not found");
        alert("You are not authorized. Please log in again.");
        return;
    }

    const confirmAction = confirm(`Are you sure you want to accept project ID ${projectId}?`);
    if (!confirmAction) return;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ managerId: managerId, projectId: projectId })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to accept project. Status: ${response.status}. Message: ${errorMessage}`);
        }

        alert(`Project ID ${projectId} accepted successfully!`);
        fetchAndPopulateTable();

    } catch (error) {
        console.error("Error accepting project:", error);
        alert(`Error: ${error.message}`);
    }
}

// ✅ Function to deny project using PUT method
async function denyProject(projectId) {
    const apiUrl = `${API_BASE_URL}/api/project/${projectId}/dispute`;
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    if (!token) {
        console.error("Token not found");
        return;
    }

    const confirmAction = confirm(`Are you sure you want to mark this project as DISPUTE?`);
    if (!confirmAction) return;

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to update status. Status: ${response.status}`);
        }

        alert(`Project marked as DISPUTE successfully!`);
        fetchAndPopulateTable();

    } catch (error) {
        console.error("Error updating project status:", error);
    }
}

// ✅ Function to upload image to the API
async function uploadImage(projectId, file) {
    const formData = new FormData();
    formData.append("photo", file);

    const apiUrl = `${API_BASE_URL}/api/project/${projectId}/uploadPhoto`;
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    if (!token) {
        console.error("Token not found");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload image. Status: ${response.status}`);
        }

        alert("Image uploaded successfully!");
        fetchAndPopulateTable();

    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", fetchAndPopulateTable);
