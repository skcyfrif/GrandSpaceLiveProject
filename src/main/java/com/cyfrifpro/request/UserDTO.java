package com.cyfrifpro.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
	private Long id;

	@NotNull(message = "Email cannot be null")
	@Email(message = "Email should be valid")
	@Column(nullable = false, length = 100, unique = true)
	private String email;

	@NotNull(message = "Password cannot be null")
	@Size(min = 8, message = "Password must be at least 8 characters long")
	@Column(nullable = false)
	private String password;

	@Size(max = 10, message = "Role must not exceed 10 characters")
	@Column(nullable = true, length = 10)
	private String role; // MANAGER or CLIENT or ADMIN

	@NotNull(message = "First name cannot be null")
	@Size(min = 3, max = 15, message = "First name must be between 3 and 15 characters")
	@Column(nullable = false, length = 15)
	private String firstName;

	@NotNull(message = "Last name cannot be null")
	@Size(min = 3, max = 15, message = "Last name must be between 3 and 15 characters")
	@Column(nullable = false, length = 15)
	private String lastName;

	@NotNull(message = "Phone number cannot be null")
	@Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
	@Pattern(regexp = "^[0-9]+$", message = "Phone number must be numeric")
	@Column(nullable = false, length = 15)
	private String phone;

//	@NotNull(message = "State cannot be null")
	@Size(min = 1, max = 25, message = "State must be between 3 and 25 characters")
	@Column(nullable = false, length = 25)
	private String state;

//	@NotNull(message = "City cannot be null")
	@Size(min = 3, max = 25, message = "City must be between 3 and 25 characters")
	@Column(nullable = false, length = 25)
	private String city;

//	@NotNull(message = "Current address cannot be null")
	@Size(min = 8, max = 250, message = "Current address must be between 8 and 250 characters")
	@Column(nullable = false, length = 250)
	private String currentAddress;

	private boolean premium;

	// Manager's Extra fields.
//	@NotNull(message = "Qualifications cannot be null")
	@Size(min = 3, max = 50, message = "Qualifications must be between 3 and 50 characters")
	@Column(nullable = false, length = 50)
	private String qualifications;
	
//	@NotNull(message = "Experience cannot be null")
	@Size(min = 3, max = 50, message = "Experience must be between 3 and 50 characters")
	@Column(nullable = false, length = 50)
	private String experience;

}
