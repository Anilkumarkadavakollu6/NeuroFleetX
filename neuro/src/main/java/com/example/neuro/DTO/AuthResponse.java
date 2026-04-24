package com.example.neuro.DTO;

import com.example.neuro.model.Role;

public class AuthResponse {
    private String token;
    private String role;  // String, not Role enum
    private String message;

    public AuthResponse(String token, Role role, String message) {
        this.token = token;
        this.role = role != null ? role.name() : null;  // convert enum to string
        this.message = message;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}