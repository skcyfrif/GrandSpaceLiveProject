package com.cyfrifpro.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
//import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Manager implements Serializable {

	private static final long serialVersionUID = 1L;

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

	@NotNull(message = "State cannot be null")
	@Size(min = 1, max = 25, message = "State must be between 3 and 25 characters")
	@Column(nullable = false, length = 50)
	private String state;

	@NotNull(message = "City cannot be null")
	@Size(min = 3, max = 25, message = "City must be between 3 and 25 characters")
	@Column(nullable = false, length = 50)
	private String city;

	@Size(max = 10, message = "Role must not exceed 10 characters")
	@Column(nullable = true, length = 100)
	private String role; // "MANAGER"

//	@Column(nullable = true)
//	private boolean premium;

	@NotNull(message = "Qualifications cannot be null")
	@Size(min = 3, max = 50, message = "Qualifications must be between 3 and 50 characters")
	@Column(nullable = false, length = 50)
	private String qualifications;

	@NotNull(message = "Experience cannot be null")
	@Size(min = 3, max = 50, message = "Experience must be between 3 and 50 characters")
	@Column(nullable = false, length = 50)
	private String experience;

	@OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
	@JsonBackReference // Prevent circular reference (don't serialize projects in Manager)
	private List<Project> projectsToBid;

	@Column(name = "assigned_project_id", nullable = true)
	private Long assignedProjectId; // NULL if the manager is not assigned to any project

	public void addProjectToBidList(Project project) {
		if (projectsToBid == null) {
			projectsToBid = new ArrayList<>();
		}
		projectsToBid.add(project);
	}

}
