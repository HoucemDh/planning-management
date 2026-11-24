package com.example.hikmaproject.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.AppUser;
import com.example.hikmaproject.services.AuthService;

@Controller
public class AuthController {
    @Autowired
    private AuthService authService;

    @MutationMapping
    public AuthResponse login(@Argument LoginInput input) {
        String token = authService.authenticateUser(input.username(), input.password());
        AppUser user = authService.getUserByUsername(input.username());
        
        return new AuthResponse(token, user);
    }

    @MutationMapping
    public AuthResponse register(@Argument RegisterInput input) {
        AppUser user = authService.registerUser(
            input.username(),
            input.email(),
            input.password(),
            input.roleId()
        );
        
        String token = authService.authenticateUser(input.username(), input.password());
        
        return new AuthResponse(token, user);
    }

    @MutationMapping
    public LogoutResponse logout() {
        boolean success = authService.logout();
        return new LogoutResponse(
            success,
            success ? "Successfully logged out" : "Logout failed"
        );
    }

    public record LoginInput(String username, String password) {}
    public record RegisterInput(String username, String email, String password, Long roleId) {}
    public record AuthResponse(String token, AppUser appUser) {}
    public record LogoutResponse(boolean success, String message) {}
}