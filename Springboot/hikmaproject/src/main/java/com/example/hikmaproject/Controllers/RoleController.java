package com.example.hikmaproject.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Dto.RoleInput;
import com.example.hikmaproject.Dto.RolePayload;
import com.example.hikmaproject.Models.User_Roles;
import com.example.hikmaproject.services.RoleService;
import com.example.hikmaproject.services.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ObjectMapper objectMapper;

    @QueryMapping
    public List<User_Roles> getAllRoles() {
        return roleService.getAllRoles();
    }

    @MutationMapping
    public RolePayload createRole(@Argument RoleInput input) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Capture state before creation
        String oldValue = "{}"; // No previous state for creation
        
        // Create the role
        RolePayload result = roleService.createRole(input);
        
        // Safely handle null ID
        String entityId = result.getId() != null ? result.getId().toString() : "unknown";
        
        // Create new value JSON safely
        String newValue = String.format(
            "{\"name\": \"%s\", \"id\": \"%s\", \"message\": \"%s\"}", 
            result.getName() != null ? result.getName() : "",
            entityId,
            result.getMessage() != null ? result.getMessage() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "CREATE_ROLE",
            "Role",
            entityId,
            oldValue,
            newValue
        );
        
        return result;
    }

    
    @MutationMapping
    public RolePayload updateRole(@Argument Long id, @Argument RoleInput input) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Get existing role to capture old state
        User_Roles existingRole = roleService.getRoleById(id);
        String oldValue = String.format(
            "{\"name\": \"%s\", \"id\": \"%s\"}", 
            existingRole != null && existingRole.getName() != null ? existingRole.getName() : "",
            id.toString()
        );
        
        // Update the role
        RolePayload result = roleService.updateRole(id, input);
        
        // Create new value JSON safely
        String newValue = String.format(
            "{\"name\": \"%s\", \"id\": \"%s\", \"message\": \"%s\"}", 
            result.getName() != null ? result.getName() : "",
            id.toString(),
            result.getMessage() != null ? result.getMessage() : ""
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "UPDATE_ROLE",
            "Role",
            id.toString(),
            oldValue,
            newValue
        );
        
        return result;
    }
}