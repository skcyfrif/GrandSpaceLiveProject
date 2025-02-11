package com.cyfrifpro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyfrifpro.model.ContactUs;
import com.cyfrifpro.service.ContactUsService;

import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/contacts")
public class ContactUsController {

	@Autowired
	private ContactUsService contactUsService;
	
	@GetMapping("/{id}")
	public ResponseEntity<ContactUs> getContactUsById(@PathVariable Long id){
		ContactUs contactUs = contactUsService.getContactUsById(id);
		return contactUs != null ? ResponseEntity.ok(contactUs) : ResponseEntity.notFound().build();
	}
	
	@PostMapping("/send")
	public ResponseEntity<ContactUs> saveContactUs(@RequestBody ContactUs contactUs){
		ContactUs contactUs2 = contactUsService.saveContactUs(contactUs);
		return ResponseEntity.status(HttpStatus.CREATED).body(contactUs2);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteContactUs(@PathVariable Long id){
		contactUsService.deleteContactUs(id);
		return ResponseEntity.noContent().build();
	}
}
