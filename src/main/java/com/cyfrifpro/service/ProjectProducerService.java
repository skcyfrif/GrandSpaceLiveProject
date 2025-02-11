//package com.cyfrifpro.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//import com.cyfrifpro.model.Project;
//
//@Service
//public class ProjectProducerService {
//
//	private static final String TOPIC = "project-topic";
//
//	@Autowired
//	private KafkaTemplate<String, Project> kafkaTemplate;
//
//	public void sendProject(String key, Project project) {
//		kafkaTemplate.send(TOPIC, key, project);
//	}
//}