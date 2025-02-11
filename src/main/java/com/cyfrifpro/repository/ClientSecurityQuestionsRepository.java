package com.cyfrifpro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.ClientSecurityQuestions;

@Repository
public interface ClientSecurityQuestionsRepository extends JpaRepository<ClientSecurityQuestions, Long> {
	Optional<ClientSecurityQuestions> findByClientId(Long clientId);  // Custom method to find by clientId
}