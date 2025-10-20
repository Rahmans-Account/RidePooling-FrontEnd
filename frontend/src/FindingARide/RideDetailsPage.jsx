import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, Car, ArrowLeft } from "lucide-react";
import RouteMap from "../components/RouteMap";

export default function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockRides = [
        {
          id: "1",
          driver: "Jane Doe",
          rating: 4.9,
          date: "October 26, 2023, 8:00 AM",
          seats: 2,
          vehicle: "Toyota Camry, Blue",
          pickup: "123 Main St, San Francisco, CA",
          dropoff: "456 Grand Ave, Los Angeles, CA",
          from: { lat: 37.7749, lng: -122.4194 },
          to: { lat: 34.0522, lng: -118.2437 },
        },
        {
          id: "2",
          driver: "John Smith",
          rating: 4.8,
          date: "October 28, 2023, 9:00 AM",
          seats: 1,
          vehicle: "Honda Civic, Black",
          pickup: "Park Street, Hyderabad, Telangana",
          dropoff: "Charminar, Hyderabad, Telangana",
          from: { lat: 17.4065, lng: 78.4772 },
          to: { lat: 17.3616, lng: 78.4747 },
        },
      ];

      const found = mockRides.find((r) => r.id === id);
      setRide(found || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading ride details...
      </div>
    );

  if (!ride)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Ride not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col md:flex-row gap-8">
      {/* Left side */}
      <div className="flex-1 space-y-6">
        {/* 🔙 Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Rides
        </button>

        {/* Driver Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div>
            <h2 className="text-lg font-semibold">{ride.driver}</h2>
            <p className="text-yellow-500 text-sm">⭐ {ride.rating}</p>
          </div>
        </div>

        {/* Map section */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <RouteMap from={ride.from} to={ride.to} />

          <div className="p-5 border-t">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-500">Pickup</p>
              <p className="text-gray-800">{ride.pickup}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Drop-off</p>
              <p className="text-gray-800">{ride.dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-80 flex flex-col justify-between">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Ride Details</h3>

          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>{ride.date}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{ride.seats} seat(s) available</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Car className="w-5 h-5 text-indigo-600" />
            <span>{ride.vehicle}</span>
          </div>
        </div>

        <button className="mt-6 bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
          Book Ride
        </button>
      </div>
    </div>
  );
}
