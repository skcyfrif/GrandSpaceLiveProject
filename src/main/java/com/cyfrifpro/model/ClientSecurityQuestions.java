package com.cyfrifpro.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "client_security_questions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientSecurityQuestions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "q1answer")
    private String q1Answer;

    @Column(name = "q2answer")
    private String q2Answer;

    @Column(name = "q3answer")
    private String q3Answer;

    @Column(name = "q4answer")
    private String q4Answer;

    @Column(name = "q5answer")
    private String q5Answer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")  // Foreign key column in client_security_questions table
    @JsonManagedReference  
    private Client client;
    
    // List to store the questions that have already been asked
    @ElementCollection
    @CollectionTable(name = "asked_questions", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "question_key")
    private List<String> askedQuestions = new ArrayList<>(); // To track asked questions

    // Getters and setters for all fields
    public List<String> getAskedQuestions() {
        return askedQuestions;
    }

    public void setAskedQuestions(List<String> askedQuestions) {
        this.askedQuestions = askedQuestions;
    }

    @Override
    public String toString() {
        return "ClientSecurityQuestions{" +
               "clientId=" + id +
               ", q1Answer='" + q1Answer + '\'' +
               ", q2Answer='" + q2Answer + '\'' +
               ", q3Answer='" + q3Answer + '\'' +
               ", q4Answer='" + q4Answer + '\'' +
               ", q5Answer='" + q5Answer + '\'' +
               ", client=" + client + // Display client details as well
               '}';
    }
}