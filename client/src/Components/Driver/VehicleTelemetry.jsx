import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Thermometer, Gauge, Droplets, Clock, Activity } from "lucide-react";


const VehicleTelemetry =({ data }) =>{
  
  const [liveData, setLiveData] = useState(data || {
    speed: 68,
    fuel: 82,
    engineHealth: 96,
    temperature: 88, 
    rpm: 2100,
    idleTime: 12,
    tirePressure: [32, 32, 31, 33] 
  });

  
  useEffect(() => {
    if (data) {
      setLiveData(data); 
      return;
    }
    
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        speed: Math.max(0, prev.speed + (Math.random() * 4 - 2)),
        rpm: Math.max(800, prev.rpm + (Math.random() * 100 - 50)),
        temperature: prev.temperature + (Math.random() * 2 - 1),
        tirePressure: prev.tirePressure.map(p => Math.random() > 0.95 ? p - 1 : p) 
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative p-6 space-y-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden"
    >
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Live Telemetry</h3>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Swift Dzire
          </span>
        </div>
      </div>

      
      <div className="grid grid-cols-3 gap-4 pt-2">
        <GaugeRing 
          value={Math.round(liveData.speed)} 
          max={160} 
          label="Speed" 
          unit="km/h" 
          color="#3b82f6" 
        />
        <GaugeRing 
          value={Math.round(liveData.fuel)} 
          max={100} 
          label="Fuel" 
          unit="%" 
          color="#10b981" 
        />
        <GaugeRing 
          value={Math.round(liveData.engineHealth)} 
          max={100} 
          label="Engine" 
          unit="%" 
          color="#6366f1"
        />
      </div>

      <div className="w-full h-px bg-zinc-200/50 dark:bg-zinc-800/50" />

      
      <div className="grid grid-cols-2 gap-3">
        <MiniStat 
          icon={<Thermometer className="w-4 h-4" />} 
          label="Coolant Temp" 
          value={`${Math.round(liveData.temperature)}°C`} 
          iconColor="text-rose-500" 
          bg="bg-rose-50 dark:bg-rose-500/10"
        />
        <MiniStat 
          icon={<Droplets className="w-4 h-4" />} 
          label="Engine RPM" 
          value={Math.round(liveData.rpm).toLocaleString()} 
          iconColor="text-blue-500" 
          bg="bg-blue-50 dark:bg-blue-500/10"
        />
        <MiniStat 
          icon={<Clock className="w-4 h-4" />} 
          label="Idle Time" 
          value={`${liveData.idleTime} min`} 
          iconColor="text-indigo-500" 
          bg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <TirePressure pressures={liveData.tirePressure} />
      </div>
    </motion.div>
  );
}


function GaugeRing({ value, max, label, unit, color }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  
  const safeValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2 group">
      <div className="relative w-20 h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        
        
        <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-zinc-100 dark:text-zinc-800"
          />
          
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="drop-shadow-md"
          />
        </svg>

        
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-black text-zinc-900 dark:text-white leading-none font-mono tracking-tighter">
            {value}
          </span>
        </div>
      </div>
      
      
      <div className="text-center">
        <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{label}</p>
        <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">{unit}</p>
      </div>
    </div>
  );
}


function MiniStat({ icon, label, value, iconColor, bg }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
      <div className={`p-2 rounded-full ${bg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 leading-none">{value}</p>
      </div>
    </div>
  );
}


function TirePressure({ pressures }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
      <div className="grid grid-cols-2 gap-1 w-10">
        {pressures.map((p, i) => {
         
          const isLow = p < 30;
          return (
            <div 
              key={i} 
              className={`flex items-center justify-center h-4 rounded text-[9px] font-bold font-mono 
                ${isLow ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"}`}
            >
              {p}
            </div>
          );
        })}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Tire PSI</p>
        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-none">Status</p>
      </div>
    </div>
  );
}

export default VehicleTelemetry;