package com.cyfrifpro.controller;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.ClientSecurityQuestions;
import com.cyfrifpro.request.AnswerValidationRequestDTO;
import com.cyfrifpro.request.ClientSecurityQuestionsRequestDTO;
import com.cyfrifpro.service.ClientSecurityQuestionsService;

@RestController
@RequestMapping("/api/security-questions")
public class ClientSecurityQuestionsController {

	@Autowired
	private ClientSecurityQuestionsService service;

	@GetMapping("/{id}")
	public Map<String, String> getSecurityQuestions(@PathVariable Long id) {
		return service.getSecurityQuestionsForClient(id);
	}

	@PostMapping("/save")
	public ResponseEntity<ClientSecurityQuestions> saveClientSecurityQuestions(
	        @RequestBody ClientSecurityQuestionsRequestDTO requestDTO) {
	    
	    // Call the service method to save the security questions
	    ClientSecurityQuestions savedQuestion = service.saveClientSecurityQuestions(requestDTO);

	    // Print response data in the console
	    System.out.println("Saved Security Questions: " + savedQuestion);

	    // Return the saved client security questions with HTTP 201 Created status
	    return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
	}

	@GetMapping("/get-random-question/{clientId}")
	public ResponseEntity<Map<String, String>> getRandomSecurityQuestion(@PathVariable Long clientId) {
		// Get a random question for the client
		Map<String, String> randomQuestion = service.getRandomSecurityQuestion(clientId);

		// Return the random question as response
		return ResponseEntity.ok(randomQuestion);
	}

	// Endpoint to validate the client's answer
	@PostMapping("/validate-answer")
	public ResponseEntity<Map<String, String>> validateAnswer(@RequestBody AnswerValidationRequestDTO requestDTO) {
		// Validate the provided answer
		boolean isValid = service.validateAnswer(requestDTO.getClientId(), requestDTO.getQuestionNo(),
				requestDTO.getAnswer());

		if (isValid) {
			return ResponseEntity.ok(Collections.singletonMap("message", "Answer is correct!"));
		} else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Collections.singletonMap("message", "Incorrect answer."));
		}
	}

	@PostMapping("/{clientId}/validate-answer-and-get-next")
    public ResponseEntity<Map<String, Object>> validateAnswerAndGetNext(
            @PathVariable Long clientId,
            @RequestBody AnswerValidationRequestDTO requestDTO) {

        // Optionally, you can check that the clientId in the path matches the clientId in the requestDTO.
        // For this example, we use the path variable clientId.
        boolean isValid = service.validateAnswer(clientId, requestDTO.getQuestionNo(), requestDTO.getAnswer());

        Map<String, Object> response = new LinkedHashMap<>();
        if (isValid) {
            response.put("message", "Answer is correct!");
            return ResponseEntity.ok(response);
        } else {
            // If the answer is incorrect, fetch a new random security question for the client
            Map<String, String> nextQuestion = service.getRandomSecurityQuestion(clientId);
            response.put("message", "Answer is incorrect. Here is another security question.");
            response.put("question", nextQuestion);
            return ResponseEntity.ok(response);
        }
    }

	// Endpoint to remove all asked questions for a specific client
	@DeleteMapping("/remove-all-asked-questions/{clientId}")
	public ResponseEntity<Map<String, String>> removeAllAskedQuestions(@PathVariable Long clientId) {
		try {
			// Call the service to remove all asked questions
			service.removeAllAskedQuestions(clientId);

			// Return a success message
			Map<String, String> response = new LinkedHashMap<>();
			response.put("message", "All questions removed successfully.");

			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			// Handle case where the client is not found or other exceptions
			Map<String, String> errorResponse = new LinkedHashMap<>();
			errorResponse.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
		}
	}
}
