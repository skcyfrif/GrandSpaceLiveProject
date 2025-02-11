package com.cyfrifpro.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.Manager;
import com.cyfrifpro.model.Project;
import com.cyfrifpro.model.ProjectRedesign;
//import com.cyfrifpro.repository.ManagerBudgetRepository;
import com.cyfrifpro.repository.ManagerRepository;
import com.cyfrifpro.repository.ProjectRedesignRepository;
import com.cyfrifpro.repository.ProjectRepository;

@Service
public class AdminService {

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ManagerRepository managerRepository;
	
	@Autowired
    private ProjectRedesignRepository projectRedesignRepository;
	
//	@Autowired
//	private ManagerBudgetRepository managerBudgetRepository;

	public void assignProjectToManagers(Project project) {
	    // Get all managers
	    List<Manager> managers = managerRepository.findAll();

	    // Assign the project to all managers
	    for (Manager manager : managers) {
	        // Add project to manager's list for bidding or estimates
	        manager.addProjectToBidList(project);

	        // Save the manager's updated information if necessary
	        managerRepository.save(manager);
	    }

	    // Update the project status to "AWAITING_ESTIMATES"
	    project.setStatus("AWAITING_ESTIMATES");

	    // Set the current date to the 'estimatedByVendor' field
	    LocalDate estimatedByVendorDate = LocalDate.now();
	    project.setEstimatedByVendor(estimatedByVendorDate);

	    // Calculate the expiration date (7 days after the estimatedByVendor date)
//	    LocalDate expireDate = estimatedByVendorDate.plusDays(7);

	    // Save the updated project with the estimatedByVendor field
	    projectRepository.save(project);

	    // Save the expireDate for each ManagerBudget (if required)
//	    List<ManagerBudget> managerBudgets = managerBudgetRepository.findByProjectId(project.getId());
//	    for (ManagerBudget managerBudget : managerBudgets) {
//	        managerBudget.setExpireDate(expireDate);
//	        managerBudgetRepository.save(managerBudget);
//	    }
	}
	
	
	// Method to submit a ProjectRedesign and update project status
    public ProjectRedesign submitProjectRedesign(Long projectId, String projectName, String scopeOfWork,
                                                 LocalDate submissionDeadline, String clientKeyRequirements) {
        // Fetch the existing project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

        // Create a new ProjectRedesign record
        ProjectRedesign redesign = new ProjectRedesign();
        redesign.setProject(project);
        redesign.setProjectName(projectName);
        redesign.setScopeOfWork(scopeOfWork);
        redesign.setSubmissionDeadline(submissionDeadline);
        redesign.setClientKeyRequirements(clientKeyRequirements);

        // Save the redesign record
        ProjectRedesign savedRedesign = projectRedesignRepository.save(redesign);

        // Update project status to "AWAITING_ESTIMATES"
        project.setStatus("AWAITING_ESTIMATES");

        // Set estimatedByVendor to current date
        project.setEstimatedByVendor(LocalDate.now());

        // Save updated project
        projectRepository.save(project);

        return savedRedesign;
    }
    
    public List<ProjectRedesign> getRedesignDetailsByProjectId(Long projectId) {
        return projectRedesignRepository.findByProjectId(projectId);
    }

}
