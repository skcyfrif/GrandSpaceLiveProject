package com.cyfrifpro.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.cyfrifpro.service.UserDetailsService;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 hours validity for JWT token

	// Public URLs accessible without authentication
	public static final String[] PUBLIC_URLS = { "/api/register/**", "/api/login/**","/**", "/swagger-ui/**",
			"/v3/api-docs/**" };

	@Autowired
	private JWTFilter jwtFilter;

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	            .csrf(csrf -> csrf.disable())
	            .cors(cors -> cors.disable()) // Spring Security will delegate CORS handling to the GlobalCorsConfig
	            .authorizeHttpRequests(requests -> {
	                requests.requestMatchers(PUBLIC_URLS).permitAll();
	                requests.requestMatchers("/api/admin/**","/api/contacts/**","/allProjects/**").hasAuthority("ROLE_ADMIN");
	                requests.requestMatchers("/control-panel/**").hasAuthority("ROLE_MANAGER");
	                requests.requestMatchers("/submit/**").hasAuthority("ROLE_CLIENT");
	                requests.anyRequest().authenticated();
	            })
	            .exceptionHandling(handling -> handling.authenticationEntryPoint((request, response, authException) -> 
	                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")))
	            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
	    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	    return http.build();
	}

	// DAO Authentication Provider setup
	@Bean
	public DaoAuthenticationProvider daoAuthenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

		// Set custom UserDetailsService and password encoder
		provider.setUserDetailsService(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder());

		return provider;
	}

	// Password Encoder setup (BCrypt)
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// Authentication Manager bean setup
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
}
