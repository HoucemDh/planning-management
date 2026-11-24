package com.example.hikmaproject.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Set;

@Data
@AllArgsConstructor
public class UserPayload {
    private Long id;
    private String username;
    private String email;
    private boolean active;
    private Set<RolePayload> roles;
    private String message;


        public UserPayload(Long id, String username, String email, Set<RolePayload> roles, String message) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.active = true; // Default to active
        this.roles = roles;
        this.message = message;
    }
}