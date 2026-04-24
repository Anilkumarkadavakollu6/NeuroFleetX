package com.example.neuro.controller;

import com.example.neuro.model.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping("/kpi")
    public Map<String, Object> getDashboardKPIs() {
        long totalFleet = vehicleRepository.count();
        
 
        long activeVehicles = vehicleRepository.findAll().stream()
                .filter(v -> "IN_USE".equals(v.getStatus().name())).count();
                
        long evCount = vehicleRepository.findAll().stream()
                .filter(v -> "EV".equals(v.getType())).count();
                
        long needsService = vehicleRepository.findAll().stream()
                .filter(v -> "NEEDS_SERVICE".equals(v.getStatus().name())).count();

        int electrificationPercent = totalFleet == 0 ? 0 : (int) ((evCount * 100) / totalFleet);

        
        Map<String, Object> kpi = new HashMap<>();
        kpi.put("totalFleet", totalFleet);
        kpi.put("activeVehicles", activeVehicles);
        kpi.put("electrification", electrificationPercent);
        kpi.put("needsService", needsService);
        
        return kpi;
    }
}