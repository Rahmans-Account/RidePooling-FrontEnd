import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function MyBookedRides({ bookings = [] }) {
  const navigate = useNavigate();
  const getStatusStyle = (status = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-700 bg-green-100";
      case "completed":
        return "text-blue-700 bg-blue-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDateTime = (dateTime) => {
    const d = new Date(dateTime);
    return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5003/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking cancelled");
      navigate(0);
      // Optimistic UI update
    } catch (err) {
      console.error("Cancel booking failed:", err);

      if (err.response?.status === 403) {
        alert("You are not allowed to cancel this booking");
        return;
      }

      if (err.response?.status === 404) {
        alert("Booking not found");
        return;
      }

      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">My Booked Rides</h2>
      <p className="text-gray-500 mb-6">
        View and manage the rides you’ve booked.
      </p>

      {bookings.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  RIDE
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  DATE & TIME
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  STATUS
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Route */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {booking.rideId.origin} → {booking.rideId.destination}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {formatDateTime(booking.rideId.dateTime)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    {booking.status === "confirmed" ? (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-4 py-1.5 text-sm font-medium text-red-600 border border-red-500 rounded-full hover:bg-red-600 hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 mt-10 text-center">
          <p className="text-lg font-medium text-gray-700 mb-2">
            No bookings found
          </p>
          <p className="text-gray-500">You haven’t booked any rides yet.</p>
        </div>
      )}
    </div>
  );
}
