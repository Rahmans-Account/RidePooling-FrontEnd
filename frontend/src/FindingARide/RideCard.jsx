import React from "react";
import { useNavigate } from "react-router-dom";

//to get available rides cards
export default function RideCard({ ride }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ride/${ride.id}`); // 🔹 Navigate to RideDetailsPage with the ride ID
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm p-5 border hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <p className="font-semibold">{ride.driver}</p>
          <p className="text-yellow-500 text-sm">⭐ {ride.rating.toFixed(1)}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-2">
        {ride.from} → {ride.to}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
        <p>🕒 {ride.time}</p>
        <p>💺 {ride.seats} seat(s) left</p>
        <p className="text-indigo-600 font-semibold">
          ₹{ride.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
