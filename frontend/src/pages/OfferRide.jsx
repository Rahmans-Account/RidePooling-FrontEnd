import React, { useState } from "react";
import { Minus, Plus, ArrowLeft, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import axios from "axios";

export default function OfferRide() {
  const navigate = useNavigate();

  const [seatsTotal, setSeatsTotal] = useState(1);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const increment = () => setSeatsTotal((s) => s + 1);
  const decrement = () => seatsTotal > 1 && setSeatsTotal((s) => s - 1);

  const validate = () => {
    const e = {};
    if (!pickup?.lat || !pickup?.lng) e.pickup = true;
    if (!destination?.lat || !destination?.lng) e.destination = true;
    if (!date) e.date = true;
    if (!time) e.time = true;
    if (!price || Number(price) <= 0) e.price = true;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    console.log("pickup:", pickup);
    console.log("destination:", destination);

    const payload = {
      origin: pickup.name,
      destination: destination.name,
      dateTime: new Date(`${date}T${time}`),
      seatsTotal,
      price: Number(price),
      vehicle,
      description,
      originCoords: {
        type: "Point",
        coordinates: [pickup.lng, pickup.lat],
      },
      destinationCoords: {
        type: "Point",
        coordinates: [destination.lng, destination.lat],
      },
    };
    console.log(localStorage.getItem("jwtToken"));
    try {
      await axios.post("http://localhost:5003/api/rides", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      navigate("/profile");
    } catch (err) {
      console.error("BACKEND ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to create ride");
    }
  };

  const errorClass = "border-red-400 focus:ring-red-400";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/profile")}
          className="cursor-pointer flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </button>

        <h1 className="text-3xl font-bold mb-8">Offer a Ride</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-8"
        >
          {/* Route */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Route</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AutoCompleteLocation
                  label="Pickup location"
                  onSelect={(loc) => {
                    setPickup(loc);
                    setErrors((e) => ({ ...e, pickup: false }));
                  }}
                />
                {errors.pickup && (
                  <p className="text-sm text-red-500 mt-1">
                    Pickup location is required
                  </p>
                )}
              </div>

              <div>
                <AutoCompleteLocation
                  label="Destination"
                  onSelect={(loc) => {
                    setDestination(loc);
                    setErrors((e) => ({ ...e, destination: false }));
                  }}
                />
                {errors.destination && (
                  <p className="text-sm text-red-500 mt-1">
                    Destination is required
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Schedule</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((err) => ({ ...err, date: false }));
                  }}
                  className={`w-full border rounded-lg p-3 ${
                    errors.date ? errorClass : "border-gray-200"
                  }`}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">Date is required</p>
                )}
              </div>

              <div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors((err) => ({ ...err, time: false }));
                  }}
                  className={`w-full border rounded-lg p-3 ${
                    errors.time ? errorClass : "border-gray-200"
                  }`}
                />
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1">Time is required</p>
                )}
              </div>
            </div>
          </section>

          {/* Seats & Price */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Seats & Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-600">Total seats</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={decrement}>
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold">{seatsTotal}</span>
                  <button type="button" onClick={increment}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div
                  className={`flex items-center border rounded-lg px-4 py-3 ${
                    errors.price ? errorClass : "border-gray-200"
                  }`}
                >
                  <IndianRupee size={16} className="text-gray-400" />
                  <input
                    type="number"
                    placeholder="Price per seat"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setErrors((err) => ({ ...err, price: false }));
                    }}
                    className="w-full ml-2 outline-none"
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    Price per seat is required
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Vehicle */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Vehicle</h2>
            <input
              type="text"
              placeholder="e.g. Blue Toyota Camry"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3"
            />
          </section>

          {/* Description */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <textarea
              placeholder="Anything passengers should know?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3"
            />
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold transition"
          >
            Post Ride
          </button>
        </form>
      </div>
    </div>
  );
}
