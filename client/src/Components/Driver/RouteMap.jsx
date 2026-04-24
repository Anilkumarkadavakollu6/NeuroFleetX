import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, Clock, Fuel, Zap, Loader2, TimerIcon } from "lucide-react";
// Added ZoomControl to the import
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const sourceIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-[2.5px] border-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const destIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-5 h-5 bg-rose-500 rounded-full border-[2.5px] border-white shadow-[0_0_12px_rgba(244,63,94,0.4)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const gpsIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="relative flex items-center justify-center w-8 h-8">
           <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-40 animate-ping"></div>
           <div class="absolute w-5 h-5 bg-blue-500 rounded-full opacity-20"></div>
           <div class="relative w-3.5 h-3.5 bg-white border-[3px] border-blue-600 rounded-full shadow-md"></div>
         </div>`,
  iconSize: [32, 32], 
  iconAnchor: [16, 16]
});

const getPositionAlongPath = (path, percentage) => {
  if (!path || path.length < 2) return path[0];
  if (percentage <= 0) return path[0];
  if (percentage >= 100) return path[path.length - 1];

  const segmentCount = path.length - 1;
  const exactSegment = (percentage / 100) * segmentCount;
  const segmentIndex = Math.floor(exactSegment);
  const segmentProgress = exactSegment - segmentIndex;

  const startPt = path[segmentIndex];
  const endPt = path[segmentIndex + 1];

  const lat = startPt[0] + (endPt[0] - startPt[0]) * segmentProgress;
  const lng = startPt[1] + (endPt[1] - startPt[1]) * segmentProgress;

  return [lat, lng];
};


const MapFitter = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 1.5 });
    }
  }, [route, map]);
  return null;
};


const RouteMap = ({ eta, routeProgress = 0 , mapSource, mapDestination})=> {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeTraced, setRouteTraced] = useState(false);

  
  const source = [mapSource.lat, mapSource.lng]; 
  console.log("Source ", mapSource.lat, mapSource.lng)
  const destination = [mapDestination.lat, mapDestination.lng]; 
  console.log(source);

 
  const routePath = [
    source,
    [28.8350, 77.5800],
    [28.6700, 77.4300],
    destination
  ];

  const currentPosition = useMemo(() => {
    return getPositionAlongPath(routePath, routeProgress);
  }, [routeProgress]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setRouteTraced(false);
    
    setTimeout(() => {
      setIsOptimizing(false);
      setRouteTraced(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 space-y-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden"
    >
     
      <style>{`
        .leaflet-bottom.leaflet-right { display: none; } 
        .leaflet-container { background: transparent !important; outline: none; }
        .animated-route {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawRoute 2.5s ease-out forwards;
        }
        @keyframes drawRoute {
          to { stroke-dashoffset: 0; }
        }
        /* Custom styling for the zoom controls to match our sleek UI */
        .leaflet-control-zoom a {
          background-color: rgba(255, 255, 255, 0.9) !important;
          color: #3f3f46 !important;
          border: 1px solid rgba(228, 228, 231, 0.8) !important;
          backdrop-filter: blur(8px);
        }
        .dark .leaflet-control-zoom a {
          background-color: rgba(24, 24, 27, 0.9) !important;
          color: #e4e4e7 !important;
          border-color: rgba(63, 63, 70, 0.8) !important;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-12 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Interactive Route</h3>
        </div>
        
        {!routeTraced ? (
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-full uppercase transition-colors disabled:opacity-70 cursor-pointer"
          >
            {isOptimizing ? <><Loader2 className="w-3 h-3 animate-spin" /> Calculating</> : "Optimize"}
          </button>
        ) : (
          <span className="text-[10px] font-bold tracking-wider text-rose-700 dark:text-rose-500 bg-emerald-50 dark:bg-zinc-900 border border-rose-200/50 dark:border-rose-500/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
             <Zap className="w-3 h-3" /> AI Optimized
          </span>
        )}
      </div>

      <div className="relative h-64 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-inner z-10">
        
        <AnimatePresence>
          {isOptimizing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[400] bg-white/40 dark:bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
            >
               <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute top-1/2 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <MapContainer 
          center={[28.75, 77.55]} 
          zoom={10} 
          className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
          zoomControl={false} 
          dragging={true}
          scrollWheelZoom={true} 
          doubleClickZoom={true} 
          touchZoom={true}       
        >
          {/* Custom positioned zoom control so it doesn't overlap our floating labels */}
          <ZoomControl position="bottomright" />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <Marker position={source} icon={sourceIcon} />
          <Marker position={destination} icon={destIcon} />

          <Polyline 
            positions={[source, destination]} 
            pathOptions={{ color: '#a1a1aa', weight: 2, dashArray: '6, 6' }} 
          />

          {routeTraced && (
            <>
              <MapFitter route={routePath} />
              <Polyline 
                positions={routePath} 
                pathOptions={{ 
                  color: '#3b82f6', 
                  weight: 4, 
                  lineCap: 'round',
                  className: 'animated-route'
                }} 
              />
              <Marker position={currentPosition} icon={gpsIcon} />
            </>
          )}
        </MapContainer>

        
        <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{mapDestination.displayName}</span>
        </div>
        
        <div className="absolute top-4 right-4 z-[400] flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm pointer-events-none">
           <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{mapSource.displayName}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 relative z-10">
        <RouteStat icon={<Clock className="w-4 h-4" />} label="ETA" value={`${eta} min`} iconColor="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-500/10" />
        <RouteStat icon={<Navigation className="w-4 h-4" />} label="Distance" value="65 km" iconColor="text-rose-600 dark:text-rose-400" bg="bg-rose-100 dark:bg-rose-800/10" />
        <RouteStat icon={<Fuel className="w-4 h-4" />} label="Est. Fuel" value="₹450" iconColor="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
        <RouteStat icon={<TimerIcon className="w-4 h-4" />} label="Time Saved" value="14 min" iconColor="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-500/10" />
      </div>

      <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 relative z-10">
        <div className="flex justify-between items-end">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Journey Progress</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">{routeProgress?.toFixed(2)}%</span>
        </div>
        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 relative"
            animate={{ width: `${routeProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function RouteStat({ icon, label, value, iconColor, bg }) {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group">
      <div className={`p-2.5 rounded-full mb-2.5 ${bg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</p>
      <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default RouteMap;