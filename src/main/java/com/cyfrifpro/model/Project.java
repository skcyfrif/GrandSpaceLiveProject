package com.cyfrifpro.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal areaInSquareFeet;
    private BigDecimal budget;
    private boolean confirmed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    @JsonManagedReference  
    private Client client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    @JsonManagedReference  
    private Manager manager;

    private String status; 
    private LocalDate registrationDate; 
    private LocalDate estimatedByVendor; 
    
    @Lob
    private byte[] photo; 
    
    private String photoStatus;

    private String projectCode;  // Add projectCode field to the entity

    // Setters and Getters
    public void setEstimatedByVendor(LocalDate estimatedByVendor) {
        this.estimatedByVendor = estimatedByVendor;
    }

    @Override
    public String toString() {
        return "Project [id=" + id + ", name=" + name + ", description=" + description + ", areaInSquareFeet="
                + areaInSquareFeet + ", budget=" + budget + ", confirmed=" + confirmed + ", status=" + status
                + ", registrationDate=" + registrationDate + ", estimatedByVendor=" + estimatedByVendor
                + ", photoStatus=" + photoStatus + ", projectCode=" + projectCode + "]";
    }
}

