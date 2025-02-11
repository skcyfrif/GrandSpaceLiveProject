package com.cyfrifpro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.request.MaterialsDTO;
import com.cyfrifpro.service.MeterialService;

@RestController
@RequestMapping("/api/meterial")
public class MeterialController {

	@Autowired
	private MeterialService meterialsService;

	// Get all materials
	@GetMapping("/getAll")
	public List<MaterialsDTO> getAllMaterials() {
		return meterialsService.getAllMaterials();
	}

	// Get materials by project ID
	@GetMapping("/project/{projectId}")
	public List<MaterialsDTO> getMaterialsByProjectId(@PathVariable Long projectId) {
		return meterialsService.getMaterialsByProjectId(projectId);
	}

}
