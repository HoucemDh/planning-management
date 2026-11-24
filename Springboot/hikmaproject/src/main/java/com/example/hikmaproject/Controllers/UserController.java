package com.example.hikmaproject.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Dto.RolePayload;
import com.example.hikmaproject.Dto.UserInput;
import com.example.hikmaproject.Dto.UserPayload;
import com.example.hikmaproject.Models.AppUser;
import com.example.hikmaproject.repositories.UserRepository;
import com.example.hikmaproject.services.AuditService;
import com.example.hikmaproject.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, AuditService auditService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @MutationMapping
    public UserPayload createUser(@Argument UserInput input) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Capture state before creation
        String oldValue = "{}"; // No previous state for creation
        
        // Create the user
        UserPayload result = userService.createUser(input);
        
        // Create new value JSON safely
        String newValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            result.getId() != null ? result.getId() : 0,
            result.getUsername() != null ? result.getUsername() : "",
            result.getEmail() != null ? result.getEmail() : "",
            result.isActive(),
            result.getRoles() != null ? result.getRoles().toString() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "CREATE_USER",
            "User",
            result.getId() != null ? result.getId().toString() : "unknown",
            oldValue,
            newValue
        );
        
        return result;
    }

    @MutationMapping
    public UserPayload updateUser(@Argument Long id, @Argument UserInput input) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Get existing user to capture old state
        UserPayload existingUser = user(id);
        String oldValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            existingUser.getId() != null ? existingUser.getId() : 0,
            existingUser.getUsername() != null ? existingUser.getUsername() : "",
            existingUser.getEmail() != null ? existingUser.getEmail() : "",
            existingUser.isActive(),
            existingUser.getRoles() != null ? existingUser.getRoles().toString() : ""
        );
        
        // Update the user
        UserPayload result = userService.updateUser(id, input);
        
        // Create new value JSON
        String newValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            result.getId() != null ? result.getId() : 0,
            result.getUsername() != null ? result.getUsername() : "",
            result.getEmail() != null ? result.getEmail() : "",
            result.isActive(),
            result.getRoles() != null ? result.getRoles().toString() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "UPDATE_USER",
            "User",
            id.toString(),
            oldValue,
            newValue
        );
        
        return result;
    }

    @QueryMapping
    public List<UserPayload> users() {
        return userRepository.findAll().stream()
                .map(this::mapUserToPayload)
                .collect(Collectors.toList());
    }

    @QueryMapping
    public List<AppUser> getAllUsers(){
        return userRepository.findAll();
    }
    
    @QueryMapping
    public UserPayload user(@Argument Long id) {
        return userRepository.findById(id)
                .map(this::mapUserToPayload)
                .orElse(null);
    }

    private UserPayload mapUserToPayload(AppUser user) {
        return new UserPayload(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isActive(),
                user.getRoles().stream()
                        .map(role -> new RolePayload(role.getId(), role.getName(), null))
                        .collect(Collectors.toSet()),
                null
        );
    }

    @MutationMapping
    public UserPayload deactivateUser(@Argument Long id) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Get existing user to capture old state
        UserPayload existingUser = user(id);
        String oldValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            existingUser.getId() != null ? existingUser.getId() : 0,
            existingUser.getUsername() != null ? existingUser.getUsername() : "",
            existingUser.getEmail() != null ? existingUser.getEmail() : "",
            existingUser.isActive(),
            existingUser.getRoles() != null ? existingUser.getRoles().toString() : ""
        );
        
        // Deactivate the user
        UserPayload result = userService.deactivateUser(id);
        
        // Create new value JSON
        String newValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            result.getId() != null ? result.getId() : 0,
            result.getUsername() != null ? result.getUsername() : "",
            result.getEmail() != null ? result.getEmail() : "",
            result.isActive(),
            result.getRoles() != null ? result.getRoles().toString() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "DEACTIVATE_USER",
            "User",
            id.toString(),
            oldValue,
            newValue
        );
        
        return result;
    }

    @MutationMapping
    public UserPayload reactivateUser(@Argument Long id) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Get existing user to capture old state
        UserPayload existingUser = user(id);
        String oldValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            existingUser.getId() != null ? existingUser.getId() : 0,
            existingUser.getUsername() != null ? existingUser.getUsername() : "",
            existingUser.getEmail() != null ? existingUser.getEmail() : "",
            existingUser.isActive(),
            existingUser.getRoles() != null ? existingUser.getRoles().toString() : ""
        );
        
        // Reactivate the user
        UserPayload result = userService.reactivateUser(id);
        
        // Create new value JSON
        String newValue = String.format(
            "{\"id\": \"%d\", \"username\": \"%s\", \"email\": \"%s\", \"active\": \"%b\", \"roles\": \"%s\"}", 
            result.getId() != null ? result.getId() : 0,
            result.getUsername() != null ? result.getUsername() : "",
            result.getEmail() != null ? result.getEmail() : "",
            result.isActive(),
            result.getRoles() != null ? result.getRoles().toString() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "REACTIVATE_USER",
            "User",
            id.toString(),
            oldValue,
            newValue
        );
        
        return result;
    }
}