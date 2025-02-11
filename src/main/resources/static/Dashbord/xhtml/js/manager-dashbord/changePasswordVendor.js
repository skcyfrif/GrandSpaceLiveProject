document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#profile-settings form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get input values
        const email = document.getElementById("email").value.trim();
        const oldPassword = document.getElementById("oldPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();

        // Validate inputs
        if (!email || !oldPassword || !newPassword) {
            alert("All fields are required.");
            return;
        }

        // Prepare request body
        const requestBody = {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            // Send POST request to the change-password API
            const response = await fetch("http://localhost:9090/api/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json(); // Parse JSON response

            if (response.ok) {
                alert("Password changed successfully!");
                form.reset(); // Clear the form
            } else {
                alert(data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
