package com.cyfrifpro.request;

import java.time.LocalDate;

public class MaterialsDTO {

	private Long meterialId; // Material ID
	private Long projectId; // ID of the associated project
	private Long managerId;
	private String requirements; // Project requirements
	private LocalDate lastDate; // Last date for project completion

	public Long getMeterialId() {
		return meterialId;
	}

	public void setMeterialId(Long meterialId) {
		this.meterialId = meterialId;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public Long getManagerId() {
		return managerId;
	}

	public void setManagerId(Long managerId) {
		this.managerId = managerId;
	}

	public String getRequirements() {
		return requirements;
	}

	public void setRequirements(String requirements) {
		this.requirements = requirements;
	}

	public LocalDate getLastDate() {
		return lastDate;
	}

	public void setLastDate(LocalDate lastDate) {
		this.lastDate = lastDate;
	}

	public MaterialsDTO(Long meterialId, Long projectId, Long managerId, String requirements,
			LocalDate lastDate) {
		super();
		this.meterialId = meterialId;
		this.projectId = projectId;
		this.managerId = managerId;
		this.requirements = requirements;
		this.lastDate = lastDate;
	}

	// No-argument constructor (required for ModelMapper)
	public MaterialsDTO() {
	}

}