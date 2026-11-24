package com.example.hikmaproject.services;

import com.example.hikmaproject.Models.AppUser;
import com.example.hikmaproject.Models.User_Roles;
import com.example.hikmaproject.Security.JwtTokenProvider;
import com.example.hikmaproject.audit.Audited;
import com.example.hikmaproject.repositories.RolesRepository;
import com.example.hikmaproject.repositories.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public String authenticateUser(String username, String password) {
        // First check if the user is active
        AppUser user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated. Please contact administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return tokenProvider.generateToken(authentication);
    }

    public AppUser registerUser(String username, String email, String password, Long role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setActive(true); // Set new users as active by default

        Set<User_Roles> roles = new HashSet<>();
        User_Roles userRole = roleRepository.findById(role)
                .orElseThrow(() -> new RuntimeException("Error: Role " + role + " is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }
    
    public AppUser getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean logout() {
        SecurityContextHolder.clearContext();
        return true;
    }
}