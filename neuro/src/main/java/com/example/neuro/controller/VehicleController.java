package com.example.neuro.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.neuro.model.Vehicle;
import com.example.neuro.model.VehicleRepository;
import com.example.neuro.model.VehicleStatus;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {
    

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles(){
        return vehicleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id){
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());
    }


    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle){
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        return vehicleRepository.save(vehicle);
    }


 @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);

        if (optionalVehicle.isPresent()) {
            Vehicle existingVehicle = optionalVehicle.get();
            
            if (vehicleDetails.getName() != null) existingVehicle.setName(vehicleDetails.getName());
            if (vehicleDetails.getType() != null) existingVehicle.setType(vehicleDetails.getType());
            if (vehicleDetails.getStatus() != null) existingVehicle.setStatus(vehicleDetails.getStatus());
            if (vehicleDetails.getCurrentLocation() != null) existingVehicle.setCurrentLocation(vehicleDetails.getCurrentLocation());
            
            if (vehicleDetails.getBatteryLevel() != null) existingVehicle.setBatteryLevel(vehicleDetails.getBatteryLevel());
            if (vehicleDetails.getFuelLevel() != null) existingVehicle.setFuelLevel(vehicleDetails.getFuelLevel());
            if (vehicleDetails.getSpeed() != null) existingVehicle.setSpeed(vehicleDetails.getSpeed());
            if (vehicleDetails.getEngineHealth() != null) existingVehicle.setEngineHealth(vehicleDetails.getEngineHealth());
            if (vehicleDetails.getMileage() != null) existingVehicle.setMileage(vehicleDetails.getMileage());
            
            if (vehicleDetails.getLicensePlate() != null) existingVehicle.setLicensePlate(vehicleDetails.getLicensePlate());
            if (vehicleDetails.getDriverId() != null) existingVehicle.setDriverId(vehicleDetails.getDriverId());
            if (vehicleDetails.getRatekm() != null) existingVehicle.setRatekm(vehicleDetails.getRatekm());
            
            if (vehicleDetails.getRating() != 0.0f) existingVehicle.setRating(vehicleDetails.getRating());

            Vehicle updatedVehicle = vehicleRepository.save(existingVehicle);
            return ResponseEntity.ok(updatedVehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    

    

    
}
