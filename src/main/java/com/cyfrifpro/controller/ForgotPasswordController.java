package com.cyfrifpro.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.repository.ClientRepository;
import com.cyfrifpro.service.EmailService;
import com.cyfrifpro.util.OTPGenerator;
import com.cyfrifpro.util.OTPStorage;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {
    @Autowired
    private OTPStorage otpStorage;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ClientRepository clientRepository;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> sendOTP(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();

        if (!clientRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email not found!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String otp = OTPGenerator.generateOTP();
        otpStorage.storeOTP(email, otp);
        emailService.sendOTPEmail(email, otp);

        response.put("success", true);
        response.put("message", "OTP sent to your email.");
        return ResponseEntity.ok(response);
    }
}
