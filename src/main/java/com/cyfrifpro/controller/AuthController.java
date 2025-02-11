package com.cyfrifpro.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.AccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.config.UserInfoConfig;
import com.cyfrifpro.config.security.JWTUtil;
import com.cyfrifpro.model.Admin;
import com.cyfrifpro.model.Client;
import com.cyfrifpro.model.Manager;
import com.cyfrifpro.repository.AdminRepository;
import com.cyfrifpro.repository.ClientRepository;
import com.cyfrifpro.repository.ManagerRepository;
import com.cyfrifpro.request.ChangePasswordRequest;
import com.cyfrifpro.request.LoginCredentials;
import com.cyfrifpro.request.UserDTO;
import com.cyfrifpro.service.UserDetailsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://127.0.0.1:5501")
public class AuthController {

	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
	
	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private ManagerRepository managerRepository;

	@Autowired
	private ClientRepository clientRepository;

	// Register new Manager or Client
	// Register new Manager or Client
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerHandler(@Valid @RequestBody UserDTO userDTO) {
		try {
			// Validate the role before proceeding
			if (userDTO.getRole() == null || userDTO.getRole().isEmpty()) {
				return new ResponseEntity<>(Collections.singletonMap("error", "Role must be specified"),
						HttpStatus.BAD_REQUEST);
			}

			// Create an instance of BCryptPasswordEncoder and encode the password
			BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
			String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
			userDTO.setPassword(encodedPassword); // Set the encoded password back to the DTO

			// Register the user based on their role (Admin, Manager, or Client)
			UserDTO registeredUser = null;
			switch (userDTO.getRole().toUpperCase()) {
			case "ADMIN":
				registeredUser = userDetailsService.registerAdmin(userDTO); // Assuming this method handles saving the
																			// admin
				break;
			case "MANAGER":
				registeredUser = userDetailsService.registerManager(userDTO); // Assuming this method handles saving the
																				// manager
				break;
			case "CLIENT":
				registeredUser = userDetailsService.registerClient(userDTO); // Assuming this method handles saving the
																				// client
				break;
			default:
				return new ResponseEntity<>(Collections.singletonMap("error", "Invalid role specified"),
						HttpStatus.BAD_REQUEST);
			}

			// Generate JWT token for the newly registered user
			String token = jwtUtil.generateToken(registeredUser.getId(), registeredUser.getEmail(),
					registeredUser.getRole());

			// Return the generated token in the response
			return new ResponseEntity<>(Collections.singletonMap("jwt-token", token), HttpStatus.CREATED);
		} catch (AccessException e) {
			// Catching specific exception and logging error
			return new ResponseEntity<>(Collections.singletonMap("error", "Access denied: " + e.getMessage()),
					HttpStatus.FORBIDDEN);
		} catch (Exception e) {
			// General exception handling
			logger.error("Error occurred during user registration", e);
			return new ResponseEntity<>(Collections.singletonMap("error", "An unexpected error occurred"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Login endpoint for Manager or Client
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> loginHandler(@Valid @RequestBody LoginCredentials credentials) {
		try {
			// Authenticate the user
			UsernamePasswordAuthenticationToken authCredentials = new UsernamePasswordAuthenticationToken(
					credentials.getEmail(), credentials.getPassword());
			Authentication auth = authenticationManager.authenticate(authCredentials);

			// Fetch authenticated user details
			UserDetails userDetails = (UserDetails) auth.getPrincipal();
			String email = userDetails.getUsername();

			// Retrieve the user's role
			String roleName = userDetails.getAuthorities().stream().findFirst()
					.map(authority -> authority.getAuthority().replace("ROLE_", "")).orElse("USER");

			// Retrieve the user from the database based on the role (Admin or Manager or
			// Client)
			Optional<Admin> adminOptional = adminRepository.findByEmail(email);
			if (adminOptional.isPresent()) {
				Admin admin = adminOptional.get();
				return generateTokenResponse(admin.getId(), email, roleName);
			}

			Optional<Manager> managerOptional = managerRepository.findByEmail(email);
			if (managerOptional.isPresent()) {
				Manager manager = managerOptional.get();
				return generateTokenResponse(manager.getId(), email, roleName);
			}

			Optional<Client> clientOptional = clientRepository.findByEmail(email);
			if (clientOptional.isPresent()) {
				Client client = clientOptional.get();
				return generateTokenResponse(client.getId(), email, roleName);
			}

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("error", "User not found"));

		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("error", "Invalid email or password"));
		}
	}

	// Helper method to generate token and response
	private ResponseEntity<Map<String, Object>> generateTokenResponse(Long userId, String email, String roleName) {
		// Generate JWT token
		String token = jwtUtil.generateToken(userId, email, roleName);

		// Create response
		Map<String, Object> response = new HashMap<>();
		response.put("jwt-token", token);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/change-password")
	public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request) {
	    try {
	    	
			BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	        // Get the authenticated user's email
	        String email = request.getEmail();
	        String oldPassword = request.getOldPassword();
	        String newPassword = request.getNewPassword();

	        // Check if the user exists in any of the repositories
	        Optional<Admin> adminOptional = adminRepository.findByEmail(email);
	        Optional<Manager> managerOptional = managerRepository.findByEmail(email);
	        Optional<Client> clientOptional = clientRepository.findByEmail(email);

	        UserDetails userDetails = null;
	        if (adminOptional.isPresent()) {
	            userDetails = new UserInfoConfig(adminOptional.get());
	        } else if (managerOptional.isPresent()) {
	            userDetails = new UserInfoConfig(managerOptional.get());
	        } else if (clientOptional.isPresent()) {
	            userDetails = new UserInfoConfig(clientOptional.get());
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
	        }

	        // Validate the old password
	        if (!passwordEncoder.matches(oldPassword, userDetails.getPassword())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Incorrect old password"));
	        }

	        // Encrypt the new password
	        String encryptedPassword = passwordEncoder.encode(newPassword);

	        // Update the password in the respective repository
	        if (adminOptional.isPresent()) {
	            Admin admin = adminOptional.get();
	            admin.setPassword(encryptedPassword);
	            adminRepository.save(admin);
	        } else if (managerOptional.isPresent()) {
	            Manager manager = managerOptional.get();
	            manager.setPassword(encryptedPassword);
	            managerRepository.save(manager);
	        } else if (clientOptional.isPresent()) {
	            Client client = clientOptional.get();
	            client.setPassword(encryptedPassword);
	            clientRepository.save(client);
	        }

	        return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully"));

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred"));
	    }
	}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//package com.cyfrifpro.controller;
//
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.expression.AccessException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.cyfrifpro.config.security.JWTUtil;
//import com.cyfrifpro.model.Admin;
//import com.cyfrifpro.model.Client;
//import com.cyfrifpro.model.Manager;
//import com.cyfrifpro.repository.AdminRepository;
//import com.cyfrifpro.repository.ClientRepository;
//import com.cyfrifpro.repository.ManagerRepository;
//import com.cyfrifpro.request.LoginCredentials;
//import com.cyfrifpro.request.UserDTO;
//import com.cyfrifpro.service.UserDetailsService;
//
//import jakarta.validation.Valid;
//
//@RestController
//@CrossOrigin(origins = "http://127.0.0.1:5500")
//@RequestMapping("/api")
//public class AuthController {
//
//	@Autowired
//	private UserDetailsService userDetailsService;
//
//	@Autowired
//	private JWTUtil jwtUtil;
//
//	@Autowired
//	private AuthenticationManager authenticationManager;
//
//	@Autowired
//	private AdminRepository adminRepository;
//
//	@Autowired
//	private ManagerRepository managerRepository;
//
//	@Autowired
//	private ClientRepository clientRepository;
//	
//	@Autowired
//    private BCryptPasswordEncoder passwordEncoder;  // Inject BCryptPasswordEncoder
//
//	// Step 1: Generate and return an OTP
//    @PostMapping("/register/init")
//    public ResponseEntity<Map<String, Object>> registerInitHandler(@Valid @RequestBody UserDTO userDTO) {
//        try {
//            // Check if the email is already taken
//            if (adminRepository.existsByEmail(userDTO.getEmail()) || managerRepository.existsByEmail(userDTO.getEmail())
//                    || clientRepository.existsByEmail(userDTO.getEmail())) {
//                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email is already taken."));
//            }
//
//            // Generate a 4-digit OTP and store it in the service
//            UserDTO response = userDetailsService.registerClient(userDTO); // This generates and stores the OTP
//
//            // Return success response (OTP is printed to the console in the service)
//            return ResponseEntity.ok(Collections.singletonMap("message", "OTP generated and sent to the console."));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Collections.singletonMap("error", e.getMessage()));
//        }
//    }
//
//    // Step 2: Verify OTP and complete registration
//    @PostMapping("/register/verify-otp")
//    public ResponseEntity<Map<String, Object>> verifyOTPAndRegisterHandler(@Valid @RequestBody UserDTO userDTO,
//            @RequestParam int otp) {
//        try {
//            // Encrypt the password before saving it
//            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
//            userDTO.setPassword(encodedPassword);  // Set the encoded password back to the DTO
//
//            // Verify the OTP and complete registration
//            UserDTO registeredUser = userDetailsService.verifyOTPAndRegisterClient(userDTO, otp);
//
//            // Generate JWT token for the newly registered user
//            String token = jwtUtil.generateToken(registeredUser.getId(), registeredUser.getEmail(),
//                    registeredUser.getRole());
//
//            // Return the generated token
//            return ResponseEntity.ok(Collections.singletonMap("jwt-token", token));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Collections.singletonMap("error", e.getMessage()));
//        }
//    }
// // Login endpoint for Manager or Client
// 	@PostMapping("/login")
// 	public ResponseEntity<Map<String, Object>> loginHandler(@Valid @RequestBody LoginCredentials credentials) {
// 		try {
// 			// Authenticate the user
// 			UsernamePasswordAuthenticationToken authCredentials = new UsernamePasswordAuthenticationToken(
// 					credentials.getEmail(), credentials.getPassword());
// 			Authentication auth = authenticationManager.authenticate(authCredentials);
// 
// 			// Fetch authenticated user details
// 			UserDetails userDetails = (UserDetails) auth.getPrincipal();
// 			String email = userDetails.getUsername();
// 
// 			// Retrieve the user's role
// 			String roleName = userDetails.getAuthorities().stream().findFirst()
// 					.map(authority -> authority.getAuthority().replace("ROLE_", "")).orElse("USER");
// 
// 			// Retrieve the user from the database based on the role (Admin or Manager or Client)
// 			Optional<Admin> adminOptional = adminRepository.findByEmail(email);
// 			if (adminOptional.isPresent()) {
// 				Admin admin = adminOptional.get();
// 				return generateTokenResponse(admin.getId(), email, roleName);
// 			}
// 			
// 			Optional<Manager> managerOptional = managerRepository.findByEmail(email);
// 			if (managerOptional.isPresent()) {
// 				Manager manager = managerOptional.get();
// 				return generateTokenResponse(manager.getId(), email, roleName);
// 			}
// 
// 			Optional<Client> clientOptional = clientRepository.findByEmail(email);
// 			if (clientOptional.isPresent()) {
// 				Client client = clientOptional.get();
// 				return generateTokenResponse(client.getId(), email, roleName);
// 			}
// 
// 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
// 					.body(Collections.singletonMap("error", "User not found"));
// 
// 		} catch (BadCredentialsException e) {
// 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
// 					.body(Collections.singletonMap("error", "Invalid email or password"));
// 		}
// 	}
//
//	// Helper method to generate token and response
//	private ResponseEntity<Map<String, Object>> generateTokenResponse(Long userId, String email, String roleName) {
//		// Generate JWT token
//		String token = jwtUtil.generateToken(userId, email, roleName);
//
//		// Create response
//		Map<String, Object> response = new HashMap<>();
//		response.put("jwt-token", token);
//		return ResponseEntity.ok(response);
//	}
//}
