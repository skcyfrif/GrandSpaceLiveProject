// const questionMapping = {
//     "What is your birth place?": "q1",
//     "Name of your first watch?": "q2",
//     "What is the name of your childhood friend?": "q3",
//     "What is the name of your mother's bestfriend?": "q4",
//     "One of your memorable date?": "q5"
//   };

//   function loadRandomQuestion() {
//     const clientId = document.getElementById('clientId').value.trim();
//     const responseArea = document.getElementById('responseArea');

//     if (!clientId) {
//       responseArea.textContent = 'Please enter a valid Client ID first.';
//       return;
//     }

//     fetch(`http://localhost:9090/api/security-questions/get-random-question/${clientId}`)
//       .then(response => response.ok ? response.json() : Promise.reject('Error fetching question'))
//       .then(data => {
//         const keys = Object.keys(data);
//         if (keys.length > 0) {
//           document.getElementById('questionText').value = keys[0];
//           document.getElementById('questionKey').value = questionMapping[keys[0]] || 'Unknown';
//           responseArea.textContent = 'Question loaded successfully.';
//         } else {
//           responseArea.textContent = 'No question returned.';
//         }
//       })
//       .catch(error => responseArea.textContent = `Error: ${error}`);
//   }

//   document.getElementById('loadQuestionBtn').addEventListener('click', loadRandomQuestion);
//   window.onload = loadRandomQuestion;

//   document.getElementById('submitAnswerBtn').addEventListener('click', function () {
//     const clientId = document.getElementById('clientId').value.trim();
//     const questionKey = document.getElementById('questionKey').value;
//     const answer = document.getElementById('answer').value.trim();
//     const responseArea = document.getElementById('responseArea');
//     const reLoginBtn = document.getElementById('reLoginBtn');

//     if (!clientId || !questionKey || !answer) {
//       responseArea.textContent = 'Please fill all fields.';
//       return;
//     }

//     fetch(`http://localhost:9090/api/security-questions/${clientId}/validate-answer-and-get-next`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ questionNo: questionKey, answer: answer })
//     })
//       .then(response => response.ok ? response.json() : Promise.reject("Log In Again"))
//       .then(data => {
//         responseArea.textContent = data.message;

//         if (data.message === "Answer is correct!") {
//           setTimeout(() => { window.location.reload(); }, 1000); // ✅ Reload if correct
//         } else if (data.message.includes("Log In Again")) {
//           reLoginBtn.style.display = "block"; // ✅ Show re-login button
//         } else if (data.question) {
//           // ✅ Load the next random question if the answer is wrong
//           const newQuestionText = Object.keys(data.question)[0];
//           document.getElementById('questionText').value = newQuestionText;
//           document.getElementById('questionKey').value = questionMapping[newQuestionText] || 'Unknown';
//           responseArea.textContent += "\nNew question loaded. Try again.";
//         }
//       })
//       .catch(() => {
//         responseArea.textContent = "Session expired. Please re-login.";
//         reLoginBtn.style.display = "block";
//       });
//   });
