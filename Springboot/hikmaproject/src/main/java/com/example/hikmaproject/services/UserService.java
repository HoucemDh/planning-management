package com.example.hikmaproject.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hikmaproject.Dto.RolePayload;
import com.example.hikmaproject.Dto.UserInput;
import com.example.hikmaproject.Dto.UserPayload;
import com.example.hikmaproject.Models.AppUser;
import com.example.hikmaproject.Models.User_Roles;
import com.example.hikmaproject.repositories.RolesRepository;
import com.example.hikmaproject.repositories.UserRepository;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RolesRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(
        UserRepository userRepository, 
        RolesRepository roleRepository, 
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserPayload createUser(UserInput userInput) {
        // Validate if username or email already exists
        if (userRepository.existsByUsername(userInput.getUsername())) {
            return new UserPayload(null, null, null, false, null, "Username already exists");
        }

        if (userRepository.existsByEmail(userInput.getEmail())) {
            return new UserPayload(null, null, null, false, null, "Email already exists");
        }

        // Get roles
        Set<User_Roles> roles = new HashSet<>();
        if (userInput.getRoleIds() != null && !userInput.getRoleIds().isEmpty()) {
            roles = roleRepository.findByIdIn(userInput.getRoleIds());
            if (roles.isEmpty()) {
                return new UserPayload(null, null, null, false, null, "Invalid role IDs provided");
            }
        }

        // Create new user
        AppUser user = AppUser.builder()
                .username(userInput.getUsername())
                .email(userInput.getEmail())
                .password(passwordEncoder.encode(userInput.getPassword()))
                .active(true)
                .roles(roles)
                .build();

        AppUser savedUser = userRepository.save(user);

        // Convert roles to payload
        Set<RolePayload> rolePayloads = savedUser.getRoles().stream()
                .map(role -> new RolePayload(role.getId(), role.getName(), null))
                .collect(Collectors.toSet());

        return new UserPayload(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.isActive(),
                rolePayloads,
                "User created successfully"
        );
    }

    public UserPayload updateUser(Long id, UserInput userInput) {
        // Find user by id
        AppUser existingUser = userRepository.findById(id)
                .orElse(null);

        if (existingUser == null) {
            return new UserPayload(null, null, null, false, null, "User not found");
        }

        // Check if username already exists for another user
        if (!existingUser.getUsername().equals(userInput.getUsername()) && 
            userRepository.existsByUsername(userInput.getUsername())) {
            return new UserPayload(null, null, null, false, null, "Username already exists");
        }

        // Check if email already exists for another user
        if (!existingUser.getEmail().equals(userInput.getEmail()) && 
            userRepository.existsByEmail(userInput.getEmail())) {
            return new UserPayload(null, null, null, false, null, "Email already exists");
        }

        // Update roles if roleIds are provided
        if (userInput.getRoleIds() != null && !userInput.getRoleIds().isEmpty()) {
            Set<User_Roles> roles = roleRepository.findByIdIn(userInput.getRoleIds());
            if (roles.isEmpty()) {
                return new UserPayload(null, null, null, false, null, "Invalid role IDs provided");
            }
            existingUser.setRoles(roles);
        }

        // Update user fields
        existingUser.setUsername(userInput.getUsername());
        existingUser.setEmail(userInput.getEmail());
        
        // Update password if not empty
        if (userInput.getPassword() != null && !userInput.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userInput.getPassword()));
        }

        AppUser updatedUser = userRepository.save(existingUser);

        // Convert roles to payload
        Set<RolePayload> rolePayloads = updatedUser.getRoles().stream()
                .map(role -> new RolePayload(role.getId(), role.getName(), null))
                .collect(Collectors.toSet());

        return new UserPayload(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.isActive(),
                rolePayloads,
                "User updated successfully"
        );
    }

    public UserPayload deactivateUser(Long id) {
        AppUser user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return new UserPayload(null, null, null, false, null, "User not found");
        }

        user.setActive(false);
        AppUser savedUser = userRepository.save(user);

        Set<RolePayload> rolePayloads = savedUser.getRoles().stream()
                .map(role -> new RolePayload(role.getId(), role.getName(), null))
                .collect(Collectors.toSet());

        return new UserPayload(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.isActive(),
                rolePayloads,
                "User deactivated successfully"
        );
    }

    public UserPayload reactivateUser(Long id) {
        AppUser user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return new UserPayload(null, null, null, false, null, "User not found");
        }

        user.setActive(true);
        AppUser savedUser = userRepository.save(user);

        Set<RolePayload> rolePayloads = savedUser.getRoles().stream()
                .map(role -> new RolePayload(role.getId(), role.getName(), null))
                .collect(Collectors.toSet());

        return new UserPayload(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.isActive(),
                rolePayloads,
                "User reactivated successfully"
        );
    }
}