import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import authService from '../services/authService';
import FogOfWarLayer from '../components/map/FogOfWarLayer';

const ExplorationMap = () => {
  const [unfoggedHexes, setUnfoggedHexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data.user) {
          setUser(response.data.user);
          setUnfoggedHexes(response.data.user.unfoggedHexes || []);
        }
      } catch (err) {
        console.error('Failed to load exploration data', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const center = useMemo(() => {
    if (user?.city) {
      return [28.6139, 77.2090];
    }
    return [20.5937, 78.9629];
  }, [user]);

  const markerIcon = useMemo(() => L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center">
        <p className="text-slate-500 font-bold">Loading exploration map...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">
            Exploration Map
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {unfoggedHexes.length > 0
              ? `You have explored ${unfoggedHexes.length} zones. Keep riding to uncover more!`
              : 'Complete a ride to start exploring the map.'}
          </p>
        </div>

        <div className="rounded-4xl overflow-hidden border-[12px] border-slate-100 shadow-pastel-shadow">
          <MapContainer
            center={center}
            zoom={13}
            className="w-full h-[600px]"
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FogOfWarLayer unfoggedHexes={unfoggedHexes} />
            {user && (
              <Marker position={center} icon={markerIcon}>
                <Popup>
                  <strong>{user.name}</strong><br />
                  {user.city}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ExplorationMap;
