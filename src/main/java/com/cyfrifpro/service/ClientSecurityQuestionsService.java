package com.cyfrifpro.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.Client;
import com.cyfrifpro.model.ClientSecurityQuestions;
import com.cyfrifpro.repository.ClientRepository;
import com.cyfrifpro.repository.ClientSecurityQuestionsRepository;
import com.cyfrifpro.request.ClientSecurityQuestionsRequestDTO;

@Service
public class ClientSecurityQuestionsService {

    @Autowired
    private ClientSecurityQuestionsRepository repository;
    
    @Autowired
    private ClientRepository clientRepository;

    private static final Map<String, String> QUESTION_MAPPING = Map.of(
            "q1", "What is your birth place?",
            "q2", "Name of your first watch?",
            "q3", "What is the name of your childhood friend?",
            "q4", "What is the name of your mother's bestfriend?",
            "q5", "One of your memorable date?"
        );
    
    public ClientSecurityQuestions saveClientSecurityQuestions(ClientSecurityQuestionsRequestDTO requestDTO) {
        // Retrieve the client based on the clientId from the request body
        Client client = clientRepository.findById(requestDTO.getClientId())
                                        .orElseThrow(() -> new RuntimeException("Client not found"));

        // Create a new ClientSecurityQuestions entity
        ClientSecurityQuestions securityQuestions = new ClientSecurityQuestions();
        securityQuestions.setQ1Answer(requestDTO.getQ1Answer());
        securityQuestions.setQ2Answer(requestDTO.getQ2Answer());
        securityQuestions.setQ3Answer(requestDTO.getQ3Answer());
        securityQuestions.setQ4Answer(requestDTO.getQ4Answer());
        securityQuestions.setQ5Answer(requestDTO.getQ5Answer());

        // Set the client in the ClientSecurityQuestions entity
        securityQuestions.setClient(client);

        // Save the client security questions with the associated client
        return repository.save(securityQuestions);
    }

    public Map<String, String> getSecurityQuestionsByClientId(Long clientId) {
        // Find the ClientSecurityQuestions by clientId
        Optional<ClientSecurityQuestions> optionalSecurityQuestions = repository.findByClientId(clientId);

        if (optionalSecurityQuestions.isPresent()) {
            ClientSecurityQuestions clientSecurityQuestions = optionalSecurityQuestions.get();
            
            // Mapping the answers to predefined questions
            Map<String, String> response = new LinkedHashMap<>();
            response.put(QUESTION_MAPPING.get("q1"), clientSecurityQuestions.getQ1Answer());
            response.put(QUESTION_MAPPING.get("q2"), clientSecurityQuestions.getQ2Answer());
            response.put(QUESTION_MAPPING.get("q3"), clientSecurityQuestions.getQ3Answer());
            response.put(QUESTION_MAPPING.get("q4"), clientSecurityQuestions.getQ4Answer());
            response.put(QUESTION_MAPPING.get("q5"), clientSecurityQuestions.getQ5Answer());

            return response;
        }

        // If no questions are found for the client, return an empty map
        return Collections.emptyMap();
    }

    
    public Map<String, String> getSecurityQuestionsForClient(Long id) {
        Optional<ClientSecurityQuestions> optionalClient = repository.findById(id);
        if (optionalClient.isPresent()) {
            ClientSecurityQuestions client = optionalClient.get();
            
            // Fetching answers and mapping to questions dynamically
            Map<String, String> response = new LinkedHashMap<>();
            response.put(QUESTION_MAPPING.get("q1"), client.getQ1Answer());
            response.put(QUESTION_MAPPING.get("q2"), client.getQ2Answer());
            response.put(QUESTION_MAPPING.get("q3"), client.getQ3Answer());
            response.put(QUESTION_MAPPING.get("q4"), client.getQ4Answer());
            response.put(QUESTION_MAPPING.get("q5"), client.getQ5Answer());

            return response;
        }
        return Collections.emptyMap();
    }
    
    /////////////////////////////////////
    
    
    // Method to get a random question for the client, with a limit of 5 unique questions
    public Map<String, String> getRandomSecurityQuestion(Long clientId) {
        // Fetch the client's security questions from the database
        ClientSecurityQuestions clientSecurityQuestions = repository.findByClientId(clientId)
                                                                   .orElseThrow(() -> new RuntimeException("Client not found"));

        // Track the list of previously asked questions (this should be mutable)
        List<String> askedQuestions = clientSecurityQuestions.getAskedQuestions(); // Assuming this is stored in the DB

        // If the client has already answered 5 questions, return a message
        if (askedQuestions.size() >= 5) {
            Map<String, String> response = new LinkedHashMap<>();
            response.put("You Reached Your Limit!! Log in Again","");
            return response;
        }

        // List of available questions to choose from
        List<String> remainingQuestions = new ArrayList<>(List.of("q1", "q2", "q3", "q4", "q5")); // Make this mutable

        // Remove already asked questions from the list of available questions
        remainingQuestions.removeAll(askedQuestions);

        // If all questions have been asked, return a message
        if (remainingQuestions.isEmpty()) {
            Map<String, String> response = new LinkedHashMap<>();
            response.put("message", "All questions have been answered already.");
            return response;
        }

        // Randomly pick one of the remaining questions
        Random rand = new Random();
        String randomQuestionKey = remainingQuestions.get(rand.nextInt(remainingQuestions.size()));

        // Get the answer to the randomly picked question
        Map<String, String> response = new LinkedHashMap<>();
        response.put(QUESTION_MAPPING.get(randomQuestionKey), getAnswerForQuestion(clientSecurityQuestions, randomQuestionKey));

        // Save the question as "asked" for the client
        askedQuestions.add(randomQuestionKey); // Store the asked question
        clientSecurityQuestions.setAskedQuestions(askedQuestions); // Update the client record in the database
        repository.save(clientSecurityQuestions); // Save updated client security questions

        return response;
    }


    // Helper method to get the correct answer based on the question key
    private String getAnswerForQuestion(ClientSecurityQuestions clientSecurityQuestions, String questionKey) {
        switch (questionKey) {
            case "q1":
                return clientSecurityQuestions.getQ1Answer()+" q1";
            case "q2":
                return clientSecurityQuestions.getQ2Answer()+" q2";
            case "q3":
                return clientSecurityQuestions.getQ3Answer()+" q3";
            case "q4":
                return clientSecurityQuestions.getQ4Answer()+" q4";
            case "q5":
                return clientSecurityQuestions.getQ5Answer()+" q5";
            default:
                throw new RuntimeException("Unknown question key");
        }
    }
    
 // Method to validate the client's answer
    public boolean validateAnswer(Long clientId, String questionNo, String providedAnswer) {
        // Retrieve the client's security questions
        ClientSecurityQuestions clientSecurityQuestions = repository.findByClientId(clientId)
                                                                   .orElseThrow(() -> new RuntimeException("Client not found"));

        boolean isValid = false;

        // Validate the provided answer based on the question key
        switch (questionNo) {
            case "q1":
                isValid = clientSecurityQuestions.getQ1Answer().equalsIgnoreCase(providedAnswer);
                break;
            case "q2":
                isValid = clientSecurityQuestions.getQ2Answer().equalsIgnoreCase(providedAnswer);
                break;
            case "q3":
                isValid = clientSecurityQuestions.getQ3Answer().equalsIgnoreCase(providedAnswer);
                break;
            case "q4":
                isValid = clientSecurityQuestions.getQ4Answer().equalsIgnoreCase(providedAnswer);
                break;
            case "q5":
                isValid = clientSecurityQuestions.getQ5Answer().equalsIgnoreCase(providedAnswer);
                break;
            default:
                throw new RuntimeException("Unknown question key");
        }

        return isValid;
    }
    
    // Method to remove all asked questions for a specific client
    public void removeAllAskedQuestions(Long clientId) {
        // Fetch the client’s security questions
        ClientSecurityQuestions clientSecurityQuestions = repository.findByClientId(clientId)
                                                                   .orElseThrow(() -> new RuntimeException("Client not found"));

        // Clear the asked questions list
        clientSecurityQuestions.getAskedQuestions().clear();

        // Save the updated entity (JPA will automatically remove all related records in 'asked_questions' table)
        repository.save(clientSecurityQuestions);
    }

}










