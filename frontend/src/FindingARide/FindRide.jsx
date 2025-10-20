import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import RideCard from "./RideCard";

export default function FindRide() {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedRide, setSelectedRide] = useState(null);

  // 🧠 Load saved data from localStorage when page mounts
  useEffect(() => {
    const savedRides = localStorage.getItem("rides");
    const savedCurrent = localStorage.getItem("currentLocation");
    const savedDest = localStorage.getItem("destination");
    const savedDate = localStorage.getItem("date");

    if (savedRides) setRides(JSON.parse(savedRides));
    if (savedCurrent) setCurrentLocation(JSON.parse(savedCurrent));
    if (savedDest) setDestination(JSON.parse(savedDest));
    if (savedDate) setDate(savedDate);
  }, []);

  // 💾 Save data whenever rides, currentLocation, destination, or date changes
  useEffect(() => {
    localStorage.setItem("rides", JSON.stringify(rides));
    localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
    localStorage.setItem("destination", JSON.stringify(destination));
    localStorage.setItem("date", date);
  }, [rides, currentLocation, destination, date]);

  const findRides = async () => {
    if (!currentLocation || !destination || !date) {
      alert("Please enter Current Location, Destination, and Date.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const fakeRides = [
        {
          id: 1,
          driver: "Jane Doe",
          rating: 4.9,
          from: currentLocation.name || "Hyderabad",
          to: destination.name || "Warangal",
          time: "8:30 AM",
          seats: 2,
          price: 150,
        },
        {
          id: 2,
          driver: "John Smith",
          rating: 4.8,
          from: currentLocation.name || "Karimnagar",
          to: destination.name || "Nizamabad",
          time: "9:00 AM",
          seats: 1,
          price: 120,
        },
        {
          id: 3,
          driver: "Sarah Lee",
          rating: 5.0,
          from: currentLocation.name || "Nalgonda",
          to: destination.name || "Khammam",
          time: "9:15 AM",
          seats: 3,
          price: 100,
        },
      ];

      setRides(fakeRides);
      setLoading(false);
    }, 1000);
  };

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    alert(`You clicked on ride by ${ride.id}`);
  };

  const handleRefresh = () => {
    setRides([]);
    setCurrentLocation(null);
    setDestination(null);
    setDate("");
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
      >
        <ArrowLeft size={22} />
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Find your next ride
      </h1>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <AutoCompleteLocation
            label="Current Location"
            onSelect={setCurrentLocation}
            defaultValue={currentLocation?.name || ""}
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <AutoCompleteLocation
            label="Destination"
            onSelect={setDestination}
            defaultValue={destination?.name || ""}
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          onClick={findRides}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          {loading ? "Finding..." : "Find a Ride"}
        </button>

        {/* 🔄 Refresh Button */}
        <button
          onClick={handleRefresh}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Ride List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Available Rides</h2>

        {rides.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">
            No rides found. Try searching for a route.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onClick={handleRideClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
