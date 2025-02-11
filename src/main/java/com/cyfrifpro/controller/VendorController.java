package com.cyfrifpro.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.Vendor;
import com.cyfrifpro.request.VendorMaterialDTO;
import com.cyfrifpro.service.VendorService;

@RestController
@RequestMapping("/api/vendors")
//@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class VendorController {

	private final VendorService vendorService;

	public VendorController(VendorService vendorService) {
		this.vendorService = vendorService;
	}

	@PostMapping("/meterials")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<String> createVendorWithMaterials(@RequestBody VendorMaterialDTO vendorMaterialDTO) {
		try {
			Vendor savedVendor = vendorService.saveVendorWithMaterials(vendorMaterialDTO);
			return ResponseEntity
					.ok("Vendor and materials saved successfully with Vendor ID: " + savedVendor.getVendorId());
		} catch (RuntimeException ex) {
			return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
		}
	}

	// Get Material Requirements by Manager ID
	@GetMapping("/materials/manager/{managerId}")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<List<VendorMaterialDTO>> getMaterialsByManagerId(@PathVariable Long managerId) {
		List<VendorMaterialDTO> materials = vendorService.getVendorsByManagerId(managerId);
		return ResponseEntity.ok(materials);
	}

	@GetMapping("/{projectId}/requirments")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<VendorMaterialDTO>> getVendorsByProjectId(@PathVariable Long projectId) {
		try {
			// Call the service method to get the vendors
			List<VendorMaterialDTO> vendorMaterialDTOs = vendorService.getVendorsByProjectId(projectId);

			// Return the list of VendorMaterialDTOs with status OK
			return ResponseEntity.ok(vendorMaterialDTOs);
		} catch (RuntimeException e) {
			// Handle case when no vendors are found or any other exception
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
		}
	}

	@PutMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> updateMaterialStatus(@PathVariable Long id) {
		try {
			vendorService.updateMaterialStatusToSend(id);
			return ResponseEntity.ok("Status updated to SEND successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/all")
	public ResponseEntity<List<VendorMaterialDTO>> getAllVendors() {
		List<VendorMaterialDTO> vendors = vendorService.getAllVendors();
		return ResponseEntity.ok(vendors);
	}
}
