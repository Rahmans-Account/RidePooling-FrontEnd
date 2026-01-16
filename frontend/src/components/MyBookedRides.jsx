import React, { useState } from "react";
import { Trash2, MapPin, Clock, Users, IndianRupee, Check, Navigation } from "lucide-react";
import LiveTracking from "./LiveTracking";
import bookingService from "../api/bookingService";

export default function MyBookedRides({ bookings = [], onCancelBooking = null, onRefresh = null }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [trackingBooking, setTrackingBooking] = useState(null);

  const activeBookings = (bookings || []).filter(
    (b) => (b.rideStatus || "").toLowerCase() !== "completed"
  );

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
      case "accepted":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "cancelled":
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleCancel = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(rideId);
    try {
      await onCancelBooking?.(rideId);
    } finally {
      setCancellingId(null);
    }
  };

  const handleMarkDone = async (rideId) => {
    if (!window.confirm("Have you reached your destination? This will mark the ride as complete from your side.")) return;
    setCompletingId(rideId);
    try {
      await bookingService.markCompletedByPassenger(rideId);
      alert("Ride marked as complete! Waiting for driver confirmation.");
      onRefresh?.();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark as complete");
    } finally {
      setCompletingId(null);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">My Booked Rides</h2>
      <p className="text-gray-500 mb-6">Active bookings only. Completed rides live in History of Rides.</p>

      {activeBookings.length > 0 ? (
        <div className="space-y-4">
          {activeBookings.map((booking) => (
            <div
              key={booking._id || booking.rideId}
              className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Route</p>
                      <p className="font-bold text-slate-900">
                        {booking.startLocation?.address || booking.startLocation?.name || "Unknown"} → {booking.endLocation?.address || booking.endLocation?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Departure</p>
                      <p className="font-bold text-slate-900">{formatDateTime(booking.departureTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Driver</p>
                      <p className="font-bold text-slate-900">{booking.driver?.name || "Unknown Driver"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IndianRupee size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Price & Seats</p>
                      <p className="font-bold text-slate-900">
                        ₹{booking.pricePerSeat || 0} × {booking.seats || 1} seat(s) = ₹{(booking.pricePerSeat || 0) * (booking.seats || 1)}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  {booking.driver?.vehicle && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 space-y-2">
                      <p className="text-xs uppercase font-bold text-blue-700">🚗 Vehicle</p>
                      <p className="text-sm font-semibold text-slate-900">{booking.driver.vehicle}</p>
                    </div>
                  )}

                  {/* Show Ride Code if accepted */}
                  {booking.status === 'accepted' && booking.pickupCode && !booking.pickupVerified && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-green-700 uppercase mb-1">🎯 Your Ride Code</p>
                      <p className="text-2xl font-black text-green-800 tracking-wide">{booking.pickupCode}</p>
                      <p className="text-xs text-green-600 mt-2">Share this code with your driver at pickup</p>
                    </div>
                  )}

                  {booking.pickupVerified && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                      <Check size={18} className="text-blue-600" />
                      <p className="text-sm font-semibold text-blue-700">Pickup Verified • Ride In Progress</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-4 md:items-end">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(booking.status)}`}>
                    {(booking.status || "Pending").charAt(0).toUpperCase() + (booking.status || "Pending").slice(1)}
                  </span>

                  {(booking.rideStatus === "active" || booking.rideStatus === "in_progress") && (
                    <button
                      onClick={() => setTrackingBooking(booking)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Navigation size={16} />
                      Track Ride
                    </button>
                  )}

                  {booking.rideStatus === "in_progress" && booking.status !== "completed" && (
                    <button
                      onClick={() => handleMarkDone(booking.rideId)}
                      disabled={completingId === booking.rideId}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <Check size={16} />
                      {completingId === booking.rideId ? "Marking..." : "Done"}
                    </button>
                  )}

                  {booking.rideStatus === "active" && booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.rideId)}
                      disabled={cancellingId === booking.rideId}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {cancellingId === booking.rideId ? "Cancelling..." : "Cancel"}
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
          <p className="text-lg font-medium text-gray-700 mb-2">No active bookings</p>
          <p className="text-gray-500">Completed rides are available in History of Rides.</p>
        </div>
      )}

      {trackingBooking && (
        <LiveTracking
          rideId={trackingBooking.rideId}
          isDriver={false}
          pickupLocation={trackingBooking.startLocation}
          dropLocation={trackingBooking.endLocation}
          rideData={{
            pricePerSeat: trackingBooking.pricePerSeat,
            seats: trackingBooking.seats,
            totalAmount: (trackingBooking.pricePerSeat || 0) * (trackingBooking.seats || 1),
            driver: trackingBooking.driver,
          }}
          onClose={() => setTrackingBooking(null)}
        />
      )}
    </div>
  );
}
