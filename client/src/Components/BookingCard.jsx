import React from 'react'
import { Zap, Battery, ShieldCheck, MapPin, CarFront, CarFrontIcon, Fuel } from 'lucide-react';

const BookingCard = ({ vehicle, onBook }) => {
  const isEV = vehicle.type === 'EV';
  const energyLevel = isEV ? vehicle.batteryLevel : vehicle.fuelLevel;
  const energyLabel = isEV ? 'Battery' : 'Fuel';

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] hover:border-rose-500/30">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-1">Recommended</span>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{vehicle.name}</h3>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
          <CarFrontIcon size={20} />
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-3xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all">
          <p className="text-[8px] font-bold text-zinc-400 uppercase mb-2">{energyLabel}</p>
          <div className="flex items-center gap-2">
            
            {isEV ? (
                <Battery size={18} className="text-emerald-500" />
            ) : (
                <Fuel size={18} className="text-orange-500" />
            )}
            <span className="text-sm font-black dark:text-zinc-100">{energyLevel}%</span>
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-3xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all">
          <p className="text-[8px] font-bold text-zinc-400 uppercase mb-2">Safety</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-500" />
            <span className="text-sm font-black dark:text-zinc-100">{vehicle.engineHealth}%</span>
          </div>
        </div>
      </div>

      
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-6 px-2">
        <MapPin size={16} />
        <span className="text-xs font-medium truncate">{vehicle.currentLocation}</span>
      </div>

      
      <button 
        onClick={() => onBook(vehicle)}
        className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[1.5rem] font-black text-sm tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/10 dark:shadow-none"
      >
        Ride Now
      </button>
    </div>
  );
};

export default BookingCard;