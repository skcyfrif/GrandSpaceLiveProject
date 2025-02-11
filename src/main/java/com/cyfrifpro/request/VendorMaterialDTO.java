package com.cyfrifpro.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorMaterialDTO {

	private Long vendorId;
	private Long projectId; // Reference to the project
	private Long managerId; // Reference to the manager
	private String lastDate; // The deadline for the materials
	private String requirementDate; // Automatically populated field

	private List<MaterialDetail> materialDetails; // Nested list for materials

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class MaterialDetail {
		private Long id;
		private String materialName;
		private String quantity;
		private String quality;
		private String status;
	}

}