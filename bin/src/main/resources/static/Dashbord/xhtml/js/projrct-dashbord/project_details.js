// Function to fetch all projects and populate the table
async function fetchProjects() {
    try {
        // Send a GET request to the API to fetch all projects
        const response = await fetch(`${API_BASE_URL}/api/project/allProjects`);

        // Check if the response is successful (status 200-299)
        if (response.ok) {
            // Parse the JSON response
            const projects = await response.json();

            // Log the response to verify its structure
            // console.log(projects);

            // Get the table body element
            const tableBody = document.querySelector('#projects tbody');

            // Clear the existing table rows before adding new ones
            tableBody.innerHTML = '';

            // Loop through the projects and add each project to the table
            projects.forEach(async (project) => {
                const row = document.createElement('tr');

                // Create table cells for each project field
                const idCell = document.createElement('td');
                idCell.textContent = project.id || 'N/A'; // Fallback if id is missing
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = project.name || 'No name'; // Fallback if name is missing
                row.appendChild(nameCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = project.status || 'No status'; // Fallback if status is missing
                row.appendChild(statusCell);

                // Extract client and manager names from the respective objects
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
                descriptionCell.textContent = project.description || 'No description'; // Fallback if description is missing
                row.appendChild(descriptionCell);

                const startDateCell = document.createElement('td');
                startDateCell.textContent = project.startDate || 'Not available'; // Fallback if startDate is missing
                row.appendChild(startDateCell);

                // Create the "View Photo" button and add it to the row
                const viewPhotoCell = document.createElement('td');
                const viewPhotoBtn = document.createElement('button');
                viewPhotoBtn.textContent = 'View Photo';
                viewPhotoBtn.classList.add('btn', 'btn-primary');

                // Add an event listener to open the photo modal
                viewPhotoBtn.addEventListener('click', () => openPhotoPopup(project.id));

                viewPhotoCell.appendChild(viewPhotoBtn);
                row.appendChild(viewPhotoCell);

                // Create the "View Materials" button and add it to the row
                const viewMaterialsCell = document.createElement('td');
                const viewMaterialsBtn = document.createElement('button');
                viewMaterialsBtn.textContent = 'View Materials';
                viewMaterialsBtn.classList.add('btn', 'btn-info');

                // Add an event listener to fetch and show the materials in a popup
                viewMaterialsBtn.addEventListener('click', async () => {
                    // Fetch the materials for the project
                    try {
                        const materialsResponse = await fetch(`${API_BASE_URL}/api/vendors/${project.id}/requirments`);
                        if (materialsResponse.ok) {
                            const materials = await materialsResponse.json();
                            // Pass materials to the popup function
                            openMaterialPopup(materials);
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
function openPhotoPopup(projectId) {
    // Fetch the project photo
    fetch(`${API_BASE_URL}/api/project/${projectId}/image`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to confirm image');
            }
            return response.blob();
        })
        .then(blob => {
            // Convert the blob to an object URL for the image
            const imageUrl = URL.createObjectURL(blob);

            // Fetch the photo status for this project
            fetch(`${API_BASE_URL}/api/project/${projectId}/photo-status`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch photo status');
                    }
                    return response.text();  // The response will be the photo status as plain text
                })
                .then(photoStatus => {
                    // Create the modal container for the popup
                    const modalContainer = document.createElement('div');
                    modalContainer.id = 'photoModal';
                    modalContainer.style.position = 'fixed';
                    modalContainer.style.color = 'hsla(253, 98.20%, 44.70%, 0.50)';
                    modalContainer.style.top = '0';
                    modalContainer.style.left = '0';
                    modalContainer.style.width = '100%';
                    modalContainer.style.height = '100%';
                    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    modalContainer.style.display = 'flex';
                    modalContainer.style.justifyContent = 'center';
                    modalContainer.style.alignItems = 'center';
                    modalContainer.style.zIndex = '1000';

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

                    // Close button to remove the modal
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
// Function to open the material details popup
function openMaterialPopup(materials) {
    // Create the modal container for materials
    const modalContainer = document.createElement('div');
    modalContainer.id = 'materialModal';
    modalContainer.style.position = 'fixed';
    modalContainer.style.color = 'hsla(253, 98.20%, 44.70%, 0.50)';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    // modalContainer.style.zIndex = '1000';
    modalContainer.style.zIndex = '1000';

    // Loop through all materials to create the content of the modal
    const materialList = materials.map(material => `
        <tr>
            <td>${material.materialDetails.materialName}</td>
            <td>${material.materialDetails.quantity}</td>
            <td>${material.materialDetails.quality}</td>
        </tr>
    `).join('');

    modalContainer.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; position: relative; width: 600px;">
            <h4>Material Details</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Material Name</th>
                        <th>Quantity</th>
                        <th>Quality</th>
                    </tr>
                </thead>
                <tbody>
                    ${materialList}
                </tbody>
            </table>
            <button id="closeMaterialModalBtn" class="btn btn-secondary">Close</button>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Close button to remove the modal
    modalContainer.querySelector("#closeMaterialModalBtn").addEventListener("click", () => {
        document.body.removeChild(modalContainer);
    });
}


// Call fetchProjects function when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
