import React, { useState } from 'react';
import AdminLayout from '../Components/AdminLayout';
import VehicleCard from '../Components/VehicleCard';
import AddVehicle from '../Components/AddVehicle';
import { useEffect } from 'react';
import api from '../utils/api';
import Loading from '../Components/Loading';


const mockFleet = [
  { id: 'V-1042', model: 'TATA Nexon EV', type: 'EV', status: 'In Use', location: 'Connaught Place, Delhi', energyLevel: 78, speed: 45, mileage: 12.4, health: 95 },
  { id: 'V-1043', model: 'TATA Nexon EV', type: 'EV', status: 'Available', location: 'Cyber City, Gurugram', energyLevel: 100, speed: 0, mileage: 8.1, health: 99 },
  { id: 'V-1044', model: 'Mahindra XUV400', type: 'EV', status: 'Needs Service', location: 'Okhla Phase 2, Delhi', energyLevel: 15, speed: 0, mileage: 42.6, health: 48 },
  { id: 'V-2011', model: 'Maruti Dzire', type: 'ICE', status: 'In Use', location: 'Sector 18, Noida', energyLevel: 45, speed: 62, mileage: 55.3, health: 88 },
  { id: 'V-1045', model: 'TATA Nexon EV', type: 'EV', status: 'Available', location: 'Indira Gandhi Airport', energyLevel: 88, speed: 0, mileage: 5.2, health: 97 },
  { id: 'V-2012', model: 'Maruti Dzire', type: 'ICE', status: 'Available', location: 'Vasant Kunj, Delhi', energyLevel: 60, speed: 0, mileage: 28.9, health: 82 },
  { id: 'V-1046', model: 'TATA Punch EV', type: 'EV', status: 'In Use', location: 'Hauz Khas, Delhi', energyLevel: 32, speed: 38, mileage: 19.7, health: 91 },
  { id: 'V-2013', model: 'Hyundai Aura', type: 'ICE', status: 'Needs Service', location: 'Sector 62, Noida', energyLevel: 8, speed: 0, mileage: 89.4, health: 35 },
  { id: 'V-1048', model: 'TATA SUV', type: 'ICE', status: 'In Use', location: 'Cyber City, Gurugram', energyLevel: 65, speed: 42, mileage: 34.2, health: 92 }
];

const FleetInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [vehicles, setVehicles] = useState([]);
  const[loading, setLoading] = useState(true);

  const [fleet, setFleet] = useState(mockFleet);
  const [isVOpen, setIsVOpen] = useState(false); 


  const handleAddVehicle = (newVehicle) => {
  setFleet([newVehicle, ...fleet]); 
};

useEffect(()=>{
  const fetchData = async()=>{
    try {
      const response = await api.get('/vehicles');
      console.log(response.data);
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch fleet:", error);
      toast.error("Could not load fleet data. Check your connection.");
    }
    finally{
      setLoading(false);
    }
  };

  fetchData();

},[]);

  const filteredFleet = vehicles.filter(vehicle => 
  vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
);

if (loading) return <Loading/>

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Fleet Inventory
          </h1>
          
          
          <div className="flex gap-3 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search ID or Location..." 
              className="px-4 py-2 w-full sm:w-64 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <button onClick={()=>setIsVOpen(true)} className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors whitespace-nowrap">
              + Add Vehicle
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFleet.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <AddVehicle isOpen={isVOpen} onClose={() => setIsVOpen(false)} onAdd={handleAddVehicle} />

        
        {filteredFleet.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No vehicles found matching your search.
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default FleetInventoryPage;