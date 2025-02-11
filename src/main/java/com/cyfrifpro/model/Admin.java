package com.cyfrifpro.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "admin", uniqueConstraints = @UniqueConstraint(columnNames = {"email"}))
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "First name cannot be null")
    @Size(min = 3, max = 15, message = "First name must be between 3 and 15 characters")
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotNull(message = "Last name cannot be null")
    @Size(min = 3, max = 15, message = "Last name must be between 3 and 15 characters")
    @Column(nullable = false, length = 100)
    private String lastName;

    @NotNull(message = "Phone number cannot be null")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    @Pattern(regexp = "^[0-9]+$", message = "Phone number must be numeric")
    @Column(nullable = false, length = 15)
    private String phone;

    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be valid")
    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @NotNull(message = "Password cannot be null")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(nullable = false)
    private String password;

    
    @Size(max = 10, message = "Role must not exceed 10 characters")
    @Column(nullable = true, length = 100)
    private String role; // "ADMIN"

    // Additional fields if needed
}
