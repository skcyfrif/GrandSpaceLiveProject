// Question to Key mapping
const questionMapping = {
    "What is your birth place?": "q1",
    "Name of your first watch?": "q2",
    "What is the name of your childhood friend?": "q3",
    "What is the name of your mother's bestfriend?": "q4",
    "One of your memorable date?": "q5"
};

// Listen for form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Create the payload
    const payload = { email: email, password: password };

    console.log("Submitting login form with payload:", payload);

    fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            console.log("Response Status:", response.status);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Invalid login credentials, status code: " + response.status);
            }
        })
        .then((data) => {
            console.log("API Response Data:", data);

            const jwtToken = data["jwt-token"]; // Assuming the token key is 'jwt-token'
            if (!jwtToken) {
                throw new Error("JWT token is missing from the response");
            }

            // Store the token in session storage
            sessionStorage.setItem("authToken", jwtToken);

            // Decode the token to extract user details
            const decodedPayload = parseJwt(jwtToken);
            if (!decodedPayload) {
                throw new Error("Invalid JWT token");
            }

            const userRole = decodedPayload.role; // Assuming 'role' is the claim key
            const userId = decodedPayload.id; // Assuming 'id' is the claim key

            sessionStorage.setItem("userRole", userRole);
            sessionStorage.setItem("userId", userId);

            console.log("User Role:", userRole);
            console.log("User ID:", userId);

            // Show success message before modal popup
            showFlashMessage("Login Successful!", "success");

            // Delay modal display to allow flash message visibility
            if (userRole === 'CLIENT') {
                setTimeout(() => {
                    showSecurityQuestionModal(userId); // Fetch security question after login
                }, 1500);
            } else if (userRole === "MANAGER") {
                window.location.href = "Dashbord/xhtml/manegerdashbord.html";
            } else if (userRole === "ADMIN") {
                window.location.href = "Dashbord/xhtml/index2.html";
            } else {
                alert("Invalid user role. Please contact support.");
            } // Delay modal popup for 1.5 seconds
        })

        .catch((error) => {
            console.error("Error during login:", error);
            showFlashMessage("Invalid Email or Password", "error");
        });
});

// Function to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64)); // Decode Base64
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

// Function to show flash messages
function showFlashMessage(message, type) {
    const flashMessage = document.createElement("div");
    flashMessage.className = `alert ${type === "error" ? "alert-danger" : "alert-success"} position-fixed top-0 start-50 translate-middle-x mt-3`;
    flashMessage.style.zIndex = "1055";
    flashMessage.innerText = message;

    document.body.appendChild(flashMessage);

    // Remove the flash message after 2 seconds
    setTimeout(() => {
        flashMessage.remove();
    }, 2000);
}

// Function to show Security Question Modal
function showSecurityQuestionModal(clientId) {
    const questionText = document.getElementById('questionText');
    const questionKey = document.getElementById('questionKey');
    const responseArea = document.getElementById('responseArea');
    const answerInput = document.getElementById('answer');
    const reLoginBtn = document.getElementById('reLoginBtn');
    const closeBtn = document.getElementById('closeBtn');
    const skipBtn = document.getElementById('skipBtn');
    // Set client ID from session
    document.getElementById('clientId').value = clientId;

    // Fetch random question
    fetch(`${API_BASE_URL}/api/security-questions/get-random-question/${clientId}`)
        .then(response => response.ok ? response.json() : Promise.reject('Error fetching question'))
        .then(data => {
            const keys = Object.keys(data);
            if (keys.length > 0) {
                const question = keys[0];
                console.log('Fetched Question:', question);  // Log the fetched question for debugging

                // Normalize the question (trim spaces and ensure case consistency)
                const normalizedQuestion = question.trim();

                // Set the question text and key
                questionText.value = normalizedQuestion;
                questionKey.value = questionMapping[normalizedQuestion] || 'Unknown'; // Set the corresponding question key

                responseArea.textContent = 'Question loaded successfully.';
            } else {
                responseArea.textContent = 'No question returned.';
            }

            // Show the modal
            const securityModal = new bootstrap.Modal(document.getElementById("securityQuestionModal"));
            securityModal.show();
        })
        .catch(error => {
            responseArea.textContent = `Error: ${error}`;
        });

    // Handle answer submission
    document.getElementById('submitAnswerBtn').addEventListener('click', function () {
        const questionKeyValue = questionKey.value;
        const answer = answerInput.value.trim();

        if (!clientId || !questionKeyValue || !answer) {
            responseArea.textContent = 'Please fill all fields.';
            return;
        }

        fetch(`${API_BASE_URL}/api/security-questions/${clientId}/validate-answer-and-get-next`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionNo: questionKeyValue, answer: answer })
        })
            .then(response => response.ok ? response.json() : Promise.reject("Error during validation"))
            .then(data => {
                responseArea.textContent = data.message;

                if (data.message === "Answer is correct!") {
                    setTimeout(() => {
                        responseArea.textContent = "All answers correct! Redirecting...";
                        // Hide the security question modal
                        const securityModal = bootstrap.Modal.getInstance(document.getElementById("securityQuestionModal"));
                        securityModal.hide();

                        // Show the calculator modal
                        const calculatorModal = new bootstrap.Modal(document.getElementById("multiPageModal"));
                        calculatorModal.show();
                    }, 1000); // Wait for 1 second before showing the calculator modal
                } else if (data.message.includes("Log In Again")) {
                    reLoginBtn.style.display = "block"; // Show re-login button
                } else if (data.question) {
                    // Load new question if the answer is wrong
                    const newQuestionText = Object.keys(data.question)[0];
                    const normalizedNewQuestionText = newQuestionText.trim();
                    // Normalize new question
                    questionText.value = normalizedNewQuestionText;
                    questionKey.value = questionMapping[normalizedNewQuestionText] || 'Unknown';
                    responseArea.textContent += "\nNew question loaded. Try again.";
                }
            })
            .catch(() => {
                responseArea.textContent = "Session expired. Please re-login.";
                reLoginBtn.style.display = "block";
            });
    });

    // Handle re-login button click
    reLoginBtn.addEventListener('click', function () {
        // Use template literal correctly to pass clientId
        fetch(`${API_BASE_URL}/api/security-questions/remove-all-asked-questions/${clientId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: clientId })
        })
            .then(response => {
                if (response.ok) {
                    // If the re-login is successful, redirect to the login page
                    console.log('Re-login successful, redirecting to login page.');
                    window.location.href = 'gs-login.html';
                } else {
                    // Handle any error during the re-login API call
                    return Promise.reject('Re-login failed');
                }
            })
            .catch(error => {
                console.error('Error during re-login:', error);
                responseArea.textContent = 'Re-login failed. Please try again.';
            });
    });
    // Listen for modal close button
    closeBtn.addEventListener("click", function () {
        // Close the modal
        const calculatorModal = bootstrap.Modal.getInstance(document.getElementById("multiPageModal"));
        calculatorModal.hide();

        // Assuming the user role is stored in sessionStorage after login
        const userRole = sessionStorage.getItem("userRole");

        // Redirect based on user role
        redirectToDashboard(userRole);
    });
    skipBtn.addEventListener("click", function () {
        // Close the modal
        const calculatorModal = bootstrap.Modal.getInstance(document.getElementById("multiPageModal"));
        calculatorModal.hide();

        // Assuming the user role is stored in sessionStorage after login
        const userRole = sessionStorage.getItem("userRole");

        // Redirect based on user role
        redirectToDashboard(userRole);
    });

    // Function to redirect to the appropriate dashboard based on user role
    function redirectToDashboard(userRole) {
        if (userRole === "CLIENT") {
            window.location.href = "Dashbord/xhtml/client-dashboard.html";
        } else if (userRole === "MANAGER") {
            window.location.href = "Dashbord/xhtml/manegerdashbord.html";
        } else if (userRole === "ADMIN") {
            window.location.href = "Dashbord/xhtml/index2.html";
        } else {
            alert("Invalid user role. Please contact support.");
        }
    }

}