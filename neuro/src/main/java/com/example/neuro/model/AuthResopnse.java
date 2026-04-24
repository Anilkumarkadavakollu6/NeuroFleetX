package com.example.neuro.model;

public class AuthResopnse {
    private String token;
    private String role;

    public AuthResopnse(String token , String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }
    public String getRole() {
        return role;
    }
}
