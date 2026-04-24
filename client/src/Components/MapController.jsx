import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const MapController =({ source, destination }) =>{
  const map = useMap();

  useEffect(() => {
    if (source && destination) {
      const bounds = L.latLngBounds(
        [source.lat, source.lng],
        [destination.lat, destination.lng]
      );
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14, animate: true });
    } else if (source) {
      map.flyTo([source.lat, source.lng], 13, { duration: 1.5 });
    } else if (destination) {
      map.flyTo([destination.lat, destination.lng], 13, { duration: 1.5 });
    }
  }, [source, destination, map]);

  return null;
}

export default MapController;