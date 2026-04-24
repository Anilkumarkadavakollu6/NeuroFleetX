package com.example.neuro.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String licensePlate; 

    private Long driverId; 

    @Column(nullable = false)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(nullable = false)
    private String currentLocation;

    private Integer batteryLevel;
    private Integer fuelLevel;
    private Integer speed;
    private Integer engineHealth;
    private Integer mileage;
    
    private Integer ratekm;
    private float rating;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public Integer getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Integer fuelLevel) { this.fuelLevel = fuelLevel; }

    public Integer getSpeed() { return speed; }
    public void setSpeed(Integer speed) { this.speed = speed; }

    public Integer getEngineHealth() { return engineHealth; }
    public void setEngineHealth(Integer engineHealth) { this.engineHealth = engineHealth; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public Integer getRatekm() { return ratekm; }
    public void setRatekm(Integer ratekm) { this.ratekm = ratekm; }

    public float getRating() { return rating; }
    public void setRating(float rating) { this.rating = rating; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}