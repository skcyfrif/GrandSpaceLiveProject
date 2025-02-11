package com.cyfrifpro.service;

import java.util.List;
//import java.util.Map;
import java.util.Optional;

//import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.Client;
import com.cyfrifpro.repository.ClientRepository;

@Service
public class ClientService {

	@Autowired
	private ClientRepository clientRepository;

//	@Autowired
//	private ModelMapper modelMapper;

	@Cacheable(value = "clients", key = "#id")
	public Client getClientById(Long id) {
		System.out.println("Fetching from DB for ID: " + id);
		return clientRepository.findById(id).orElse(null);
	}

	// Fetch a client by Email
	@Cacheable(value = "clients", key = "#email")
	public Optional<Client> getClientByEmail(String email) {
		return clientRepository.findByEmail(email);
	}

	// Fetch all clients at a time
	@Cacheable(value = "clients")
	public List<Client> findAllClients() {
		System.out.println("Fetching clients from the database...");
		return clientRepository.findAll();
	}

	// Fetch list of unsubscribed clients
	public List<Client> getUnPremiumedClients() {
		return clientRepository.findUnpremiumedClients();
	}

	// Fetch all subscribed clients
	public List<Client> getAllPremiumClients() {
		return clientRepository.findByPremiumTrue();
	}

	public Optional<Client> updatePremiumStatus(Long clientId) {
		// Find the client using the provided client ID
		Optional<Client> client = clientRepository.findById(clientId);

		if (client.isPresent()) {
			Client clientToUpdate = client.get();

			// Set the premium status to true
			clientToUpdate.setPremium(true);

			// Save the updated client
			clientRepository.save(clientToUpdate);

			return Optional.of(clientToUpdate);
		}

		// If the client is not found, return Optional.empty()
		return Optional.empty();
	}

//	@CacheEvict(value = "clients", key = "#id")
	public void deletedClient(Long id) {
		clientRepository.deleteById(id);
	}

}
