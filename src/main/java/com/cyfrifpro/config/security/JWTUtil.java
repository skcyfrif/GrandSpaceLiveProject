package com.cyfrifpro.config.security;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JWTUtil {

    @Value("${security.jwt.secret}")  // ✅ Ensure this matches the application.properties key
    private String secret;

    @PostConstruct
    public void init() {
        System.out.println("🔹 JWT Secret Loaded: " + (secret != null ? "OK ✅" : "MISSING ❌"));
    }

    public String generateToken(Long id, String email, String role) throws IllegalArgumentException, JWTCreationException {
        return JWT.create()
                .withSubject("User Details")
                .withClaim("id", id)
                .withClaim("email", email)
                .withClaim("role", role)
//                .withClaim("premium", premium)
                .withIssuedAt(new Date())
                .withIssuer("CyfrifPro Tech")
                .sign(Algorithm.HMAC256(secret));  // ✅ Use correctly loaded secret
    }

    public Map<String, Object> validateTokenAndRetrieveClaims(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("CyfrifPro Tech")
                .build();

        DecodedJWT jwt = verifier.verify(token);

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", jwt.getClaim("id").asLong());
        claims.put("email", jwt.getClaim("email").asString());
        claims.put("role", jwt.getClaim("role").asString());
//        claims.put("premium", jwt.getClaim("premium").asBoolean());

        return claims;
    }
}
