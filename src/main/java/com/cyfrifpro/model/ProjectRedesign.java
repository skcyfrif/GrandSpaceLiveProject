package com.cyfrifpro.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
public class ProjectRedesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Project project;  // The project being redesigned

    private String projectName; // New description after redesign
    private String ScopeOfWork; // New budget after redesign
    private LocalDate submissionDeadline; // The date when the redesign happened

    private String clientKeyRequirements; // The admin who made the redesign

}
