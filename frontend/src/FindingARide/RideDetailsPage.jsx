import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, Car, ArrowLeft } from "lucide-react";
import RouteMap from "../components/RouteMap";
import axios from "axios";

export default function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/api/rides/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        setRide(res.data.data);
      } catch (err) {
        console.error("Failed to fetch ride:", err);
        setRide(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id]);

  /* -------------------- GUARDS -------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading ride details...
      </div>
    );
  }

  if (
    !ride ||
    !ride.originCoords ||
    !ride.destinationCoords ||
    !Array.isArray(ride.originCoords.coordinates) ||
    !Array.isArray(ride.destinationCoords.coordinates)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Ride not found.
      </div>
    );
  }

  /* ---------------- SAFE TO USE DATA BELOW ---------------- */

  const date = new Date(ride.dateTime);

  const formattedDate = date.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const fromCoords = {
    lat: ride.originCoords.coordinates[1],
    lng: ride.originCoords.coordinates[0],
  };

  const toCoords = {
    lat: ride.destinationCoords.coordinates[1],
    lng: ride.destinationCoords.coordinates[0],
  };
  const handleBookRide = async (rideId, seats = 1) => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        alert("Please login to book a ride");
        return;
      }

      const response = await axios.post(
        `http://localhost:5003/api/bookings/${rideId}/book`,
        { seats },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ride booked successfully!");
      console.log("Booking:", response.data.data);
      navigate("/bookings");
      // OPTIONAL: redirect or refetch ride
      // navigate("/bookings");
    } catch (err) {
      console.error("Booking failed:", err);

      // Business logic errors
      if (err.response?.status === 409) {
        alert("Not enough seats or ride is no longer open");
        return;
      }

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }

      alert("Failed to book ride. Please try again.", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col md:flex-row gap-8">
      {/* Left side */}
      <div className="flex-1 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Rides
        </button>

        {/* Driver */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
            {ride.driverId?.name?.[0] || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{ride.driverId?.name}</h2>
            <p className="text-yellow-500 text-sm">
              ⭐ {ride.driverId?.rating?.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <RouteMap from={fromCoords} to={toCoords} />

          <div className="p-5 border-t">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-500">Pickup</p>
              <p className="text-gray-800">{ride.origin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Drop-off</p>
              <p className="text-gray-800">{ride.destination}</p>
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
            <span>
              {formattedDate} · {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{ride.seatsAvailable} seat(s) available</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Car className="w-5 h-5 text-indigo-600" />
            <span>{ride.vehicle || "Vehicle not specified"}</span>
          </div>

          <div className="text-indigo-600 font-semibold text-lg">
            ₹{ride.price}
          </div>
        </div>

        <button
          className="mt-6 bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition cursor-pointer"
          onClick={() => handleBookRide(id, 1)}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
}
