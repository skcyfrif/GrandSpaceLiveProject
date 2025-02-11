// Function to fetch and populate project data
async function fetchAndPopulateTable() {
    const managerId = sessionStorage.getItem("userId"); // Retrieve manager ID from sessionStorage

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

        const projects = await response.json(); // Assuming the API returns an array of projects

        const tableBody = document.getElementById("projectTableBody");
        tableBody.innerHTML = ""; // Clear existing table rows

        projects.forEach((project) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${project.id || "N/A"}</td>
                <td>${project.name || "N/A"}</td>
                <td>${project.status || "N/A"}</td>
                <td>${project.areaInSquareFeet || "N/A"}</td>
                <td>${project.client.email || "N/A"}</td>
                <td>${project.client.phone || "N/A"}</td>
                <td>
                    <button class="upload-btn" data-project-id="${project.id}">Upload Image</button>
                    <input type="file" class="file-input" style="display:none" />
                </td>
            `;

            // Add event listener to the upload button
            const uploadBtn = row.querySelector(".upload-btn");
            const fileInput = row.querySelector(".file-input");

            uploadBtn.addEventListener("click", function () {
                fileInput.click(); // Trigger file input click when button is clicked
            });

            // Add event listener to file input
            fileInput.addEventListener("change", async function () {
                const file = fileInput.files[0];
                if (file) {
                    await uploadImage(project.id, file); // Call the function to upload the image
                }
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching and populating table:", error);
    }
}

// Function to upload image to the API
async function uploadImage(projectId, file) {
    const formData = new FormData();
    formData.append("photo", file); // Append the selected file to the form data

    const apiUrl = `${API_BASE_URL}/api/project/${projectId}/uploadPhoto`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload image. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Image uploaded successfully:", result);

        // Display success message
        showSuccessMessage("Image uploaded successfully!");

        // Optionally, refresh the table to show the newly uploaded image
        fetchAndPopulateTable();
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

// Function to show success message
function showSuccessMessage(message) {
    const successMessageContainer = document.getElementById("successMessageContainer");

    if (successMessageContainer) {
        successMessageContainer.textContent = message;
        successMessageContainer.style.display = "block"; // Show the success message

        // Hide the success message after 3 seconds
        setTimeout(() => {
            successMessageContainer.style.display = "none";
        }, 3000);
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchAndPopulateTable);
