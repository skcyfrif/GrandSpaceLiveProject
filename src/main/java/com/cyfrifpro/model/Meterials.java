package com.cyfrifpro.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Meterials {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long meterialId;

	@ManyToOne
	@JoinColumn(name = "project_id", nullable = false)
	private Project project; // Reference to the Client entity

	@ManyToOne
	@JoinColumn(name = "manager_id", nullable = false)
	private Manager manager; // Reference to the Client entity

	@Column(nullable = false)
	private String requirements; // Project requirements

	@Column(nullable = false)
	private LocalDate lastDate; // Last date for project completion

}
