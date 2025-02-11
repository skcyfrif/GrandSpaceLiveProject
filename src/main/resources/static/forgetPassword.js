// function resetPassword() {
//     const email = document.getElementById("email").value;
//     const message = document.getElementById("message");

//     if (!email) {
//         message.textContent = "Please enter your email.";
//         message.style.color = "red";
//         return;
//     }

//     fetch(`http://localhost:9090/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Response Data:", data); // Debugging line
    
//         if (data.success) {
//             message.textContent = "OTP sent successfully. Check your email.";
//             message.style.color = "green";
//             document.getElementById("otpBox").style.display = "block";
//         } else {
//             message.textContent = data.message || "Failed to send OTP.";
//             message.style.color = "red";
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         message.textContent = "An error occurred. Please try again.";
//         message.style.color = "red";
//     });
    
// }
