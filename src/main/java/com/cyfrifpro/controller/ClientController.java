package com.cyfrifpro.controller;

import java.util.List;
//import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.Client;
import com.cyfrifpro.service.ClientService;

import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/client")
@Tag(name = "ClientController", description = "By using this class we can map all kind of client requests.")
//@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class ClientController {

	@Autowired
	private ClientService clientService;

	@GetMapping("/user")
	public String wish() {
		return "hello";
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get API", description = "Find client by ID")
	public ResponseEntity<Client> getClientById(@PathVariable Long id) {
		Client client = clientService.getClientById(id);
		return client != null ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
	}

	@GetMapping("/email/{email}")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get Api", description = "This is a method for finding client by there email")
	public ResponseEntity<Client> getClientByEmail(@PathVariable String email) {
		return clientService.getClientByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/findAll")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get API", description = "Fetch all clients from the cache or database")
	public ResponseEntity<List<Client>> findAllClients() {
		List<Client> clients = clientService.findAllClients();

		if (clients.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(clients);
	}

	@GetMapping("/unpremium")
	@Operation(summary = "Get Api", description = "This is a method for finding clients who dont purches premium plan")
	public ResponseEntity<List<Client>> getUnsubscribedClients() {
		List<Client> unsubscribedClients = clientService.getUnPremiumedClients();
		return ResponseEntity.ok(unsubscribedClients);
	}

	@GetMapping("/premium")
	@Operation(summary = "Get Api", description = "This is a method for finding clients who purches premium plan")
	public ResponseEntity<List<Client>> getSubscribedClients() {
		List<Client> subscribedClients = clientService.getAllPremiumClients();
		return ResponseEntity.ok(subscribedClients);
	}

	@PutMapping("/{clientId}/updatePremium")
	@PreAuthorize("hasRole('CLIENT')")
	@Operation(summary = "Put Api", description = "This is a method for updating a client's unpremium plan to premium plan")
	public ResponseEntity<?> updatePremiumStatus(@PathVariable Long clientId) {
		Optional<Client> updatedClient = clientService.updatePremiumStatus(clientId);

		if (updatedClient.isPresent()) {
			return ResponseEntity.ok(updatedClient.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client with ID " + clientId + " not found.");
		}
	}

	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> deleteClient(@PathVariable Long id) {
		clientService.deletedClient(id);
		return ResponseEntity.ok("Client with ID " + id + " deleted successfully.");
	}

}
