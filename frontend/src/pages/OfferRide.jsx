import React, { useState } from "react";
import { Calendar, Clock, Car, Minus, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AutoCompleteLocation from "../components/AutoCompleteLocation";

export default function OfferRide() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("2025-10-19");
  const [time, setTime] = useState("10:00");
  const [vehicle, setVehicle] = useState("");
  const [errors, setErrors] = useState({});

  const increment = () => setSeats(seats + 1);
  const decrement = () => seats > 1 && setSeats(seats - 1);

  const validate = () => {
    const newErrors = {};
    if (!pickup) newErrors.pickup = "Pickup location is required";
    if (!destination) newErrors.destination = "Destination is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Ride details submitted:");
      console.log("Pickup:", pickup);
      console.log("Destination:", destination);
      console.log("Date:", date);
      console.log("Time:", time);
      console.log("Seats:", seats);
      console.log("Vehicle:", vehicle);
    }
  };

  // clear error when typing/selecting again
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Header with Back Button */}
      <div className="flex items-center w-full max-w-4xl mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Profile</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 w-full max-w-4xl">Offer a Ride</h1>

      {/* Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Ride Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Pickup + Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AutoCompleteLocation
                label="Pickup Location"
                onSelect={(loc) => {
                  setPickup(loc);
                  clearError("pickup");
                }}
                onTyping={() => clearError("pickup")}
              />
              {errors.pickup && (
                <p className="text-red-500 text-sm mt-1">{errors.pickup}</p>
              )}
            </div>

            <div>
              <AutoCompleteLocation
                label="Destination"
                onSelect={(loc) => {
                  setDestination(loc);
                  clearError("destination");
                }}
                onTyping={() => clearError("destination")}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.destination}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    clearError("date");
                  }}
                  className="w-full outline-none"
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    clearError("time");
                  }}
                  className="w-full outline-none"
                />
              </div>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Row 3: Seats + Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Available Seats
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <button
                  type="button"
                  onClick={decrement}
                  className="px-2 py-1 bg-gray-100 rounded-md"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center">{seats}</span>
                <button
                  type="button"
                  onClick={increment}
                  className="px-2 py-1 bg-gray-100 rounded-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Vehicle Details (Optional)
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Car className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g., Blue Toyota Camry"
                  className="w-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Post Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
