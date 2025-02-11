package com.cyfrifpro.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class Vendor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long vendorId;

	@ManyToOne
	@JoinColumn(name = "project_id", nullable = false)
	private Project project; // Reference to the Project entity

	@ManyToOne
	@JoinColumn(name = "manager_id")
	private Manager manager; // Assuming you have a Manager entity.

	@OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
	private List<MaterialRequirement> requirements; // This will be your "requirements" table

	private String lastDate;

	@Column(nullable = false)
	private LocalDate requirementDate; // The new field for today's date

	// Automatically set the requirementDate to the current date before persisting
	// the entity
	@PrePersist
	public void setRequirementDate() {
		this.requirementDate = LocalDate.now(); // Set the requirementDate to today's date
	}

}  