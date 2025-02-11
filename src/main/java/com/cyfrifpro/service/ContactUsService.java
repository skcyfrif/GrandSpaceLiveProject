package com.cyfrifpro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.ContactUs;
import com.cyfrifpro.repository.ContactUsRepository;

@Service
public class ContactUsService {

	@Autowired
	private ContactUsRepository contactUsRepository;

	@Cacheable(value = "contacts", key = "#id")
	public ContactUs getContactUsById(Long id) {
		System.out.println("Fetching from Cache/DB for ID: " + id);
		return contactUsRepository.findById(id).orElse(null);
	}

	@CachePut(value = "contacts", key = "#contactUs.id")
	public ContactUs saveContactUs(ContactUs contactUs) {
		return contactUsRepository.save(contactUs);
	}

	@CacheEvict(value = "contacts", key = "#id")
	public void deleteContactUs(Long id) {
		contactUsRepository.deleteById(id);
	}
}
