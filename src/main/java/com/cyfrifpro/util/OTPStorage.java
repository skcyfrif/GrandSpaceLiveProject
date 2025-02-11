package com.cyfrifpro.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class OTPStorage {
    private Map<String, String> otpCache = new ConcurrentHashMap<>();

    public void storeOTP(String email, String otp) {
        otpCache.put(email, otp);
    }

    public String getOTP(String email) {
        return otpCache.get(email);
    }

    public void removeOTP(String email) {
        otpCache.remove(email);
    }
}
