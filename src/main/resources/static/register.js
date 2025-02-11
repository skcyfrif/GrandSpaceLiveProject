const CLIENT = "CLIENT"; // Define the CLIENT role if not defined yet

// Register User Function
function registerUser() {
    const formData = new FormData(document.getElementById("registrationForm"));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Registration failed!");
        }
    })
    .then((responseData) => {
        const jwtToken = responseData["jwt-token"]; // Assuming the token key is 'jwt-token'
        if (!jwtToken) {
            throw new Error("JWT token is missing from the response");
        }

        // Store the token in session storage
        sessionStorage.setItem("authToken", jwtToken);

        // Decode the token to extract userId and role
        const decodedPayload = parseJwt(jwtToken);
        if (!decodedPayload) {
            throw new Error("Invalid JWT token");
        }

        const userRole = decodedPayload.role; // Assuming 'role' is the claim key for user roles
        const userId = decodedPayload.id; // Assuming 'id' is the claim key for user ID

        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("userId", userId); // Save the user ID

        showFlashMessage("Registration successful! Please answer security questions.", "success");

        // Pre-fill the hidden clientId field
        document.getElementById("clientId").value = userId;

        // Show Security Questions Modal for CLIENT role
        if (userRole === CLIENT) {
            const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
            modal.show();
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        showFlashMessage("An error occurred during registration!", "error");
    });
}

// Function to submit security questions
document.getElementById("submitSecurityQuestions").addEventListener("click", function () {
    const clientId = sessionStorage.getItem("userId"); // Get from sessionStorage
    if (!clientId) {
        showFlashMessage("Client ID is missing! Please register again.", "error");
        return;
    }

    const securityData = {
        clientId: clientId,
        q1Answer: document.getElementById("q1Answer").value,
        q2Answer: document.getElementById("q2Answer").value,
        q3Answer: document.getElementById("q3Answer").value,
        q4Answer: document.getElementById("q4Answer").value,
        q5Answer: document.getElementById("q5Answer").value
    };
    console.log(securityData);

    fetch(`${API_BASE_URL}/api/security-questions/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(securityData),
    })
    .then((response) => {
        console.log(response);
        
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Security questions submission failed!");
        }
    })
    .then((responseData) => {
        showFlashMessage("Security questions saved! Redirecting to login...", "success");

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = "gs-login.html";
        }, 2000);
    })
    .catch((error) => {
        console.error("Error:", error);
        showFlashMessage("An error occurred while saving security questions!", "error");
    });
});

// Function to parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1]; // Extract payload part
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64)); // Decode Base64 to JSON
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

// Function to show flash messages
function showFlashMessage(message, type) {
    const flashMessage = document.getElementById("flashMessage");
    flashMessage.textContent = message;
    flashMessage.className = `flash-message ${type === "error" ? "error" : ""}`;
    flashMessage.style.display = "block";

    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 3000);
}

// Pre-fill the hidden clientId field when the page loads
document.addEventListener("DOMContentLoaded", function () {
    const clientId = sessionStorage.getItem("userId");
    if (clientId) {
        document.getElementById("clientId").value = clientId;
    }
});



// document.getElementById("submitBtn").addEventListener("click", function () {
//     const formData = new FormData(document.getElementById("registrationForm"));
//     const data = {};
//     formData.forEach((value, key) => {
//         data[key] = value;
//     });

//     fetch(`${API_BASE_URL}/api/register`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     })
//     .then((response) => {
//         if (response.ok) {
//             return response.json(); // Parse the response JSON
//         } else {
//             throw new Error("Registration failed!");
//         }
//     })
//     .then((responseData) => {
//         // console.log("Response Data:", responseData);
//         showFlashMessage("Registration successful! Redirecting to sign-in page...", "success");
        
//         // Redirect to sign-in page after 2 seconds
//         setTimeout(() => {
//             window.location.href = "gs-login.html";
//         }, 2000);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//         showFlashMessage("An error occurred during registration!", "error");
//     });
// });

// function showFlashMessage(message, type) {
//     const flashMessage = document.getElementById("flashMessage");
//     flashMessage.textContent = message;
//     flashMessage.className = `flash-message ${type === "error" ? "error" : ""}`;
//     flashMessage.style.display = "block";

//     // Hide the message after 3 seconds
//     setTimeout(() => {
//         flashMessage.style.display = "none";
//     }, 3000);
// }
