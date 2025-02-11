document.getElementById('submitBtn').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.getElementById('registrationForm');
    if (!form.checkValidity()) {
        alert("Please fill out all required fields.");
        return;
    }

    // Prepare the request body
    const formData = {
        role: document.getElementById('role').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        experience: document.getElementById('experience').value,
        qualifications: document.getElementById('qualifications').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('flashMessage').innerHTML =
                `<div class="alert alert-success">Registration successful!</div>`;
                setTimeout(() => {
                    window.location.href = "gs-login.html";
                }, 2000);
            form.reset();
        } else {
            document.getElementById('flashMessage').innerHTML =
                `<div class="alert alert-danger">${result.message || "Registration failed."}</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('flashMessage').innerHTML =
            `<div class="alert alert-danger">Error submitting form.</div>`;
    }
});
