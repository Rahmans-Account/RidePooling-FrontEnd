import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import RideCard from "./RideCard";
import axios from "axios";

export default function FindRide() {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [destination, setDestination] = useState(null); // optional UI
  const [date, setDate] = useState("");
  const [minSeats, setMinSeats] = useState(1);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const findRides = async () => {
    if (!currentLocation || !date) {
      alert("Please select location and date");
      return;
    }

    try {
      setLoading(true);
      console.log("currentLocation:", currentLocation);

      const response = await axios.get(
        "http://localhost:5003/api/rides/search",
        {
          params: {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            date,
            minSeats,
            page: 1,
            limit: 10,
            sort: "dateTime",
          },
        }
      );
      console.log("Rides search response:", response.data);
      // backend response: { success, data, meta }
      setRides(response.data.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentLocation(null);
    setDestination(null);
    setDate("");
    setMinSeats(1);
    setRides([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8 relative">
      {/* Back */}
      <button
        onClick={() => navigate("/profile")}
        className="cursor-pointer absolute top-6 left-6 flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Find your next ride
      </h1>

      {/* Search Section */}
      <div className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <AutoCompleteLocation
            label="Current Location"
            onSelect={(loc) =>
              setCurrentLocation({
                name: loc.name,
                lat: loc.lat ?? loc.latitude ?? loc.geometry?.location?.lat,
                lng:
                  loc.lng ??
                  loc.lon ??
                  loc.longitude ??
                  loc.geometry?.location?.lng,
              })
            }
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Seats Needed</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border rounded-md"
            value={minSeats}
            onChange={(e) => setMinSeats(Math.max(1, Number(e.target.value)))}
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
          className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Searching..." : "Find Ride"}
        </button>

        <button
          onClick={handleRefresh}
          className="cursor-pointer bg-gray-200 px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <RefreshCw size={18} /> Reset
        </button>
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Available Rides</h2>

        {rides.length === 0 ? (
          <p className="text-center text-gray-500">No rides found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
