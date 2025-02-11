package com.cyfrifpro.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.Client;
import com.cyfrifpro.repository.ClientRepository;
import com.cyfrifpro.util.OTPStorage;

@RestController
@RequestMapping("/api/auth")
public class ResetPasswordController {
	@Autowired
	private OTPStorage otpStorage;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String otp,
			@RequestParam String newPassword) {
		String storedOtp = otpStorage.getOTP(email);

		if (storedOtp == null || !storedOtp.equals(otp)) {
			return ResponseEntity.badRequest().body("Invalid OTP!");
		}

		Client client = clientRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		client.setPassword(passwordEncoder.encode(newPassword));
		clientRepository.save(client);

		otpStorage.removeOTP(email); // Remove OTP after successful reset
		return ResponseEntity.ok("Password reset successfully.");
	}

	// Method to verify OTP
	@PostMapping("/verify-otp")
	public ResponseEntity<Map<String, Object>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
		Map<String, Object> response = new HashMap<>();
		String storedOtp = otpStorage.getOTP(email);

		if (storedOtp == null || !storedOtp.equals(otp)) {
			response.put("success", false);
			response.put("message", "Invalid or expired OTP!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		response.put("success", true);
		response.put("message", "OTP verified successfully.");
		return ResponseEntity.ok(response);
	}

	// Method to set a new password after OTP verification
	@PostMapping("/set-new-password")
	public ResponseEntity<Map<String, Object>> setNewPassword(@RequestParam String email,
			@RequestParam String newPassword) {
		Map<String, Object> response = new HashMap<>();

		if (!clientRepository.existsByEmail(email)) {
			response.put("success", false);
			response.put("message", "Email not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		Client client = clientRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		client.setPassword(passwordEncoder.encode(newPassword));
		clientRepository.save(client);

		otpStorage.removeOTP(email); // Remove OTP after password reset

		response.put("success", true);
		response.put("message", "Password updated successfully.");
		return ResponseEntity.ok(response);
	}

}
