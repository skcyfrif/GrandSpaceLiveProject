package com.cyfrifpro.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectRedesignRequest {

    private String projectName;
    private String scopeOfWork;
    private LocalDate submissionDeadline;
    private String clientKeyRequirements;

    // Getters and Setters
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getScopeOfWork() {
        return scopeOfWork;
    }

    public void setScopeOfWork(String scopeOfWork) {
        this.scopeOfWork = scopeOfWork;
    }

    public LocalDate getSubmissionDeadline() {
        return submissionDeadline;
    }

    public void setSubmissionDeadline(LocalDate submissionDeadline) {
        this.submissionDeadline = submissionDeadline;
    }

    public String getClientKeyRequirements() {
        return clientKeyRequirements;
    }

    public void setClientKeyRequirements(String clientKeyRequirements) {
        this.clientKeyRequirements = clientKeyRequirements;
    }
}
