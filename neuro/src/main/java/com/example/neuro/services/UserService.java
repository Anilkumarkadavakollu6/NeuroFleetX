package com.example.neuro.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.neuro.model.SignupRequest;
        
@Service
public class UserService {
    private final BCryptPasswordEncoder passwordHasher;

    public UserService(BCryptPasswordEncoder passwordHasher) {
        this.passwordHasher = passwordHasher;
    }
    private String hashPassword(String password) {
        return passwordHasher.encode(password);
    }

    public String registerUser(SignupRequest request){
        String hashedPassword = hashPassword(request.getPassword());
        System.out.println("Encrypted password: " + hashedPassword);
        return "User " + request.getEmail() + " registered successfully with hashed password: " + hashedPassword;

    }
}
