package com.example.hikmaproject.services;

import com.example.hikmaproject.Dto.RoleInput;
import com.example.hikmaproject.Dto.RolePayload;
import com.example.hikmaproject.Models.User_Roles;
import com.example.hikmaproject.repositories.RolesRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RolesRepository roleRepository;


    public List<User_Roles> getAllRoles(){
        return roleRepository.findAll();
    }

    @Transactional
    public RolePayload createRole(RoleInput input) {
        // Check if role already exists
        if (roleRepository.existsByName(input.getName())) {
            return new RolePayload(null, input.getName(), 
                "Role with name " + input.getName() + " already exists");
        }

        // Create new role
        User_Roles role = new User_Roles();
        role.setName(input.getName());

        // Save role
        User_Roles savedRole = roleRepository.save(role);

        return new RolePayload(
            savedRole.getId(),
            savedRole.getName(),
            "Role created successfully"
        );
    }


    @Transactional
    public RolePayload updateRole(Long id, RoleInput input) {
        // Check if role exists
        Optional<User_Roles> roleOptional = roleRepository.findById(id);
        if (roleOptional.isEmpty()) {
            return new RolePayload(null, null, "Role not found with id: " + id);
        }

        // Check if new name already exists for another role
        if (roleRepository.existsByNameAndIdNot(input.getName(), id)) {
            return new RolePayload(id, input.getName(),
                "Role with name '" + input.getName() + "' already exists");
        }

        // Update role
        User_Roles role = roleOptional.get();
        role.setName(input.getName());
        role = roleRepository.save(role);

        return new RolePayload(role.getId(), role.getName(), 
            "Role updated successfully");
    }

    public boolean deleteRole(Long id){
        if (roleRepository.existsById(id)){
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public User_Roles getRoleById(Long id) {
        return roleRepository.findById(id).orElse(null);
    }
    
}

