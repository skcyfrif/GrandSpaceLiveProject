package com.cyfrifpro.model;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "contact_us")
public class ContactUs implements Serializable {
	
	private static final long serialVersionUID = 123456789L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String userName;
	private String email;
	private String phone;
	private String msg;
	public ContactUs(Long id, String userName, String email, String phone, String msg) {
		super();
		this.id = id;
		this.userName = userName;
		this.email = email;
		this.phone = phone;
		this.msg = msg;
	}
	public ContactUs() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
}
