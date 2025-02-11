// URL to fetch all project data
// const API_BASE_URL = "http://localhost:9090"; // Replace with actual base URL

// Function to fetch the Bearer token from sessionStorage
function getAuthToken() {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
        console.error("No token found. Please log in.");
    }
    return token;
}

// Function to fetch all projects and populate the table
async function fetchProjects() {
    const token = getAuthToken();
    if (!token) return;

    try {
        // Send a GET request to the API to fetch all projects
        const response = await fetch(`${API_BASE_URL}/api/project/allProjects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is successful (status 200-299)
        if (response.ok) {
            // Parse the JSON response
            const projects = await response.json();

            // Get the table body element
            const tableBody = document.querySelector('#projects tbody');

            // Clear the existing table rows before adding new ones
            tableBody.innerHTML = '';

            // Loop through the projects and add each project to the table
            projects.forEach(async (project) => {
                const row = document.createElement('tr');

                // Create table cells for each project field
                const idCell = document.createElement('td');
                idCell.textContent = project.projectCode || 'N/A';
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = project.name || 'No name';
                row.appendChild(nameCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = project.status || 'No status';
                row.appendChild(statusCell);

                // Extract client and manager names
                const clientName = project.client ? `${project.client.firstName}` : 'Unknown Client';
                const managerName = project.manager ? `${project.manager.firstName}` : 'Unknown Manager';

                // Populate client and manager name cells
                const clientCell = document.createElement('td');
                clientCell.textContent = clientName;
                row.appendChild(clientCell);

                const managerCell = document.createElement('td');
                managerCell.textContent = managerName;
                row.appendChild(managerCell);

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = project.description || 'No description';
                row.appendChild(descriptionCell);

                const startDateCell = document.createElement('td');
                startDateCell.textContent = project.startDate || 'Not available';
                row.appendChild(startDateCell);

                // Create the "View Photo" button and add it to the row
                const viewPhotoCell = document.createElement('td');
                const viewPhotoBtn = document.createElement('button');
                viewPhotoBtn.textContent = 'View Photo';
                viewPhotoBtn.classList.add('btn', 'btn-primary');

                // Add an event listener to open the photo modal
                viewPhotoBtn.addEventListener('click', () => openPhotoPopup(project.id, token));

                viewPhotoCell.appendChild(viewPhotoBtn);
                row.appendChild(viewPhotoCell);

                // Create the "View Materials" button and add it to the row
                const viewMaterialsCell = document.createElement('td');
                const viewMaterialsBtn = document.createElement('button');
                viewMaterialsBtn.textContent = 'View Materials';
                viewMaterialsBtn.classList.add('btn', 'btn-info');

                // Add an event listener to fetch and show the materials in a popup
                viewMaterialsBtn.addEventListener('click', async () => {
                    try {
                        const materialsResponse = await fetch(`${API_BASE_URL}/api/vendors/${project.id}/requirments`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,  // Pass the Bearer token here
                                'Content-Type': 'application/json'
                            }
                        });
                        if (materialsResponse.ok) {
                            const vendors = await materialsResponse.json();
                            openMaterialPopup(vendors, project.id, token); // Pass the data and projectId to the popup function
                        } else {
                            alert('No materials found for this project');
                        }
                    } catch (error) {
                        console.error('Error fetching materials:', error);
                        alert('Error fetching materials');
                    }
                });

                viewMaterialsCell.appendChild(viewMaterialsBtn);
                row.appendChild(viewMaterialsCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch projects. Status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Function to open the photo popup
function openPhotoPopup(projectId, token) {
    fetch(`${API_BASE_URL}/api/project/${projectId}/image`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch photo');
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);

            // Fetch the photo status
            fetch(`${API_BASE_URL}/api/project/${projectId}/photo-status`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.text())
                .then(photoStatus => {
                    // Create the modal to display the photo
                    const modalContainer = document.createElement('div');
                    modalContainer.id = 'photoModal';
                    modalContainer.style.position = 'fixed';
                    modalContainer.style.top = '0';
                    modalContainer.style.left = '0';
                    modalContainer.style.width = '100%';
                    modalContainer.style.height = '100%';
                    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    modalContainer.style.display = 'flex';
                    modalContainer.style.justifyContent = 'center';
                    modalContainer.style.alignItems = 'center';

                    modalContainer.innerHTML = `
                        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; position: relative; width: 600px;">
                            <h4>Project Photo</h4>
                            <img src="${imageUrl}" alt="Project Photo" style="width:100%; height:auto;" />
                            <div style="margin-top: 20px;">
                                <p><strong>Verification Status:</strong> ${photoStatus}</p>
                                <button id="closeModalBtn" class="btn btn-secondary">Close</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modalContainer);

                    // Close modal on click
                    modalContainer.querySelector("#closeModalBtn").addEventListener("click", () => {
                        document.body.removeChild(modalContainer);
                    });
                })
                .catch(error => {
                    console.error('Error fetching photo status:', error);
                    alert('Unable to load photo status!');
                });
        })
        .catch(error => {
            console.error('Error fetching project photo:', error);
            alert('Unable to load photo!');
        });
}

// Function to open the material details popup
function openMaterialPopup(vendors, projectId, token) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'materialModal';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';

    const vendorList = vendors.map(vendor => {
        const materialRows = vendor.materialDetails.map(material => `
            <tr>
                <td>${material.materialName}</td>
                <td>${material.quantity}</td>
                <td>${material.quality}</td>
                <td>${material.status}</td>
            </tr>
        `).join('');

        return `
            <div style="margin-bottom: 20px;">
                <h5>Last Date: ${vendor.lastDate}</h5>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th>Material Name</th>
                            <th>Quantity</th>
                            <th>Quality</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${materialRows}
                    </tbody>
                </table>
            </div>
        `;
    }).join('');

    modalContainer.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; width: 700px;">
            <h4>Material Details by Vendor</h4>
            <div style="max-height: 400px; overflow-y: auto;">
                ${vendorList}
            </div>
            <button id="viewMoreBtn" class="btn btn-primary">View More</button>
            <button id="closeMaterialModalBtn" class="btn btn-secondary">Close</button>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Redirect to project_materials.html when "View More" is clicked
    modalContainer.querySelector("#viewMoreBtn").addEventListener("click", () => {
        window.location.href = `project_materials.html?projectId=${projectId}`;
    });

    // Close the material modal
    modalContainer.querySelector("#closeMaterialModalBtn").addEventListener("click", () => {
        document.body.removeChild(modalContainer);
    });
}

// Call fetchProjects function when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
