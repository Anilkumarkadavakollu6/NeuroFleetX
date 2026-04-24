package com.example.neuro.controller;
import com.example.neuro.model.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import com.example.neuro.DTO.AuthRequest;
import com.example.neuro.DTO.AuthResponse;
import com.example.neuro.model.Role;
import com.example.neuro.model.SignupRequest;
import com.example.neuro.model.User;
import com.example.neuro.security.JwtUtil;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the NeuroFleet API!";
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody SignupRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, null, "Email already in use"));
        }

        //creating new user
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.valueOf(request.getRole().toUpperCase()));

        userRepository.save(newUser);

        return ResponseEntity.ok(new AuthResponse(null, null, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        if (authentication.isAuthenticated()) {
            Optional<User> user = userRepository.findByEmail(request.email());
            if (user.isPresent()) {
                String token = jwtUtil.generateToken(user.get().getEmail(), user.get().getRole().name());
                
                return ResponseEntity.ok(new AuthResponse(token, user.get().getRole(), "Login successful"));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, "Invalid credentials"));
    }
} 