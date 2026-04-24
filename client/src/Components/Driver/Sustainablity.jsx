import React from 'react';
import { Leaf, TrendingDown, Droplets, Zap, Fuel } from "lucide-react";
import { motion } from "framer-motion";

const SustainabilityPanel =({ co2Saved = 142.5, ecoScore = 88, fuelEfficiency = 92 })=> {
  return (
    <div className="relative p-6 space-y-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden">
      
     
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Sustainability</h3>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
          <span className="relative flex h-2 w-2">
           
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Optimized
          </span>
        </div>
      </div>

    
      <div className="flex items-center justify-center py-2">
        <GaugeRing 
          value={ecoScore} 
          max={100} 
          label="Eco Score" 
          unit="pts" 
          color="#10b981" 
        />
      </div>

     
      <div className="grid grid-cols-3 gap-3">
        <EcoStat 
          icon={<TrendingDown className="w-4 h-4" />} 
          label="CO₂ Saved" 
          value={`${co2Saved} kg`} 
          iconColor="text-emerald-600 dark:text-emerald-400" 
          bg="bg-emerald-50 dark:bg-emerald-500/10" 
        />
        <EcoStat 
          icon={<Droplets className="w-4 h-4" />} 
          label="Fuel Opt." 
          value={`${fuelEfficiency}%`} 
          iconColor="text-blue-600 dark:text-blue-400" 
          bg="bg-blue-50 dark:bg-blue-500/10" 
        />
        <EcoStat 
          icon={<Fuel className="w-4 h-4" />} 
          label="Energy" 
          value="A+" 
          iconColor="text-indigo-600 dark:text-indigo-400" 
          bg="bg-indigo-50 dark:bg-indigo-500/10" 
        />
      </div>

      <div className="w-full h-px bg-zinc-200/50 dark:bg-zinc-800/50" />

      {/* Eco Trend Bar Chart - Now Static */}
      <div className="pt-2">
        <div className="flex items-end gap-1.5 h-12 justify-center mb-2">
          {[45, 60, 55, 70, 65, 80, 75, 85, 88, 91, 87, 93].map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-t-sm bg-gradient-to-t from-emerald-500/20 to-emerald-500/80 dark:from-emerald-400/20 dark:to-emerald-400/80 shadow-sm"
              style={{ height: `${h / 2}%` }}
            />
          ))}
        </div>
        <p className="text-[10px] font-semibold tracking-wide text-center text-zinc-500 dark:text-zinc-400 uppercase">
          12-Week Eco Trend
        </p>
      </div>
    </div>
  );
}


function GaugeRing({ value, max, label, unit, color }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-zinc-100 dark:text-zinc-800"
          />
        
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="drop-shadow-md"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center mt-1">
          <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none font-mono tracking-tighter">
            {value}
          </span>
        </div>
      </div>
      
      <div className="text-center mt-1">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{label}</p>
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{unit}</p>
      </div>
    </div>
  );
}


function EcoStat({ icon, label, value, iconColor, bg }) {
  return (
   
    <div className="flex flex-col items-center justify-center text-center space-y-1.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 rounded-xl p-2.5">
      <span className={`p-2 rounded-full ${bg} ${iconColor}`}>
        {icon}
      </span>
      <div>
        <p className="text-[13px] font-bold font-mono text-zinc-900 dark:text-zinc-100 leading-tight">{value}</p>
        <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default SustainabilityPanel;