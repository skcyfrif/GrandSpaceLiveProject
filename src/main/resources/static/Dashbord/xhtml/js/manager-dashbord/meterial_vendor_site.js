document.addEventListener("DOMContentLoaded", function () {
    // const API_BASE_URL = "http://localhost:9090";

    // Set Vendor ID from session storage
    const vendorIdFromSession = sessionStorage.getItem("userId");
    if (vendorIdFromSession) {
        document.getElementById("managerId").value = vendorIdFromSession;
    } else {
        alert("Vendor ID is missing in session storage!");
        console.error("Vendor ID not found in session storage.");
    }

    // Retrieve token from session storage
    const token = sessionStorage.getItem("authToken"); // assuming the token is stored as 'authToken'
    if (!token) {
        alert("Authentication token is missing in session storage.");
        console.error("Token not found in session storage.");
    }

    // Array to hold the material data
    const materials = [];

    // Add material button functionality
    const addMaterialButton = document.getElementById("addMaterial");
    const materialTableBody = document.querySelector("#materialTable tbody");

    addMaterialButton.addEventListener("click", function () {
        const materialName = document.getElementById("materialName").value.trim();
        const materialQuantity = document.getElementById("materialQuantity").value.trim();
        const materialQuality = document.getElementById("materialQuality").value.trim();

        // Validate the material details before adding
        if (!materialName || !materialQuantity || !materialQuality) {
            alert("Please fill in all material details before adding.");
            return;
        }

        // Add material to the list
        const material = { materialName, quantity: materialQuantity, quality: materialQuality };
        materials.push(material);

        // Add material to the table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${materialName}</td>
            <td>${materialQuantity}</td>
            <td>${materialQuality}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm removeMaterial">Remove</button>
            </td>
        `;
        materialTableBody.appendChild(newRow);

        // Clear input fields after adding
        document.getElementById("materialName").value = "";
        document.getElementById("materialQuantity").value = "";
        document.getElementById("materialQuality").value = "";

        // Remove material from the list and table
        newRow.querySelector(".removeMaterial").addEventListener("click", function () {
            const rowIndex = Array.from(materialTableBody.children).indexOf(newRow);
            materials.splice(rowIndex, 1); // Remove material from the list
            materialTableBody.removeChild(newRow); // Remove row from the table
        });
    });

    // Handle form submission
    const form = document.getElementById("materialForm");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const managerId = document.getElementById("managerId").value;
        const projectId = document.getElementById("projectId").value;
        const lastDate = document.getElementById("lastDate").value;

        // Validate required fields before submission
        if (!managerId || !projectId || !lastDate || materials.length === 0) {
            alert("Please complete all fields and add at least one material.");
            return;
        }

        // Prepare the request payload
        const requestData = {
            managerId: managerId,
            projectId: projectId,
            lastDate: lastDate,
            materialDetails: materials, // Store the materials array here
        };

        try {
            // Send the data to the API with the token included in headers
            const response = await fetch(`${API_BASE_URL}/api/vendors/meterials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Pass the token here
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                alert("Material data sent successfully!");
                form.reset();
                materialTableBody.innerHTML = ""; // Clear the material table
                materials.length = 0; // Reset the materials list
                document.getElementById("managerId").value = vendorIdFromSession; // Reset manager ID
            } else {
                alert("Failed to send material data.");
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            alert("An error occurred while sending the data.");
            console.error("Error:", error);
        }
    });
});
