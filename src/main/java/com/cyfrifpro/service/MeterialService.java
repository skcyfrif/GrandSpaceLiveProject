package com.cyfrifpro.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.Meterials;
import com.cyfrifpro.repository.MeterialsRepository;
import com.cyfrifpro.request.MaterialsDTO;

@Service
public class MeterialService {

	@Autowired
	private MeterialsRepository meterialsRepository; // Your repository for Meterials

	@Autowired
	private ModelMapper modelMapper;

	// Method to get all materials and map them to MaterialsDTO
	public List<MaterialsDTO> getAllMaterials() {
		List<Meterials> materials = meterialsRepository.findAll(); // Fetch materials from DB

		// Map each Meterial to a MaterialsDTO
		return materials.stream().map(meterial -> modelMapper.map(meterial, MaterialsDTO.class))
				.collect(Collectors.toList());
	}

	// Method to get materials by project ID
	public List<MaterialsDTO> getMaterialsByProjectId(Long projectId) {
		List<Meterials> materials = meterialsRepository.findByProjectId(projectId); // Assuming this method is in your
																					// repository

		return materials.stream().map(meterial -> modelMapper.map(meterial, MaterialsDTO.class))
				.collect(Collectors.toList());
	}

}
