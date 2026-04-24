import React, { useState, useEffect } from "react";
import {
  Route,
  ChevronDown,
  MapPin,
  Clock,
  Sparkles,
  Navigation,
  Clock2,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { AnimatePresence, motion } from "framer-motion";

import UserLayout from "./UserLayout";
import LocationInput from "./LocationInput";
import MapController from "./MapController";
import { sourceIcon, destIcon } from "./mapIcons";
import { calculateFare, haversineDistance} from "../utils/util";
import RouteCard from "./RouteCard";
import BookingSuccessModal from "./BookedPopUp";
import { getLiveCoordinates } from "../utils/geoCoder";
import api from "../utils/api";
import Loading from "./Loading";



const saveRide = (ride) => {
  const existing = JSON.parse(localStorage.getItem("neurofleetx_trips")) || [];
  localStorage.setItem(
    "neurofleetx_trips",
    JSON.stringify([ride, ...existing]),
  );
};

const UserTrip = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedRide, setBookedRide] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nearbyVehicles, setNearbyVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    if (!source || !destination) {
      setRouteCoords([]);
      setDistance(0);
      setDuration("");
      return;
    }

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRouteCoords(route.geometry.coordinates.map((c) => [c[1], c[0]]));
          setDistance(route.distance / 1000);

          const mins = Math.round(route.duration / 60);
          setDuration(
            mins < 60
              ? `${mins} mins`
              : `${Math.floor(mins / 60)}h ${mins % 60}m`,
          );
        }
      })
      .catch(() => {
        const d = haversineDistance(
          source.lat,
          source.lng,
          destination.lat,
          destination.lng,
        );
        setDistance(d);
        setDuration(`${Math.round((d / 40) * 60)} mins`);
        setRouteCoords([
          [source.lat, source.lng],
          [destination.lat, destination.lng],
        ]);
      });
  }, [source, destination]);

  useEffect(() => {
    const fetchNearbyVehicles = async () => {
      if (!source) return;
      setLoadingVehicles(true);

      try {
        const response = await api.get("/vehicles");
        console.log("VEHICLES, ", response.data);
        const allVehicles = response.data;

        const availableVehicles = allVehicles.filter(
          (v) => v.status === "AVAILABLE",
        );

        const vehiclesWithDistance = await Promise.all(
          availableVehicles.map(async (vehicle) => {
            const coords = await getLiveCoordinates(vehicle.currentLocation);

            const distanceToUser = haversineDistance(
              source.lat,
              source.lng,
              coords[0],
              coords[1],
            );

            return {
              ...vehicle,
              distanceAway: distanceToUser,
              etaToPickup: Math.ceil(distanceToUser * 2.5),
            };
          }),
        );

        const closestVehicles = vehiclesWithDistance
          .filter((v) => v.distanceAway <= 15)
          .sort((a, b) => a.distanceAway - b.distanceAway);

        setNearbyVehicles(closestVehicles);
      } catch (error) {
        console.error("Failed to map nearby vehicles", error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    if (showVehicles && source) {
      fetchNearbyVehicles();
    }
  }, [showVehicles, source]);

  const handleBook = (vehicle) => {
    if (!source || !destination || isBooking) return;
    setIsBooking(true);

    const fare = calculateFare(vehicle, distance);
    const ride = {
      id: vehicle.id,
      source,
      destination,
      distance: `${distance.toFixed(1)} km`,
      distanceKm: distance,
      duration,
      fare: `₹${fare}`,
      fareAmount: fare,
      rideType: vehicle.type,
      vehicleName: vehicle.name || vehicle.model,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveRide(ride);
      setBookedRide(ride);
      setIsBooking(false);
      setShowSuccess(true);
    }, 1500);
  };

  const getETA = () => {
    if (!duration) return "Calculating...";
    const now = new Date();

    let totalTripMins = 0;
    const minsMatch = duration.match(/(\d+)\s*mins?/);
    const hrsMatch = duration.match(/(\d+)h/);
    if (hrsMatch) totalTripMins += parseInt(hrsMatch[1]) * 60;
    if (minsMatch) totalTripMins += parseInt(minsMatch[1]);

    now.setMinutes(now.getMinutes() + totalTripMins);

    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          <div className="lg:col-span-2 rounded-xl p-5 space-y-4 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Plan Route
              </h2>
            </div>

            <LocationInput
              label="Pickup Location"
              icon={MapPin}
              placeholder="Search pickup location..."
              value={source?.name || ""}
              onSelect={(loc) => setSource(loc)}
              onClear={() => setSource(null)}
              iconColor="text-emerald-500"
              accentRing="focus:ring-emerald-500/20"
            />

            <div className="flex items-center gap-3 pl-5 -my-2">
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>

            <LocationInput
              label="Drop-off Location"
              icon={Navigation}
              placeholder="Search destination..."
              value={destination?.name || ""}
              onSelect={(loc) => setDestination(loc)}
              onClear={() => setDestination(null)}
              iconColor="text-blue-500"
              accentRing="focus:ring-blue-500/20"
            />

            <button
              disabled={!source || !destination || distance === 0}
              onClick={() => setShowVehicles(true)}
              className={`w-full mt-6 py-4 rounded-[1.5rem] font-black text-sm tracking-wide transition-all ${
                !source || !destination || distance === 0
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/10 dark:shadow-none"
              }`}
            >
              Find Vehicles
            </button>
          </div>

          <div
            className="lg:col-span-3 lg:h-auto rounded-2xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
            style={{ height: "calc(100vh - 400px)" }}
          >
            <div className="w-full h-[42vh] lg:h-full relative">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                className="w-full h-full"
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OSM &copy; CARTO"
                />
                <MapController source={source} destination={destination} />

                {source && (
                  <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
                    <Popup>
                      <div className="text-sm font-semibold">{source.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        📍 Pickup Location
                      </div>
                    </Popup>
                  </Marker>
                )}

                {destination && (
                  <Marker
                    position={[destination.lat, destination.lng]}
                    icon={destIcon}
                  >
                    <Popup>
                      <div className="text-sm font-semibold">
                        {destination.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        🏁 Drop-off Location
                      </div>
                    </Popup>
                  </Marker>
                )}

                {routeCoords.length > 1 && (
                  <Polyline
                    positions={routeCoords}
                    pathOptions={{
                      color: "#06b6d4",
                      weight: 4,
                      opacity: 0.85,
                      dashArray: "12, 8",
                      lineCap: "round",
                    }}
                  />
                )}
              </MapContainer>

              <AnimatePresence>
                {distance > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    className="absolute bottom-4 left-4 right-4 lg:right-auto bg-zinc-800 backdrop-blur-2xl border border-zinc-700/60 rounded-2xl p-4 z-[1000]"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                          <Route size={18} className="text-rose-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Distance
                          </p>
                          <p className="text-lg font-extrabold text-white leading-tight">
                            {distance.toFixed(1)} km
                          </p>
                        </div>
                      </div>
                      <div className="w-px h-10 bg-slate-700" />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
                          <Clock size={18} className="text-violet-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Duration
                          </p>
                          <p className="text-lg font-extrabold text-white leading-tight">
                            {duration}
                          </p>
                        </div>
                      </div>

                      {getETA() && (
                        <>
                          <div className="w-px h-10 bg-slate-700 hidden sm:block" />

                          <div className="hidden sm:flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                              <Clock2 size={18} className="text-emerald-400" />
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                ETA
                              </p>

                              <p className="text-lg font-extrabold text-white leading-tight">
                                {getETA()}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {showVehicles && distance > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-10"
          >
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-2 mb-4">
              Available Rides
            </h3>

            {loadingVehicles ? (
              <Loading message="Searching" />
            ) : nearbyVehicles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem]"
              >
                <p className="text-zinc-900 dark:text-white font-bold mb-1">
                  No vehicles in range.
                </p>
                <p className="text-xs text-zinc-500">
                  Expand your search radius or try a different pickup zone.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {nearbyVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RouteCard
                      vehicle={vehicle}
                      fare={calculateFare(vehicle, distance)}
                      isBooking={isBooking}
                      onBook={handleBook}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <BookingSuccessModal
          isOpen={showSuccess}
          ride={bookedRide}
          onClose={() => setShowSuccess(false)}
          onViewRides={() => setShowSuccess(false)}
        />
      </div>
    </UserLayout>
  );
};

export default UserTrip;
