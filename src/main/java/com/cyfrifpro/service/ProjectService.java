package com.cyfrifpro.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
//import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.LoggerFactory;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import com.cyfrifpro.model.Client;
//import com.cyfrifpro.model.Client;
import com.cyfrifpro.model.Manager;
import com.cyfrifpro.model.Project;
import com.cyfrifpro.repository.ClientRepository;
//import com.cyfrifpro.repository.ManagerBudgetRepository;
import com.cyfrifpro.repository.ManagerRepository;
//import com.cyfrifpro.repository.ProjectRedesignRepository;
import com.cyfrifpro.repository.ProjectRepository;
import com.cyfrifpro.request.ProjectRequest;
import com.cyfrifpro.response.ProjectResponse;

import ch.qos.logback.classic.Logger;
import jakarta.transaction.Transactional;

//import ch.qos.logback.classic.Logger;

@Service
public class ProjectService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private ManagerRepository managerRepository;

//	@Autowired
//	private ProjectRedesignRepository projectRedesignRepository;

//	@Autowired
//	private ManagerBudgetRepository managerBudgetRepository;

//	public ProjectResponse submitProject(ProjectRequest projectRequest) {
//		// Fetch the client from the database using the client ID in the projectRequest
//		Client client = clientRepository.findById(projectRequest.getClientId())
//				.orElseThrow(() -> new IllegalArgumentException("Client not found"));
//
//		// Check if the client is premium
//		if (!client.isPremium()) {
//			throw new IllegalStateException("Project submission is allowed only for premium clients.");
//		}
//
//		// Map the projectRequest to a Project entity
//		Project project = modelMapper.map(projectRequest, Project.class);
//
//		// Set default values for confirmed, status, and registration date
//		project.setConfirmed(false); // Project is not confirmed yet
//		project.setStatus("UNPUBLISH"); // Set default status to NOT_ASSIGNED or any status you prefer
//		project.setRegistrationDate(LocalDate.now()); // Set the registration date to the current date
//
//		// Associate the project with the client
//		project.setClient(client);

	// Generate the project code after setting other properties (like id)
	// You can use `id` to generate the projectCode (e.g., PROJ-<id>)
//    String projectCode = "PROJ-" + project.getId();
//    project.setProjectCode(projectCode); // Set the generated project code
//
//		// Save the project to the database
//		project = projectRepository.save(project);
//
//		// Map the saved project entity to a ProjectResponse DTO and return it
//		return modelMapper.map(project, ProjectResponse.class);
//	}

//	@Autowired
//	private ProjectProducerService projectProducerService; // Inject Kafka producer

	public ProjectResponse submitProject(ProjectRequest projectRequest) {
		// Fetch the client from the database using the client ID in the projectRequest
		Client client = clientRepository.findById(projectRequest.getClientId())
				.orElseThrow(() -> new IllegalArgumentException("Client not found"));

		// Check if the client is premium
		if (!client.isPremium()) {
			throw new IllegalStateException("Project submission is allowed only for premium clients.");
		}

		// Map the projectRequest to a Project entity
		Project project = modelMapper.map(projectRequest, Project.class);

		// Set default values for confirmed, status, and registration date
		project.setConfirmed(false); // Project is not confirmed yet
		project.setStatus("UNPUBLISH"); // Set default status
		project.setRegistrationDate(LocalDate.now()); // Set the registration date to the current date

		// Associate the project with the client
		project.setClient(client);

		// Save the project to the database (this will generate the id)
		project = projectRepository.save(project);

		// Generate the project code after the id is assigned
		String projectCode = "PROJ00" + project.getId();
		project.setProjectCode(projectCode); // Set the generated project code

		// Save the updated project with the project code
		project = projectRepository.save(project);

		// Send the saved project to Kafka (Optional)
		// projectProducerService.sendProject("project-submission", project);

		// Map the saved project entity to a ProjectResponse DTO and return it
		return modelMapper.map(project, ProjectResponse.class);
	}

	public Project savePhoto(Long projectId, MultipartFile photo) throws IOException {
		// Find the project by ID
		Optional<Project> optionalProject = projectRepository.findById(projectId);

		if (optionalProject.isPresent()) {
			Project project = optionalProject.get();

			// Store the photo as a byte array in the Project entity
			if (photo != null && !photo.isEmpty()) {
				project.setPhoto(photo.getBytes());

				// Set photo status as "MANAGER_CONFIRMED"
				project.setPhotoStatus("MANAGER_CONFIRMED");
			}

			// Save the updated project with the new photo and status
			return projectRepository.save(project);
		} else {
			throw new IllegalArgumentException("Project not found with ID: " + projectId);
		}
	}

	public String getPhotoStatusByProjectId(Long projectId) {
		Optional<Project> project = projectRepository.findById(projectId);

		// If the project is found, return the photoStatus
		if (project.isPresent()) {
			return project.get().getPhotoStatus();
		} else {
			return null; // Return null if the project does not exist
		}
	}

	// Method to update the photoStatus field to CLIENT_CONFIRMED
	@Transactional
	public Project updatePhotoStatus(Long projectId, String newStatus) {
		// Find the project by ID
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

		// Check if the status is different, and update
		if (newStatus != null && !newStatus.equals(project.getPhotoStatus())) {
			project.setPhotoStatus(newStatus); // Update the photoStatus field
		}

		// Save the updated project
		return projectRepository.save(project);
	}

	// Method to find a project by ID
	public Optional<Project> findById(Long projectId) {
		return projectRepository.findById(projectId);
	}

	public ResponseEntity<ByteArrayResource> getImage(@PathVariable Long projectId) {
		Optional<Project> optionalProject = projectRepository.findById(projectId);

		if (optionalProject.isPresent()) {
			Project project = optionalProject.get();
			byte[] imageBytes = project.getPhoto(); // Retrieve image data from the `photo` field

			if (imageBytes != null && imageBytes.length > 0) {
				ByteArrayResource resource = new ByteArrayResource(imageBytes);
				return ResponseEntity.ok().header("Content-Type", "image/jpeg") // Set the appropriate MIME type
						.body(resource);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // No image found
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Project not found
		}
	}

	// Method to fetch the photo and photoStatus fields by projectId
	public ResponseEntity<Project> getPhotoAndStatus(Long projectId) {
		Optional<Project> optionalProject = projectRepository.findById(projectId);

		if (optionalProject.isPresent()) {
			Project project = optionalProject.get();

			// Return the project with photo and photoStatus
			return ResponseEntity.ok(project);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Project not found
		}
	}

	// Method to get all projects
//	@Cacheable(value = "projects")
	public List<Project> getAllProjects() {
		System.out.println("Coming from db....");
		return projectRepository.findAll();
	}

	public BigDecimal getProjectBudget(Long projectId) {
		Project project = projectRepository.findById(projectId).orElseThrow();
		return project.getBudget();
	}

	public List<Project> getLastYearProjects() {
		LocalDate oneYearAgo = LocalDate.now().minusYears(1);
		return projectRepository.findProjectsRegisteredAfter(oneYearAgo);
	}

	// Method to find a project by ID
	public Optional<Project> findProjectById(Long projectId) {
		return projectRepository.findById(projectId);
	}

	// Method to find projects by client ID
	public List<Project> findProjectsByClientId(Long clientId) {
		return projectRepository.findByClientId(clientId);
	}

	// Method to find projects by manager ID
	public List<Project> findProjectsByManagerId(Long managerId) {
		return projectRepository.findByManagerId(managerId);
	}

	// Method to update the confirmation status of a project
	public Optional<Project> updateConfirmationStatus(Long projectId) {
		Optional<Project> projectOptional = projectRepository.findById(projectId);
		if (projectOptional.isPresent()) {
			Project project = projectOptional.get();
			project.setConfirmed(true); // Set the premium field to true
			return clientRepository.save(project);
		}
		return Optional.empty(); // Return empty if the client does not exist
	}

	////////////////////////////////////////////////////////////
	private static final Logger log = (Logger) LoggerFactory.getLogger(ProjectService.class);

	// Assign a client and manager to a project only if both the client and the
	// manager are premium
	public Project assignedManager(ProjectRequest projectRequest) {
		// Fetch the project by ID
		Project project = projectRepository.findById(projectRequest.getId()).orElseThrow(() -> {
			RuntimeException ex = new RuntimeException("Project not found");
			log.error("Exception: {}", ex.getMessage(), ex); // Log the exception
			return ex;
		});

		// Fetch the manager by ID
		Manager manager = managerRepository.findById(projectRequest.getManagerId()).orElseThrow(() -> {
			RuntimeException ex = new RuntimeException("Manager not found");
			log.error("Exception: {}", ex.getMessage(), ex); // Log the exception
			return ex;
		});

		// Check if the manager is premium
//		if (!manager.isPremium()) {
//			RuntimeException ex = new RuntimeException("Only premium managers can be assigned to projects.");
//			log.error("Exception: {}", ex.getMessage(), ex); // Log the exception
//			throw ex;
//		}

		// Assign the manager to the project
		project.setManager(manager);

		// Set the project status to "ASSIGNED"
		project.setStatus("ASSIGNED");

		// Save the updated project
		return projectRepository.save(project);
	}

	public Project assignedClient(ProjectRequest projectRequest) {
		Project project = projectRepository.findById(projectRequest.getId()).orElseThrow(() -> {
			RuntimeException ex = new RuntimeException("Project not found");
			log.error("Exception: {}", ex.getMessage(), ex); // Log the exception
			return ex;
		});

		Client client = clientRepository.findById(projectRequest.getClientId()).orElseThrow(() -> {
			String errorMessage = "Client not found";
			log.error("Exception: {}", errorMessage);
			return new RuntimeException(errorMessage);
		});

		if (!client.isPremium()) {
			RuntimeException ex = new RuntimeException("Only premium clients can be assigned a manager.");
			log.error("Exception: {}", ex.getMessage(), ex); // Log the exception
			throw ex;
		}

		project.setClient(client);
//		project.setManager(manager);
		return projectRepository.save(project);
	}

	public Optional<Project> updateStatusToCompleted(Long projectId) {
		// Fetch the project by ID
		Optional<Project> projectOptional = projectRepository.findById(projectId);
		if (projectOptional.isPresent()) {
			Project project = projectOptional.get();

			// Update the status to "COMPLETED"
			project.setStatus("COMPLETED");

			// Save the updated project back to the repository
			return Optional.of(projectRepository.save(project));
		}
		return Optional.empty(); // Return empty if the project is not found
	}

	// Method to count total number of projects
	public long countTotalProjects() {
		return projectRepository.count();
	}

	public long countLastYearProjects() {
		LocalDate oneYearAgo = LocalDate.now().minusYears(1);
		return projectRepository.countByRegistrationDateAfter(oneYearAgo);
	}

	// Method to count projects with "ASSIGNED_PROJECTS" status and registered in
	// the last year
	public long countAssignedProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Count and return the number of projects with "ASSIGNED_PROJECTS" status and
		// within the last year
		return projectRepository.countByStatusAndRegistrationDateBetween("ASSIGNED", startOfLastYear, endOfLastYear);
	}

	// Method to count projects with "ASSIGNED_PROJECTS" status and registered in
	// the last year
	public long countNotAssignedProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Count and return the number of projects with "ASSIGNED_PROJECTS" status and
		// within the last year
		return projectRepository.countByStatusAndRegistrationDateBetween("NOT_ASSIGNED", startOfLastYear,
				endOfLastYear);
	}

	// Method to count projects with "ASSIGNED_PROJECTS" status and registered in
	// the last year
	public long countCompletedProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Count and return the number of projects with "ASSIGNED_PROJECTS" status and
		// within the last year
		return projectRepository.countByStatusAndRegistrationDateBetween("COMPLETED", startOfLastYear, endOfLastYear);
	}

	// Method to count projects with "ASSIGNED_PROJECTS" status and registered in
	// the last year
	public long countWIPProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Count and return the number of projects with "ASSIGNED_PROJECTS" status and
		// within the last year
		return projectRepository.countByStatusAndRegistrationDateBetween("WORK_IN_PROGRESS", startOfLastYear,
				endOfLastYear);
	}

	// Method to count projects with "ASSIGNED_PROJECTS" status and registered in
	// the last year
	public long countDISPUTEProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Count and return the number of projects with "ASSIGNED_PROJECTS" status and
		// within the last year
		return projectRepository.countByStatusAndRegistrationDateBetween("DISPUTE", startOfLastYear, endOfLastYear);
	}

	///// LISTS?/////

	// Method to get all "ASSIGNED_PROJECTS" with registration date in the last year
	public List<Project> getAssignedProjectsRegisteredLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch the projects that are "ASSIGNED_PROJECTS" and registered in the last
		// year
		return projectRepository.findByStatusAndRegistrationDateBetween("ASSIGNED", startOfLastYear, endOfLastYear);
	}

	// Method to get all "ASSIGNED_PROJECTS" with registration date in the last year
	public List<Project> getNotAssignedProjectsRegisteredLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch the projects that are "ASSIGNED_PROJECTS" and registered in the last
		// year
		return projectRepository.findByStatusAndRegistrationDateBetween("NOT_ASSIGNED", startOfLastYear, endOfLastYear);
	}

	// Method to get all "ASSIGNED_PROJECTS" with registration date in the last year
	public List<Project> getCompletedProjectsRegisteredLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch the projects that are "ASSIGNED_PROJECTS" and registered in the last
		// year
		return projectRepository.findByStatusAndRegistrationDateBetween("COMPLETED", startOfLastYear, endOfLastYear);
	}

	// Method to get all "ASSIGNED_PROJECTS" with registration date in the last year
	public List<Project> getWIPProjectsRegisteredLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch the projects that are "ASSIGNED_PROJECTS" and registered in the last
		// year
		return projectRepository.findByStatusAndRegistrationDateBetween("WORK_IN_PROGRESS", startOfLastYear,
				endOfLastYear);
	}

	@Transactional
	public Optional<Project> updateStatusToDispute(Long projectId) {
		// Fetch the project by ID
		Optional<Project> projectOptional = projectRepository.findById(projectId);

		// Check if the project exists
		if (projectOptional.isPresent()) {
			Project project = projectOptional.get();

			// Update the status to "DISPUTE"
			project.setStatus("DISPUTE");

			// Set the manager to null
			project.setManager(null);

			// Save the updated project back to the repository
			projectRepository.save(project);

			// Return the updated project
			return Optional.of(project);
		}

		// Return empty if the project is not found
		return Optional.empty();
	}

	// Method to get all "ASSIGNED_PROJECTS" with registration date in the last year
	public List<Project> getDISPUTEProjectsRegisteredLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch the projects that are "ASSIGNED_PROJECTS" and registered in the last
		// year
		return projectRepository.findByStatusAndRegistrationDateBetween("DISPUTE", startOfLastYear, endOfLastYear);
	}

	// Method to count projects with "NOT_ASSIGNED" status
	public long countUnpublishProjects() {
		return projectRepository.countByStatus("UNPUBLISH");
	}

	// Method to get all projects with the status "NOT_ASSIGNED"
	public List<Project> getUnpublishProjects() {
		return projectRepository.findByStatus("UNPUBLISH");
	}

	// Method to get all "AWAITING_ESTIMATES" projects from the last year
	public List<Project> getAwaitingEstimatesProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch and return the projects with "AWAITING_ESTIMATES" status and within the
		// last year
		return projectRepository.findByStatusAndRegistrationDateBetween("AWAITING_ESTIMATES", startOfLastYear,
				endOfLastYear);
	}

	public Optional<Project> getAwaitingEstimatesProjectByIdLastYear(Long projectId) {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Fetch project by ID, status, and within last year's date range
		return projectRepository.findByIdAndStatusAndRegistrationDateBetween(projectId, "AWAITING_ESTIMATES",
				startOfLastYear, endOfLastYear);
	}

	public Optional<Project> updateStatusToDispatched(Long projectId) {
		// Fetch the project by ID
		Optional<Project> projectOptional = projectRepository.findById(projectId);

		// Check if project exists
		if (projectOptional.isPresent()) {
			Project project = projectOptional.get();

			// Check if the current status allows it to be dispatched (e.g., only from
			// "WORK_IN_PROGRESS" or "ASSIGNED")
//	        if (!project.getStatus().equals("WORK_IN_PROGRESS") && !project.getStatus().equals("ASSIGNED")) {
//	            String errorMessage = "Project status must be 'WORK_IN_PROGRESS' or 'ASSIGNED' to be dispatched.";
//	            log.error("Exception: {}", errorMessage);
//	            throw new IllegalStateException(errorMessage);
//	        }

			// Update the status to "DISPATCHED"
			project.setStatus("DISPATCHED");

			// Save the updated project back to the repository
			projectRepository.save(project);

			// Return the updated project
			return Optional.of(project);
		}

		// Return empty if project is not found
		return Optional.empty();
	}

	public boolean deleteProjectById(Long projectId) {
		// Check if the project exists before attempting to delete
		Optional<Project> projectOptional = projectRepository.findById(projectId);

		// If the project exists, delete it
		if (projectOptional.isPresent()) {
			projectRepository.deleteById(projectId); // Delete the project
			return true; // Return true indicating the deletion was successful
		}

		// Return false if the project was not found
		return false;
	}

	// Method to count projects with "AWAITING_ESTIMATES" status from last year
	public long countAwaitingEstimatesProjectsLastYear() {
		// Get the current year and subtract one to get last year
		int lastYear = Year.now().getValue();

		// Get the start of the last year (January 1st)
		LocalDate startOfLastYear = LocalDate.of(lastYear, Month.JANUARY, 1);

		// Get the end of the last year (December 31st)
		LocalDate endOfLastYear = LocalDate.of(lastYear, Month.DECEMBER, 31);

		// Call the repository method to count projects in the last year with the
		// "AWAITING_ESTIMATES" status
		return projectRepository.countByStatusAndRegistrationDateBetween("AWAITING_ESTIMATES", startOfLastYear,
				endOfLastYear);
	}

}
