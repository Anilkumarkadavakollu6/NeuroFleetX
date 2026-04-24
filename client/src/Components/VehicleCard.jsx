import React from 'react';

const VehicleCard = ({ vehicle }) => {
  
  const getStatusStyles = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30';
      case 'IN_USE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30';
      case 'NEEDS_SERVICE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800/30';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };


  const getEnergyColor = (level) => {
    if (level > 50) return 'bg-emerald-500';
    if (level > 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col hover:shadow-lg transition-shadow duration-300">
      
      
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl border border-zinc-200 dark:border-zinc-700">
            {vehicle.type === 'EV' ? '⚡' : '⛽'}
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-l leading-tight">
              {vehicle.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{vehicle.model}</p>
          </div>
        </div>
        
        
        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusStyles(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>

     
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-5">
        <svg className="w-4 h-4 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span className="truncate">{vehicle.currentLocation}</span>
      </div>

      
      <div className="grid grid-cols-3 gap-2 mb-6 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
        <div className="flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Speed</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            {vehicle.status === 'IN_USE' ? `${vehicle.speed}` : '0'}<span className="text-xs font-normal text-zinc-500 ml-0.5">km/h</span>
          </span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Odo</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            {vehicle.mileage}<span className="text-xs font-normal text-zinc-500 ml-0.5">k</span>
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Health</span>
          <span className={`font-semibold text-sm ${vehicle.health < 60 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {vehicle.engineHealth}%
          </span>
        </div>
      </div>

      
      <div className="mt-auto">
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span className="text-zinc-500 uppercase tracking-wider">
            {vehicle.type === 'EV' ? 'Battery' : 'Fuel'}
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {vehicle.type === 'EV' ? vehicle.batteryLevel : vehicle.fuelLevel}%
          </span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getEnergyColor(vehicle.type === 'EV' ? vehicle.batteryLevel : vehicle.fuelLevel)}`} 
            style={{ width: `${vehicle.type === 'EV' ? vehicle.batteryLevel : vehicle.fuelLevel}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
};

export default VehicleCard;