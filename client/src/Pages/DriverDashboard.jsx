import React, { useState, useEffect, useCallback } from "react";
import DriverLayout from "../Components/Driver/DriverLayout";
import RouteMap from "../Components/Driver/RouteMap";
import VehicleTelemetry from "../Components/Driver/VehicleTelemetry";
import SustainabilityPanel from "../Components/Driver/Sustainablity";
import Loading from "../Components/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const DriverDashboard = () => {
  const [routeProgress, setRouteProgress] = useState(0);
  const [eta, setEta] = useState(40);
  const [incomingRides, setIncomingRides] = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [mapSource, setMapSource] = useState(null);
  const [mapDestination, setMapDestination] = useState(null);

  // ── Sync trips from localStorage ─────────────────────────
  const syncTrips = useCallback(() => {
    try {
      const storedData = localStorage.getItem("neurofleetx_trips");
      if (!storedData) {
        setMapSource(null);
        setMapDestination(null);
        setIncomingRides([]);
        setActiveMission(null);
        return;
      }

      const parsedTrips = JSON.parse(storedData);
      if (!Array.isArray(parsedTrips) || parsedTrips.length === 0) {
        setMapSource(null);
        setMapDestination(null);
        setIncomingRides([]);
        setActiveMission(null);
        return;
      }

      const validTrips = parsedTrips.filter(
        (trip) => trip?.status && trip?.source && trip?.destination
      );

      // Active (in progress) mission
      const activeTrip = validTrips.find((t) => t.status === "In Progress") || null;
      setActiveMission(activeTrip);

      // Pending rides waiting for driver
      const pendingTrips = validTrips.filter((t) => t.status === "Confirmed");
      setIncomingRides(pendingTrips);

      // Map display priority: active > first pending > nothing
      const tripToShow = activeTrip || (pendingTrips[0] ?? null);
      if (tripToShow) {
        setMapSource(tripToShow.source);
        setMapDestination(tripToShow.destination);
      } else {
        setMapSource(null);
        setMapDestination(null);
      }
    } catch (error) {
      console.error("LocalStorage sync error:", error);
      setMapSource(null);
      setMapDestination(null);
      setIncomingRides([]);
    }
  }, []);

  useEffect(() => {
    syncTrips();
    const interval = setInterval(syncTrips, 2000);
    return () => clearInterval(interval);
  }, [syncTrips]);

  // ── Route progress simulation ─────────────────────────────
  useEffect(() => {
    if (!activeMission) return; // only tick when on an active trip
    const timer = setInterval(() => {
      setRouteProgress((prev) => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 0.5;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeMission]);

  // ── ETA calculation ───────────────────────────────────────
  useEffect(() => {
    const totalTripTime = 75;
    const remaining = totalTripTime - totalTripTime * (routeProgress / 100);
    setEta(Math.max(0, Math.ceil(remaining)));
  }, [routeProgress]);

  // ── Accept ride ───────────────────────────────────────────
  const handleAcceptRide = (rideId) => {
    const storedTrips = JSON.parse(localStorage.getItem("neurofleetx_trips")) || [];
    const acceptedTrip = storedTrips.find((t) => t.id === rideId);

    if (!acceptedTrip) {
      toast.error("Ride not found.");
      return;
    }

    const updatedTrips = storedTrips.map((trip) =>
      trip.id === rideId
        ? { ...trip, status: "In Progress", acceptedAt: new Date().toISOString() }
        : trip
    );

    localStorage.setItem("neurofleetx_trips", JSON.stringify(updatedTrips));

    setActiveMission({ ...acceptedTrip, status: "In Progress" });
    setMapSource(acceptedTrip.source);
    setMapDestination(acceptedTrip.destination);
    setIncomingRides((prev) => prev.filter((r) => r.id !== rideId));
    setRouteProgress(0);

    toast.success(`Ride accepted! Navigating to ${acceptedTrip.source?.displayName ?? "pickup"}.`);
  };

  // ── Decline ride ──────────────────────────────────────────
  const handleDeclineRide = (rideId) => {
    const storedTrips = JSON.parse(localStorage.getItem("neurofleetx_trips")) || [];
    const updatedTrips = storedTrips.map((trip) =>
      trip.id === rideId ? { ...trip, status: "Declined" } : trip
    );
    localStorage.setItem("neurofleetx_trips", JSON.stringify(updatedTrips));
    setIncomingRides((prev) => prev.filter((r) => r.id !== rideId));
    toast.info("Ride declined.");
  };

  // ── Complete active mission ───────────────────────────────
  const handleCompleteTrip = () => {
    if (!activeMission) return;
    const storedTrips = JSON.parse(localStorage.getItem("neurofleetx_trips")) || [];
    const updatedTrips = storedTrips.map((trip) =>
      trip.id === activeMission.id
        ? { ...trip, status: "Completed", completedAt: new Date().toISOString() }
        : trip
    );
    localStorage.setItem("neurofleetx_trips", JSON.stringify(updatedTrips));
    setActiveMission(null);
    setMapSource(null);
    setMapDestination(null);
    setRouteProgress(0);
    toast.success("Trip completed! Great work.");
  };

  const currentRide = incomingRides[0] ?? null;

  return (
    <DriverLayout>

      {/* ── Map or loading ── */}
      {mapSource && mapDestination ? (
        <RouteMap
          eta={eta}
          routeProgress={routeProgress}
          mapSource={mapSource}
          mapDestination={mapDestination}
        />
      ) : (
        <Loading message="Waiting for incoming rides..." />
      )}

      {/* ── Active mission complete button ── */}
      {activeMission && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleCompleteTrip}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95"
          >
            <CheckCircle size={18} /> Complete Trip
          </button>
        </div>
      )}

      <VehicleTelemetry />
      <SustainabilityPanel />

      {/* ── Incoming ride popup ── */}
      <AnimatePresence>
        {currentRide && !activeMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%", scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-amber-500/50 rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

              {/* Ride header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                      New Request
                    </span>
                  </div>
                  <h4 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                    {currentRide.fare}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    {currentRide.distance}
                  </p>
                  <p className="text-sm font-black text-zinc-800 dark:text-zinc-300">
                    {currentRide.duration}
                  </p>
                </div>
              </div>

              {/* Route details */}
              <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4 mb-6 relative">
                <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                <div className="flex items-start gap-4 relative z-10 mb-4">
                  <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-white mt-1 border-2 border-white dark:border-zinc-950 shadow-sm" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pickup</p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-300 line-clamp-1">
                      {currentRide.source?.displayName || currentRide.source?.name || "Dropped Pin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-rose-500 mt-1 border-2 border-white dark:border-zinc-950 shadow-sm" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Dropoff</p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-300 line-clamp-1">
                      {currentRide.destination?.displayName || currentRide.destination?.name || "Dropped Pin"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeclineRide(currentRide.id)}
                  className="w-16 bg-zinc-100 cursor-pointer dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-500 text-zinc-500 py-4 rounded-2xl font-black transition-all flex items-center justify-center flex-shrink-0"
                >
                  <XCircle size={24} />
                </button>
                <button
                  onClick={() => handleAcceptRide(currentRide.id)}
                  className="flex-1 bg-zinc-900 cursor-pointer dark:bg-white hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 dark:hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <CheckCircle size={18} /> Accept
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DriverLayout>
  );
};

export default DriverDashboard;