document.querySelector(".gs_Project_button.next-btn").addEventListener("click", async () => {
    // Get the client ID and bearer token from the session storage
    const clientId = sessionStorage.getItem("userId");
    const bearerToken = sessionStorage.getItem("authToken"); // Ensure the token is stored in sessionStorage with this key

    if (!clientId) {
        alert("Client ID is missing from the session. Please log in again.");
        return;
    }

    if (!bearerToken) {
        alert("Authorization token is missing. Please log in again.");
        return;
    }

    // Set the client ID in the hidden input field
    document.getElementById("clientId").value = clientId;

    // Collect form data
    const projectDetails = {
        clientId: clientId,
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        areaInSquareFeet: document.getElementById("areaInSquareFeet").value.trim(),
        budget: document.getElementById("budget").value.trim()
    };

    // Validate required fields
    if (!projectDetails.name || !projectDetails.areaInSquareFeet || !projectDetails.budget) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        // Send POST request
        const response = await fetch(`${API_BASE_URL}/api/project/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearerToken}` // Include the bearer token in the Authorization header
            },
            body: JSON.stringify(projectDetails)
        });

        if (response.ok) {
            const responseData = await response.json();
            alert("Project submitted successfully!");
            // console.log("Response:", responseData);

            // Redirect to client-project-details.html
            window.location.href = "client-project-details.html";
        } else {
            const errorData = await response.json();
            alert(`Failed to submit project: ${errorData.message || "Unknown error"}`);
            console.error("Error response:", errorData);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the project. Please try again.");
    }
});
