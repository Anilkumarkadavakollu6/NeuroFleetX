import axios from 'axios';


const geoCache = {};

export const getLiveCoordinates = async (locationString) => {
    console.log("location ", locationString)
    const query = encodeURIComponent(locationString);

    if (geoCache[query]) {
        return geoCache[query];
    }
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        
        if (response.data && response.data.length > 0) {
            const lat = parseFloat(response.data[0].lat);
            const lng = parseFloat(response.data[0].lon);
            
            geoCache[query] = [lat, lng];
            return [lat, lng];
        }
    } catch (error) {
        console.error("Geocoding failed for:", locationString);
    }
    
    return [20.5937, 78.9629]; 
};