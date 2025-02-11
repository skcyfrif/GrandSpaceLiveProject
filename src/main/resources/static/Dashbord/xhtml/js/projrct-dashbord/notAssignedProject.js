document.addEventListener("DOMContentLoaded", function () {
    // const API_BASE_URL = "http://localhost:9090"; // Replace with actual base URL
    // const API_BASE_URL = "https://grandspace.co.in"; // Replace with actual base URL
    const notAssignedProject = document.getElementById("notAssignedProject");
    let selectedProjectId = null; // Store the selected project ID

    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        console.error("No token found in sessionStorage. Authorization required.");
        if (notAssignedProject) notAssignedProject.textContent = "Unauthorized";
        return;
    }

    // Fetch the total unassigned project count
    fetch(`${API_BASE_URL}/api/project/projects/un-publish/count`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (notAssignedProject) notAssignedProject.textContent = data; // Update UI with count
    })
    .catch(error => {
        console.error("Error fetching project count:", error);
        if (notAssignedProject) notAssignedProject.textContent = "Error";
    });

    // Fetch all projects and update the table
    async function fetchProjects() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/project/un-publish-projects`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
            }

            const projects = await response.json();
            const tbody = document.querySelector("#projects tbody");
            tbody.innerHTML = ""; // Clear existing table rows

            projects.forEach(project => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.status}</td>
                    <td>${project.client.firstName}</td>
                    <td>${project.assignedManager || "Not Assigned"}</td>
                    <td>${project.description}</td>
                    <td>${project.registrationDate}</td>
                    <td>
                        <button class="btn btn-danger delete-btn" data-id="${project.id}">Delete</button>
                        <button class="btn btn-primary publish-btn" data-id="${project.id}">Publish</button>
                    </td>
                `;

                tbody.appendChild(row);
            });

            // Attach event listeners for delete buttons
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const projectId = this.getAttribute("data-id");
                    deleteProject(projectId);
                });
            });

            // Attach event listeners for publish buttons
            document.querySelectorAll(".publish-btn").forEach(button => {
                button.addEventListener("click", function () {
                    selectedProjectId = this.getAttribute("data-id");
                    openModal(selectedProjectId);
                });
            });

        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    // Open modal and prefill project details
    function openModal(projectId) {
        fetch(`${API_BASE_URL}/api/project/${projectId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(project => {
            document.getElementById("projectName").value = project.name;
        })
        .catch(error => console.error("Error fetching project details:", error));

        // Show the modal using Bootstrap
        const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
        modal.show();
    }

    // Function to delete a project
    async function deleteProject(projectId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/project/delete/${projectId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Project deleted successfully");
                fetchProjects(); // Refresh table
            } else {
                alert("Error deleting project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }

    // Function to publish a project (Submit redesign details)
    async function publishProject() {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }

        // Retrieve form values
        const projectName = document.getElementById("projectName").value.trim();
        const scopeOfWork = document.getElementById("scopeOfWork").value.trim();
        const clientKeyRequirements = document.getElementById("clientKeyRequirements").value.trim();
        const submissionDeadline = document.getElementById("submissionDeadline").value;

        // Construct the request body
        const requestBody = {
            projectName: projectName,
            scopeOfWork: scopeOfWork,
            clientKeyRequirements: clientKeyRequirements,
            submissionDeadline: submissionDeadline
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/project/${selectedProjectId}/redesign`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody) // Convert data to JSON format
            });

            if (response.ok) {
                alert("Project submitted for redesign successfully");
                window.location.reload(); // Refresh the page
            } else {
                alert("Error submitting redesign request");
            }
        } catch (error) {
            console.error("Error submitting redesign request:", error);
        }
    }

    // Handle "Submit Project Details" button click
    document.getElementById("submitProjectDetails").addEventListener("click", publishProject);

    // Fetch projects on page load
    fetchProjects();
});


/////////////////////


// document.addEventListener("DOMContentLoaded", function () {
//     // const API_BASE_URL = "http://localhost:9090"; // Replace with actual base URL
//     const notAssignedProject = document.getElementById("notAssignedProject");

//     // Retrieve token from sessionStorage
//     const token = sessionStorage.getItem("authToken");

//     if (!token) {
//         console.error("No token found in sessionStorage. Authorization required.");
//         notAssignedProject.textContent = "Unauthorized";
//         return;
//     }

//     // Fetch the total unassigned project count
//     fetch(`${API_BASE_URL}/api/project/projects/un-publish/count`, {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         notAssignedProject.textContent = data; // Update UI with count
//     })
//     .catch(error => {
//         console.error("Error fetching project count:", error);
//         notAssignedProject.textContent = "Error";
//     });
// });

// // Function to fetch all projects and update the table
// document.addEventListener("DOMContentLoaded", function () {
//     async function fetchProjects() {
//         // const API_BASE_URL = "http://localhost:9090";
//         const token = sessionStorage.getItem("authToken");

//         if (!token) {
//             console.error("No token found in sessionStorage. Authorization required.");
//             return;
//         }

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/project/un-publish-projects`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
//             }

//             const projects = await response.json();
//             const tbody = document.querySelector("#projects tbody");
//             tbody.innerHTML = ""; // Clear existing table rows

//             projects.forEach(project => {
//                 const row = document.createElement("tr");

//                 row.innerHTML = `
//                     <td>${project.id}</td>
//                     <td>${project.name}</td>
//                     <td>${project.status}</td>
//                     <td>${project.clientName}</td>
//                     <td>${project.assignedManager || "Not Assigned"}</td>
//                     <td>${project.description}</td>
//                     <td>${project.registrationDate}</td>
//                     <td>
//                         <button class="btn btn-danger delete-btn" data-id="${project.id}">Delete</button>
//                         <button class="btn btn-primary publish-btn" data-id="${project.id}">Publish</button>
//                     </td>
//                 `;

//                 tbody.appendChild(row);
//             });

//             // Attach event listeners for delete buttons
//             document.querySelectorAll(".delete-btn").forEach(button => {
//                 button.addEventListener("click", function () {
//                     const projectId = this.getAttribute("data-id");
//                     deleteProject(projectId);
//                 });
//             });

//             // Attach event listeners for publish buttons
//             document.querySelectorAll(".publish-btn").forEach(button => {
//                 button.addEventListener("click", function () {
//                     const projectId = this.getAttribute("data-id");
//                     publishProject(projectId);
//                 });
//             });
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         }
//     }

//     // Function to delete a project
//     async function deleteProject(projectId) {
//         // const API_BASE_URL = "http://localhost:9090";
//         const token = sessionStorage.getItem("authToken");

//         if (!token) {
//             console.error("No token found in sessionStorage. Authorization required.");
//             return;
//         }

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/project/delete/${projectId}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.ok) {
//                 alert("Project deleted successfully");
//                 fetchProjects(); // Refresh table
//             } else {
//                 alert("Error deleting project");
//             }
//         } catch (error) {
//             console.error("Error deleting project:", error);
//         }
//     }

//     // Function to publish a project
//     async function publishProject(projectId) {
//         // const API_BASE_URL = "http://localhost:9090";
//         const token = sessionStorage.getItem("authToken");

//         if (!token) {
//             console.error("No token found in sessionStorage. Authorization required.");
//             return;
//         }

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/project/${projectId}/assign-to-managers`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.ok) {
//                 alert("Project published successfully");
//                 fetchProjects(); // Refresh table
//             } else {
//                 alert("Error publishing project");
//             }
//         } catch (error) {
//             console.error("Error publishing project:", error);
//         }
//     }

//     // Fetch projects on page load
//     fetchProjects();
// });
