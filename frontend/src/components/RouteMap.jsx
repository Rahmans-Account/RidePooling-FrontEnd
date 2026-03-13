import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

const RouteMap = ({ from, to }) => {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!from || !to) return;

    const fetchRoute = async () => {
      try {
        // Using OSRM (free OpenStreetMap routing API)
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [from, to]);

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={[from.lat, from.lng]}
      zoom={13}
      className="w-full h-56"
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[from.lat, from.lng]} icon={markerIcon} />
      <Marker position={[to.lat, to.lng]} icon={markerIcon} />
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
};

export default RouteMap;
