
// export const VEHICLES = [
//   {
//     name: 'TATA Nexon',
//     type: 'Economy',
//     emoji: '🚗',
//     baseFare: 50,
//     ratePerKm: 12,
//     multiplier: 1.0,
//     seats: 5,
//     fuel: 'Petrol / EV',
//     rating: 4.5,
//     accent: 'emerald',
//     badgeBg: 'bg-emerald-500/20',
//     badgeText: 'text-emerald-400',
//     borderColor: 'border-emerald-500/30',
//     glowColor: 'shadow-emerald-500/10',
//   },
//   {
//     name: 'TATA Harrier',
//     type: 'Premium',
//     emoji: '🚙',
//     baseFare: 80,
//     ratePerKm: 16,
//     multiplier: 1.5,
//     seats: 5,
//     fuel: 'Diesel',
//     rating: 4.7,
//     accent: 'cyan',
//     badgeBg: 'bg-cyan-500/20',
//     badgeText: 'text-cyan-400',
//     borderColor: 'border-cyan-500/30',
//     glowColor: 'shadow-cyan-500/10',
//   },
//   {
//     name: 'TATA Safari',
//     type: 'SUV',
//     emoji: '🚐',
//     baseFare: 120,
//     ratePerKm: 20,
//     multiplier: 2.0,
//     seats: 7,
//     fuel: 'Diesel',
//     rating: 4.8,
//     accent: 'violet',
//     badgeBg: 'bg-violet-500/20',
//     badgeText: 'text-violet-400',
//     borderColor: 'border-violet-500/30',
//     glowColor: 'shadow-violet-500/10',
//   },
// ];


export function generateId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NF-${ts}-${rand}`;
}


export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


export function calculateFare(vehicle, distanceKm) {
  return Math.round(60 + distanceKm * vehicle.ratekm);
}


export function formatDate(isoString) {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' at ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  );
}


const STORAGE_KEY = 'neurofleetx_trips';

export function getRides() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRide(ride) {
  try {
    const rides = getRides();
    rides.push(ride);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
  } catch (e) {
    console.error('Failed to save ride:', e);
  }
}

export function updateRides(rides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
  } catch (e) {
    console.error('Failed to update rides:', e);
  }
}


export function exportRidesCSV(rides) {
  const header = 'Trip ID,Source,Destination,Distance,Duration,Fare,Vehicle,Type,Status,Booked At\n';
  const rows = rides
    .map(
      (r) =>
        `"${r.id}","${r.source.name}","${r.destination.name}","${r.distance}","${r.duration}","${r.fare}","${r.vehicleName}","${r.rideType}","${r.status}","${formatDate(r.bookedAt)}"`
    )
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neurofleetx_rides_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



  // useEffect(() => {
  //   if (!source || !destination) {
  //     setRouteCoords([]);
  //     setDistance(0);
  //     setDuration("");
  //     return;
  //   }

  //   fetch(
  //     `https://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.routes && data.routes.length > 0) {
  //         const route = data.routes[0];
  //         const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
  //         setRouteCoords(coords);
  //         const km = route.distance / 1000;
  //         setDistance(km);
  //         const mins = Math.round(route.duration / 60);
  //         setDuration(
  //           mins < 60
  //             ? `${mins} mins`
  //             : `${Math.floor(mins / 60)}h ${mins % 60}m`,
  //         );
  //       }
  //     })
  //     .catch(() => {
  //       const d = haversineDistance(
  //         source.lat,
  //         source.lng,
  //         destination.lat,
  //         destination.lng,
  //       );
  //       setDistance(d);
  //       setDuration(`${Math.round((d / 40) * 60)} mins`);
  //       setRouteCoords([
  //         [source.lat, source.lng],
  //         [destination.lat, destination.lng],
  //       ]);
  //     });
  // }, [source, destination]);