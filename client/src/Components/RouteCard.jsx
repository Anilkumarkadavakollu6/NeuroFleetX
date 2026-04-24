import React from 'react';
import { CarFrontIcon, Users, Fuel, Star, IndianRupee } from 'lucide-react';

const RouteCard = ({ vehicle, fare, onBook, isBooking }) => {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] hover:border-cyan-500/30">
      
    
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-1">
            {vehicle.type || 'Recommended'}
          </span>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            {vehicle.name || vehicle.model}
          </h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-rose-400 group-hover:text-white transition-colors duration-300">
          {vehicle.emoji ? <span>{vehicle.emoji}</span> : <CarFrontIcon size={24} />}
        </div>
      </div>

      
      <div className="grid grid-cols-3 gap-3 mb-3">
        
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-3xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all flex flex-col items-center justify-center text-center">
          <p className="text-[8px] font-bold text-zinc-400 uppercase mb-1.5">Seats</p>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-blue-500" />
            <span className="text-sm font-black dark:text-zinc-100">{vehicle.seats || 4}</span>
          </div>
        </div>

        
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-3xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all flex flex-col items-center justify-center text-center">
          <p className="text-[8px] font-bold text-zinc-400 uppercase mb-1.5">Fuel</p>
          <div className="flex items-center gap-1.5">
            <Fuel size={14} className="text-emerald-500" />
            <span className="text-[11px] font-black dark:text-zinc-100 truncate">{vehicle.type || 'EV'}</span>
          </div>
        </div>

        
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-3xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all flex flex-col items-center justify-center text-center">
          <p className="text-[8px] font-bold text-zinc-400 uppercase mb-1.5">Rating</p>
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-black dark:text-zinc-100">{vehicle.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      
      <div className="flex items-end justify-between mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Total Fare
          </span>
          <div className="flex items-center text-zinc-900 dark:text-white">
            <IndianRupee size={20} className="stroke-[3px] mr-0.5" />
            <span className="text-2xl font-black tracking-tighter">
              {fare || vehicle.baseFare}
            </span>
          </div>
        </div>
        
        <div className="text-right pb-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
            Rate
          </span>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            ₹{vehicle.ratekm}/km
          </span>
        </div>
      </div>

      
      <button 
        onClick={() => onBook(vehicle)}
        disabled={isBooking}
        className="w-full py-3.5 cursor-pointer bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[1.5rem] font-black text-sm tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/10 dark:shadow-none disabled:opacity-70 disabled:hover:scale-100"
      >
        {isBooking ? 'Confirming...' : 'Ride Now'}
      </button>
      
    </div>
  );
};

export default RouteCard;