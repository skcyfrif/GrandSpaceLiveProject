package com.cyfrifpro.service;

import com.cyfrifpro.model.Vendor;
import com.cyfrifpro.model.MaterialRequirement;
import com.cyfrifpro.repository.ManagerRepository;
import com.cyfrifpro.repository.MaterialRequirementRepository;
import com.cyfrifpro.repository.ProjectRepository;
import com.cyfrifpro.repository.VendorRepository;
import com.cyfrifpro.request.VendorMaterialDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

@Service
public class VendorService {

	@Autowired
	private MaterialRequirementRepository materialRequirementRepository;

	private final VendorRepository vendorRepository;
	private final ProjectRepository projectRepository;
	private final ManagerRepository managerRepository;

	public VendorService(VendorRepository vendorRepository, ProjectRepository projectRepository,
			ManagerRepository managerRepository) {
		this.vendorRepository = vendorRepository;
		this.projectRepository = projectRepository;
		this.managerRepository = managerRepository;
	}

	// Post the requirments
	@Transactional
	public Vendor saveVendorWithMaterials(VendorMaterialDTO vendorMaterialDTO) {
		// Map DTO to Vendor entity
		Vendor vendor = new Vendor();

		vendor.setLastDate(vendorMaterialDTO.getLastDate());

		// Fetch and set Project entity
		vendor.setProject(projectRepository.findById(vendorMaterialDTO.getProjectId()).orElseThrow(
				() -> new RuntimeException("Project not found with ID: " + vendorMaterialDTO.getProjectId())));

		// Fetch and set Manager entity (if present)
		if (vendorMaterialDTO.getManagerId() != null) {
			vendor.setManager(managerRepository.findById(vendorMaterialDTO.getManagerId()).orElseThrow(
					() -> new RuntimeException("Manager not found with ID: " + vendorMaterialDTO.getManagerId())));
		}

		// Map materials from DTO to MaterialRequirement entities
		List<MaterialRequirement> materialRequirements = vendorMaterialDTO.getMaterialDetails().stream().map(detail -> {
			MaterialRequirement material = new MaterialRequirement();
			material.setMaterialName(detail.getMaterialName());
			material.setQuantity(detail.getQuantity());
			material.setQuality(detail.getQuality());
			material.setVendor(vendor); // Set reference to the Vendor
			material.setStatus("PENDING"); // Automatically set status to PENDING
			return material;
		}).collect(Collectors.toList());

		vendor.setRequirements(materialRequirements);

		// Save Vendor entity (will cascade to save MaterialRequirements)
		return vendorRepository.save(vendor);
	}

	// Get Material Requirements by Manager ID
	public List<VendorMaterialDTO> getVendorsByManagerId(Long managerId) {
		// Fetch Vendors by Manager ID
		List<Vendor> vendors = vendorRepository.findByManagerId(managerId);

		if (vendors.isEmpty()) {
			throw new RuntimeException("No material requirements found for Manager ID: " + managerId);
		}

		// Map Vendors to VendorMaterialDTOs
		return vendors.stream().map(vendor -> {
			VendorMaterialDTO vendorMaterialDTO = new VendorMaterialDTO();
			vendorMaterialDTO.setVendorId(vendor.getVendorId());
			vendorMaterialDTO.setProjectId(vendor.getProject().getId());
			vendorMaterialDTO.setManagerId(vendor.getManager() != null ? vendor.getManager().getId() : null);
			vendorMaterialDTO.setLastDate(vendor.getLastDate());

			// Fetch Material details and set them in the DTO
			List<VendorMaterialDTO.MaterialDetail> materialDetails = vendor.getRequirements().stream()
					.map(requirement -> new VendorMaterialDTO.MaterialDetail(requirement.getId(),
							requirement.getMaterialName(), requirement.getQuantity(), requirement.getQuality(),
							requirement.getStatus()))
					.collect(Collectors.toList());

			vendorMaterialDTO.setMaterialDetails(materialDetails);
			return vendorMaterialDTO;
		}).collect(Collectors.toList());
	}

	// Get the Requirments both pending and send
	public List<VendorMaterialDTO> getVendorsByProjectId(Long projectId) {
		// Fetch Vendors by Project ID (handling multiple vendors)
		List<Vendor> vendors = vendorRepository.findByProjectId(projectId);

		if (vendors.isEmpty()) {
			throw new RuntimeException("No vendors found for Project ID: " + projectId);
		}

		// Map Vendors to VendorMaterialDTOs
		return vendors.stream().map(vendor -> {
			VendorMaterialDTO vendorMaterialDTO = new VendorMaterialDTO();
			vendorMaterialDTO.setVendorId(vendor.getVendorId());
			vendorMaterialDTO.setProjectId(vendor.getProject().getId());
			vendorMaterialDTO.setManagerId(vendor.getManager() != null ? vendor.getManager().getId() : null);
			vendorMaterialDTO.setLastDate(vendor.getLastDate());

			// Fetch Material details and set them in the DTO
			List<VendorMaterialDTO.MaterialDetail> materialDetails = vendor.getRequirements().stream()
					.map(requirement -> new VendorMaterialDTO.MaterialDetail(requirement.getId(),
							requirement.getMaterialName(), requirement.getQuantity(), requirement.getQuality(),
							requirement.getStatus()))
					.collect(Collectors.toList());

			vendorMaterialDTO.setMaterialDetails(materialDetails);
			return vendorMaterialDTO;
		}).collect(Collectors.toList());
	}

	// Update the status from pending to send
	@Transactional
	public MaterialRequirement updateMaterialStatusToSend(Long materialRequirementId) {
		// Fetch the MaterialRequirement by ID
		MaterialRequirement materialRequirement = materialRequirementRepository.findById(materialRequirementId)
				.orElseThrow(
						() -> new RuntimeException("MaterialRequirement not found with ID: " + materialRequirementId));

		// Update the status to "SEND"
		materialRequirement.setStatus("SEND");

		// Save the updated MaterialRequirement
		return materialRequirementRepository.save(materialRequirement);
	}

	// Finding all vendor and required materials
	public List<VendorMaterialDTO> getAllVendors() {
		// Fetch all Vendors from the database
		List<Vendor> vendors = vendorRepository.findAll();

		if (vendors.isEmpty()) {
			throw new RuntimeException("No vendors found.");
		}

		// Map Vendors to VendorMaterialDTOs
		return vendors.stream().map(vendor -> {
			VendorMaterialDTO vendorMaterialDTO = new VendorMaterialDTO();
			vendorMaterialDTO.setVendorId(vendor.getVendorId());
			vendorMaterialDTO.setProjectId(vendor.getProject().getId());
			vendorMaterialDTO.setManagerId(vendor.getManager() != null ? vendor.getManager().getId() : null);
			vendorMaterialDTO.setLastDate(vendor.getLastDate());

			// Fetch Material details and set them in the DTO
			List<VendorMaterialDTO.MaterialDetail> materialDetails = vendor.getRequirements().stream()
					.map(requirement -> new VendorMaterialDTO.MaterialDetail(requirement.getId(),
							requirement.getMaterialName(), requirement.getQuantity(), requirement.getQuality(),
							requirement.getStatus()))
					.collect(Collectors.toList());

			vendorMaterialDTO.setMaterialDetails(materialDetails);
			return vendorMaterialDTO;
		}).collect(Collectors.toList());
	}

}
