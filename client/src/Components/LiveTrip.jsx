import React, { useState, useEffect } from 'react';
import { Gauge, Battery, Navigation, XCircle, Zap, CarIcon } from 'lucide-react';

const LiveTrip = ({ vehicle, onEndTrip }) => {
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    battery: vehicle?.energyLevel || 100,
    eta: 22
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        speed: Math.floor(Math.random() * (65 - 30) + 30),
        battery: Math.max(0, prev.battery - 0.02),
        eta: Math.max(0, prev.eta - 1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800 dark:border-zinc-200 relative overflow-hidden transition-all duration-500 animate-in slide-in-from-right-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Trip</span>
            <h3 className="text-xl font-bold">{vehicle.model}</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/20 rounded-lg dark:text-rose-400">
            <CarIcon size={14} fill="currentColor"/>
            <span className="text-[10px] font-black uppercase">Neuro-Sync</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col">
            <Gauge size={20} className="text-blue-500 mb-1" />
            <span className="text-xl font-black">{telemetry.speed}</span>
            <span className="text-[10px] opacity-60 uppercase font-bold">KM/H</span>
          </div>
          <div className="flex flex-col">
            <Battery size={20} className="text-emerald-500 mb-1 " />
            <span className="text-xl font-black">{telemetry.battery.toFixed(1)}%</span>
            <span className="text-[10px] opacity-60 uppercase font-bold">Energy</span>
          </div>
          <div className="flex flex-col">
            <Navigation size={20} className="text-amber-500 mb-1" />
            <span className="text-xl font-black">{telemetry.eta}m</span>
            <span className="text-[10px] opacity-60 uppercase font-bold">ETA</span>
          </div>
        </div>

        <button 
          onClick={() => onEndTrip(telemetry.battery)}
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl cursor-pointer font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <XCircle size={16} /> End Trip
        </button>
      </div>
    </div>
  );
};

export default LiveTrip;