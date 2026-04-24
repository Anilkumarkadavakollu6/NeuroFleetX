package com.example.neuro.DTO;

import com.example.neuro.model.Role;

public record RegisterRequest(String name, String email, String password, Role role) {}