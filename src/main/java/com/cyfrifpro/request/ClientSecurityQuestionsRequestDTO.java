package com.cyfrifpro.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientSecurityQuestionsRequestDTO {

    private Long clientId;  // The client ID

    private String q1Answer;
    private String q2Answer;
    private String q3Answer;
    private String q4Answer;
    private String q5Answer;

}
