import React, { useEffect, useState, useCallback } from "react";
import UserLayout from "../Components/UserLayout";
import BookingCard from "../Components/BookingCard";
import LiveTrip from "../Components/LiveTrip";
import { CarFrontIcon } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-toastify";

const UserDashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRides, setMyRides] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "ev"

  // ── Sync rides from localStorage ──────────────────────────
  const syncRides = useCallback(() => {
    try {
      const data = localStorage.getItem("neurofleetx_trips");
      const parsed = data ? JSON.parse(data) : [];
      setMyRides(parsed);
    } catch (e) {
      console.error("Sync error:", e);
    }
  }, []);

  useEffect(() => {
    syncRides();
    const timer = setInterval(syncRides, 2000);
    return () => clearInterval(timer);
  }, [syncRides]);

  // ── Fetch vehicles from backend ───────────────────────────
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get("/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Failed to fetch fleet:", error);
        toast.error("Could not load fleet data. Check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // ── Derived state ─────────────────────────────────────────
  const activeTrip = myRides.find(
    (trip) => trip.status === "Confirmed" || trip.status === "In Progress"
  );

  const activeVehicle = activeTrip
    ? vehicles.find((v) => v.name === activeTrip.vehicleName) || {
        name: activeTrip.vehicleName,
      }
    : null;

  const filteredVehicles = vehicles.filter((v) => {
    if (v.status !== "AVAILABLE" || v.engineHealth <= 85) return false;
    if (filter === "ev") return v.type === "EV";
    return true;
  });

  const suggestedCars = filteredVehicles
    .sort((a, b) => {
      const energyA = a.type === "EV" ? a.batteryLevel : a.fuelLevel;
      const energyB = b.type === "EV" ? b.batteryLevel : b.fuelLevel;
      return (energyB ?? 0) - (energyA ?? 0);
    })
    .slice(0, 6);

  // ── Completed trips for Recent Activity ───────────────────
  const completedTrips = myRides
    .filter((t) => t.status === "Completed")
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 5);

  // ── Book a vehicle ────────────────────────────────────────
  const handleBooking = (vehicle) => {
    if (activeTrip) {
      toast.warning("You already have an active trip.");
      return;
    }
    const newTrip = {
      id: `NF-${Date.now()}`,
      vehicleName: vehicle.name,
      vehicleType: vehicle.type,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
      fare: "₹" + (Math.floor(Math.random() * 300) + 200),
      distance: "8.4 km",
      duration: "22 mins",
      source: {
        displayName: "Viman Nagar, Pune",
        name: "Viman Nagar, Pune",
        lat: 18.5679,
        lng: 73.9143,
      },
      destination: {
        displayName: "Hinjewadi Phase 3",
        name: "Hinjewadi Phase 3",
        lat: 18.5913,
        lng: 73.7389,
      },
    };
    const updated = [...myRides, newTrip];
    localStorage.setItem("neurofleetx_trips", JSON.stringify(updated));
    setMyRides(updated);
    toast.success(`🚗 ${vehicle.name} booked! Waiting for driver...`);
  };

  // ── End trip ──────────────────────────────────────────────
  const handleEndTrip = () => {
    if (!activeTrip) return;
    const stored = JSON.parse(localStorage.getItem("neurofleetx_trips")) || [];
    const updated = stored.map((trip) =>
      trip.id === activeTrip.id
        ? { ...trip, status: "Completed", completedAt: new Date().toISOString() }
        : trip
    );
    localStorage.setItem("neurofleetx_trips", JSON.stringify(updated));
    setMyRides(updated);
    toast.info("Trip completed successfully!");
  };

  // ── CO2 impact ────────────────────────────────────────────
  const co2Saved = completedTrips.reduce((acc, trip) => {
    return acc + (trip.vehicleType === "EV" ? 2.1 : 0.4);
  }, 0).toFixed(1);

  return (
    <UserLayout>
      <div className="mx-auto space-y-10 animate-in fade-in duration-700">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
              {activeVehicle ? "Live Tracking" : "Explore Fleet"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2 mt-1">
              {activeVehicle ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  Tracking Live
                </>
              ) : (
                "AI-powered recommendations for your next journey."
              )}
            </p>
          </div>

          {/* Filter tabs */}
          {!activeVehicle && (
            <div className="hidden md:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === "all"
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("ev")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === "ev"
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                EVs Only
              </button>
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <div className="relative">
          {activeVehicle ? (
            <div className="w-full lg:col-span-3 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl shadow-blue-500/5">
              <LiveTrip vehicle={activeVehicle} onEndTrip={handleEndTrip} />
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : suggestedCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <CarFrontIcon size={40} className="text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-medium">No vehicles available right now.</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                {filter === "ev" ? "Try switching to All vehicles" : "Check back soon"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestedCars.map((vehicle) => (
                <div key={vehicle.id} className="group hover:-translate-y-2 transition-all duration-300">
                  <BookingCard vehicle={vehicle} onBook={handleBooking} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Recent Activity</h3>
              <button
                onClick={() => toast.info("Full history coming soon!")}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                View All
              </button>
            </div>

            {completedTrips.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                  <CarFrontIcon size={24} className="text-zinc-400" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">No recent trips to display.</p>
                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                  Start your first neuro-trip today
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{trip.vehicleName}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {trip.source?.displayName} → {trip.destination?.displayName}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(trip.completedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-zinc-900 dark:text-white">{trip.fare}</p>
                      <p className="text-xs text-zinc-400">{trip.distance}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Card */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your Impact</h3>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">CO₂ Saved</p>
                <p className="text-5xl font-black mt-2 tracking-tighter">
                  {co2Saved}<span className="text-xl opacity-60 ml-2">kg</span>
                </p>
                <p className="text-xs mt-2 opacity-70">{completedTrips.length} trip{completedTrips.length !== 1 ? "s" : ""} completed</p>
                <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <span className="text-[10px] font-bold">
                    {completedTrips.length >= 5 ? "Top 5% of Fleet Users 🏆" : "Keep riding to level up!"}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;