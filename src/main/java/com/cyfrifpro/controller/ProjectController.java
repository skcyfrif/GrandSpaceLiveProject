package com.cyfrifpro.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cyfrifpro.model.Project;
import com.cyfrifpro.model.ProjectRedesign;
import com.cyfrifpro.repository.ProjectRepository;
import com.cyfrifpro.request.ProjectRedesignRequest;
import com.cyfrifpro.request.ProjectRequest;
import com.cyfrifpro.response.ProjectResponse;
import com.cyfrifpro.service.AdminService;
//import com.cyfrifpro.service.PaymentService;
import com.cyfrifpro.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/project")
//@CrossOrigin(origins = "http://127.0.0.1:5500")
@Tag(name = "ProjectController", description = "By using this class we can map all kind of project requests.")
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private AdminService adminService;

	@Autowired
	private ModelMapper modelMapper;

	// @Autowired
//	private PaymentService paymentService;

	// Submit a project
	@PostMapping("/submit")
	@PreAuthorize("hasRole('CLIENT')")
	@Operation(summary = "Post Api", description = "This is a method for project submission")
	public ResponseEntity<ProjectResponse> submitProject(@RequestBody ProjectRequest projectRequest) {
		ProjectResponse projectResponse = projectService.submitProject(projectRequest);
		return ResponseEntity.ok(projectResponse);
	}

	@PostMapping("/{projectId}/uploadPhoto")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<String> uploadPhoto(@PathVariable Long projectId, @RequestParam("photo") MultipartFile photo)
			throws IOException {

		try {
			// Call the service to save the photo for the project
			Project updatedProject = projectService.savePhoto(projectId, photo);

			return new ResponseEntity<>("Photo uploaded successfully for project ID: " + updatedProject.getId(),
					HttpStatus.CREATED);
		} catch (IOException e) {
			// Handle the error
			return new ResponseEntity<>("Error uploading photo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (IllegalArgumentException e) {
			// Handle project not found error
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

	// Endpoint to retrieve the image associated with a project
	@GetMapping("/{projectId}/image")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
	public ResponseEntity<ByteArrayResource> getImage(@PathVariable Long projectId) {
		// Fetch the project from the repository
		Optional<Project> optionalProject = projectRepository.findById(projectId);

		if (optionalProject.isPresent()) {
			Project project = optionalProject.get();
			byte[] imageBytes = project.getPhoto(); // Retrieve the image data from the `photo` field

			if (imageBytes != null && imageBytes.length > 0) {
				// Return the image as a ByteArrayResource
				ByteArrayResource resource = new ByteArrayResource(imageBytes);
				return ResponseEntity.ok().header("Content-Type", "image/jpeg") // Assuming image is JPEG; adjust
																				// accordingly
						.body(resource);
			} else {
				// If no image exists for the project, return a 404 response
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // No image found for this project
			}
		} else {
			// If project is not found, return a 404 response
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Project not found
		}
	}

	@GetMapping("/{projectId}/photo-status")
	public String getPhotoStatus(@PathVariable Long projectId) {
		return projectService.getPhotoStatusByProjectId(projectId);
	}

	// Endpoint to update the photoStatus field to CLIENT_CONFIRMED
	@PutMapping("/{projectId}/confirm-image")
	@PreAuthorize("hasRole('CLIENT')")
	public Project confirmImage(@PathVariable Long projectId) {
		// Update photoStatus to CLIENT_CONFIRMED
		return projectService.updatePhotoStatus(projectId, "CLIENT_CONFIRMED");
	}

	// Endpoint to get all projects
	@GetMapping("/allProjects")
	@PreAuthorize("hasRole('ADMIN')")
	public List<ProjectResponse> getAllProjects() {
		List<Project> projects = projectService.getAllProjects();
		// Map each project to a response DTO (ProjectResponse)
		return projects.stream().map(project -> modelMapper.map(project, ProjectResponse.class))
				.collect(Collectors.toList());
	}

	// Endpoint to get the budget of a project by ID
	@GetMapping("/projects/{id}/budget")
	public ResponseEntity<BigDecimal> getProjectBudget(@PathVariable Long id) {
		try {
			BigDecimal projectBudget = projectService.getProjectBudget(id);
			return ResponseEntity.ok(projectBudget); // Returns the budget as a response
		} catch (Exception ex) {
			return ResponseEntity.status(404).body(null); // Returns a 404 with no content if project not found
		}
	}

	// Endpoint to assign a manager to a project
	@PutMapping("assignManager/{projectId}")
	@Operation(summary = "Put Api", description = "This is a method for manager assigning")
	public ResponseEntity<Project> assignManager(@PathVariable Long projectId,
			@RequestBody ProjectRequest projectRequest) {
		// Set the projectId in the request object
		projectRequest.setId(projectId);

		try {
			// Call the service to assign the client and manager to the project
			Project project = projectService.assignedManager(projectRequest);

			// Return the updated project
			return ResponseEntity.ok(project);
		} catch (RuntimeException ex) {
			// If the client or manager is not premium, handle the error
			return ResponseEntity.badRequest().build();
		}
	}

	// Endpoint to assign a client to a project
	@PutMapping("assignClient/{projectId}")
	@Operation(summary = "Put Api", description = "This is a method for client assigning")
	public ResponseEntity<Project> assignClient(@PathVariable Long projectId,
			@RequestBody ProjectRequest projectRequest) {
		// Set the projectId in the request object
		projectRequest.setId(projectId);

		try {
			// Call the service to assign the client and manager to the project
			Project project = projectService.assignedClient(projectRequest);

			// Return the updated project
			return ResponseEntity.ok(project);
		} catch (RuntimeException ex) {
			// If the client or manager is not premium, handle the error
			return ResponseEntity.badRequest().build();
		}
	}

	// Endpoint to get a project by ID
	@GetMapping("/{projectId}")
	@Operation(summary = "Get Api", description = "This is a method for geting a project by its id")
	public Optional<Project> getProjectById(@PathVariable Long projectId) {
		return projectService.findProjectById(projectId);
	}

	// Endpoint to get projects by client ID
	@GetMapping("/client/{clientId}")
	@Operation(summary = "Get Api", description = "This is a method for geting a project by client id")
	public List<Project> getProjectsByClientId(@PathVariable Long clientId) {
		return projectService.findProjectsByClientId(clientId);
	}

	// Endpoint to get projects by manager ID
	@GetMapping("/manager/{managerId}")
	@Operation(summary = "Get Api", description = "This is a method for geting a project by assigned manager id")
	public List<Project> getProjectsByManagerId(@PathVariable Long managerId) {
		return projectService.findProjectsByManagerId(managerId);
	}

	// Endpoint for client to confirm the project
	@PutMapping("/updateConfirm/{projectId}")
	@Operation(summary = "Put Api", description = "This is a method for client to confirm the project")
	public ResponseEntity<Project> updatePremium(@PathVariable Long projectId) {
		Optional<Project> updatedConfirm = projectService.updateConfirmationStatus(projectId);
		return updatedConfirm.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/{projectId}/assign-to-managers")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Post Api", description = "This is a method to notify all the managers about the project")
	public ResponseEntity<String> assignProjectToManagers(@PathVariable Long projectId) {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new RuntimeException("Project not found"));

		// Notify managers and update the project status
		adminService.assignProjectToManagers(project);

		return ResponseEntity.status(HttpStatus.OK).body("Project assigned to all managers and status updated.");
	}

	@PostMapping("/{projectId}/redesign")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ProjectRedesign> submitProjectRedesign(@PathVariable Long projectId,
			@RequestBody ProjectRedesignRequest projectRedesignRequest) {

		// Call the service method
		ProjectRedesign redesign = adminService.submitProjectRedesign(projectId,
				projectRedesignRequest.getProjectName(), projectRedesignRequest.getScopeOfWork(),
				projectRedesignRequest.getSubmissionDeadline(), projectRedesignRequest.getClientKeyRequirements());

		return ResponseEntity.ok(redesign);
	}

	@GetMapping("/{projectId}/redesign-details")
	public ResponseEntity<List<ProjectRedesign>> getRedesignDetails(@PathVariable Long projectId) {
		List<ProjectRedesign> redesigns = adminService.getRedesignDetailsByProjectId(projectId);
		return ResponseEntity.ok(redesigns);
	}

	@PutMapping("/update-status/completed/{projectId}")
	public String updateStatusToCompleted(@PathVariable Long projectId) {
		Optional<Project> updatedProject = projectService.updateStatusToCompleted(projectId);
		if (updatedProject.isPresent()) {
			return "Project status updated to 'COMPLETED' for project ID: " + projectId;
		} else {
			return "Project not found with ID: " + projectId;
		}
	}

	@GetMapping("/projects/count")
	@PreAuthorize("hasRole('ADMIN')")
	public long getTotalProjectsCountLastYear() {
		return projectService.countLastYearProjects();
	}

	// Endpoint to count "ASSIGNED_PROJECTS" projects registered in last year
	@GetMapping("/count-assigned-projects-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long countAssignedProjectsLastYear() {
		return projectService.countAssignedProjectsLastYear();
	}

	// Endpoint to count "ASSIGNED_PROJECTS" projects registered in last year
	@GetMapping("/count-not-assigned-projects-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long countNotAssignedProjectsLastYear() {
		return projectService.countNotAssignedProjectsLastYear();
	}

	// Endpoint to count "ASSIGNED_PROJECTS" projects registered in last year
	@GetMapping("/count-completed-projects-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long countCompletedProjectsLastYear() {
		return projectService.countCompletedProjectsLastYear();
	}

	// Endpoint to get the count of NOT_ASSIGNED projects
	@GetMapping("/projects/un-publish/count")
	@PreAuthorize("hasRole('ADMIN')")
	public long getUnpublishProjectsCount() {
		return projectService.countUnpublishProjects();
	}

	// Endpoint to get the count of projects with "AWAITING_ESTIMATES" status from
	// last year
	@GetMapping("/count-awaiting-estimates-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long getCountAwaitingEstimatesProjectsLastYear() {
		return projectService.countAwaitingEstimatesProjectsLastYear();
	}

	// Endpoint to get the count of projects with "AWAITING_ESTIMATES" status from
	// last year
	@GetMapping("/count-wip-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long getWIPProjectsLastYear() {
		return projectService.countWIPProjectsLastYear();
	}

	// Endpoint to get the count of projects with "AWAITING_ESTIMATES" status from
	// last year
	@GetMapping("/count-dispute-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public long getDisputeProjectsLastYear() {
		return projectService.countDISPUTEProjectsLastYear();
	}

	/// GET ALL////

	@GetMapping("/projects/last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getLastYearProjects() {
		return projectService.getLastYearProjects();
	}

	@GetMapping("/un-publish-projects")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getUnpublishProjects() {
		return projectService.getUnpublishProjects();
	}

	// Endpoint to get all "AWAITING_ESTIMATES" projects from last year
	@GetMapping("/awaiting-estimates-last-year")
	@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
	public List<Project> getAwaitingEstimatesProjectsLastYear() {
		return projectService.getAwaitingEstimatesProjectsLastYear();
	}

	// Endpoint to get all "AWAITING_ESTIMATES" projects from last year by ID
	@GetMapping("/awaiting-estimates-last-year/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
	public ResponseEntity<?> getAwaitingEstimatesProjectByIdLastYear(@PathVariable Long id) {
		Optional<Project> project = projectService.getAwaitingEstimatesProjectByIdLastYear(id);

		if (project.isPresent()) {
			return ResponseEntity.ok(project.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("error", "Project not found for given ID last year"));
		}
	}

	// Endpoint to get all "ASSIGNED_PROJECTS" with registration date in the last
	// year
	@GetMapping("/assigned-projects-registered-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getAssignedProjectsRegisteredLastYear() {
		return projectService.getAssignedProjectsRegisteredLastYear();
	}

	// Endpoint to get all "ASSIGNED_PROJECTS" with registration date in the last
	// year
	@GetMapping("/not-assigned-projects-registered-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getNotAssignedProjectsRegisteredLastYear() {
		return projectService.getNotAssignedProjectsRegisteredLastYear();
	}

	// Endpoint to get all "ASSIGNED_PROJECTS" with registration date in the last
	// year
	@GetMapping("/completed-projects-registered-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getCompletedProjectsRegisteredLastYear() {
		return projectService.getCompletedProjectsRegisteredLastYear();
	}

	// Endpoint to get all "ASSIGNED_PROJECTS" with registration date in the last
	// year
	@GetMapping("/wip-projects-registered-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getWIPRegisteredLastYear() {
		return projectService.getWIPProjectsRegisteredLastYear();
	}

	// Endpoint to get all "ASSIGNED_PROJECTS" with registration date in the last
	// year
	@GetMapping("/dispute-projects-registered-last-year")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Project> getDisputeRegisteredLastYear() {
		return projectService.getDISPUTEProjectsRegisteredLastYear();
	}

	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
	public ResponseEntity<String> deleteProject(@PathVariable Long id) {
		boolean isDeleted = projectService.deleteProjectById(id);

		if (isDeleted) {
			return ResponseEntity.ok("Project deleted successfully.");
		} else {
			return ResponseEntity.status(404).body("Project not found.");
		}
	}

	@PutMapping("/{projectId}/dispute")
    public ResponseEntity<String> markProjectAsDispute(@PathVariable Long projectId) {
        Optional<Project> updatedProject = projectService.updateStatusToDispute(projectId);

        if (updatedProject.isPresent()) {
            return ResponseEntity.ok("Project marked as DISPUTE and manager unassigned successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found.");
        }
    }

}
