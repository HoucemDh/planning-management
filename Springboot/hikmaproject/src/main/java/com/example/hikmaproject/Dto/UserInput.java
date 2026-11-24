package com.example.hikmaproject.Dto;
import java.util.Set;

import lombok.Data;

@Data
public class UserInput {
    private String username;
    private String email;
    private String password;
    private boolean active;
    private Set<Long> roleIds;   
}
