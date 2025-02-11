//package com.cyfrifpro.service;
//
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//import com.cyfrifpro.model.Project;
//import org.apache.kafka.clients.consumer.ConsumerRecord;
//
//@Service
//public class ProjectConsumerService {
//
//
//	@KafkaListener(topics = "project-topic", groupId = "project-group")
//	public void consumeProject(ConsumerRecord<String, Project> record) {
//	    System.out.println("Received Project - Key: " + record.key() + ", Project: " + record.value());
//	}
//
//}