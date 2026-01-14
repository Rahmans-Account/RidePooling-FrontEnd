import React, { useState } from "react";
import { Trash2, MapPin, Clock, Users, IndianRupee } from "lucide-react";

export default function MyBookedRides({ bookings = [], onCancelBooking = null }) {
  const [cancellingId, setCancellingId] = useState(null);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleCancel = async (rideId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setCancellingId(rideId);
      try {
        await onCancelBooking?.(rideId);
      } finally {
        setCancellingId(null);
      }
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleDateString([], { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">My Booked Rides</h2>
      <p className="text-gray-500 mb-6">
        View the rides you’ve booked and their current status.
      </p>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  {/* Route */}
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Route</p>
                      <p className="font-bold text-slate-900">
                        {booking.ride?.origin} → {booking.ride?.destination}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Departure</p>
                      <p className="font-bold text-slate-900">
                        {formatDateTime(booking.ride?.dateTime)}
                      </p>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="flex items-start gap-3">
                    <Users size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Driver</p>
                      <p className="font-bold text-slate-900">
                        {booking.ride?.driverId?.name || "Unknown Driver"}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-start gap-3">
                    <IndianRupee size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Price</p>
                      <p className="font-bold text-slate-900">
                        ₹{booking.ride?.pricePerSeat || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col items-end gap-4 md:items-end">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(
                      booking.ride?.rideStatus
                    )}`}
                  >
                    {booking.ride?.rideStatus?.charAt(0).toUpperCase() + booking.ride?.rideStatus?.slice(1) || "Active"}
                  </span>
                  
                  {booking.ride?.rideStatus === "active" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 mt-10 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16h8M8 12h8m-5 8h2a9 9 0 100-18h-2a9 9 0 100 18z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">
            No bookings found
          </p>
          <p className="text-gray-500">
            You haven’t booked any rides yet. Start exploring rides to book one!
          </p>
        </div>
      )}
    </div>
  );
}
