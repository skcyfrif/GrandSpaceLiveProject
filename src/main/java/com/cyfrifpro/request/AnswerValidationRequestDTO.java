package com.cyfrifpro.request;

public class AnswerValidationRequestDTO {

	private Long clientId;
	private String questionNo; // This will be q1, q2, q3, q4, q5
	private String answer; // The answer provided by the client

	// Getters and Setters
	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getQuestionNo() {
		return questionNo;
	}

	public void setQuestionNo(String questionNo) {
		this.questionNo = questionNo;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}
}
