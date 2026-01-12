import React from "react";
import { useNavigate } from "react-router-dom";

export default function RideCard({ ride }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ride/${ride._id}`);
  };

  const date = new Date(ride.dateTime);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const day = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition cursor-pointer"
    >
      {/* Driver */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
          {ride.driverId?.name?.[0] || "?"}
        </div>
        <div>
          <p className="font-semibold">{ride.driverId?.name}</p>
          <p className="text-yellow-500 text-sm">
            ⭐ {ride.driverId?.rating?.toFixed(1)}
          </p>
        </div>
        <span className="ml-auto text-xs text-gray-500">
          {day}, {time}
        </span>
      </div>

      {/* Route */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {ride.origin} → {ride.destination}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
        <p>💺 {ride.seatsAvailable} seat(s) left</p>
        <p className="text-indigo-600 font-semibold">₹{ride.price}</p>
      </div>
    </div>
  );
}
