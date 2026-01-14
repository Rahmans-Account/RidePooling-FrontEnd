import React, { useMemo, useState } from "react";
import axios from "axios";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function MyBookedRides({ bookings = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  /* ---------------- helpers ---------------- */

  const shortLocation = (location = "") =>
    location
      .split(",")
      .slice(0, 2)
      .map((s) => s.trim())
      .join(", ");

  const formatDateTime = (dateTime) => {
    const d = new Date(dateTime);
    return `${d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} · ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getStatusStyle = (status = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-50 text-green-700 ring-1 ring-green-200 animate-pulse-soft";
      case "completed":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-200";
    }
  };

  /* ---------------- filtering ---------------- */

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      // Guard against missing ride data
      if (!b || !b.rideId || !b.rideId.dateTime) return false;

      const rideDate = new Date(b.rideId.dateTime);

      if (filter === "today" && !isSameDay(now, rideDate)) return false;

      if (filter === "3days") {
        const diff = (now - rideDate) / (1000 * 60 * 60 * 24);
        if (diff > 3) return false;
      }

      if (filter === "month") {
        const diff = (now - rideDate) / (1000 * 60 * 60 * 24);
        if (diff > 30) return false;
      }

      const query = search.toLowerCase();
      const origin = (b.rideId.origin || "").toLowerCase();
      const destination = (b.rideId.destination || "").toLowerCase();
      const route = origin + " " + destination;

      return route.includes(query);
    });
  }, [bookings, search, filter]);

  /* ---------------- cancel ---------------- */

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("Please login again");

    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(
        `http://localhost:5003/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(0);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          My Booked Rides
        </h2>
        <p className="text-gray-500 text-lg">
          Search, filter, and manage your bookings
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by source or destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "today", label: "Today" },
            { key: "3days", label: "Last 3 Days" },
            { key: "month", label: "Last Month" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === f.key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredBookings.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gray-50/80 backdrop-blur">
              <tr className="text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="
                    group
                    animate-row-enter
                    border-b border-gray-100 last:border-b-0
                    transition-all duration-300
                    hover:bg-gray-50
                    hover:shadow-[inset_3px_0_0_0_rgba(99,102,241,0.8)]
                  "
                >
                  {/* Route */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="font-medium group-hover:font-semibold group-hover:text-gray-900 transition-all">
                        {shortLocation(booking.rideId?.origin ?? "")}
                      </span>

                      <ArrowRight className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-indigo-500 group-hover:translate-x-1" />

                      <span className="font-medium group-hover:font-semibold group-hover:text-gray-900 transition-all">
                        {shortLocation(booking.rideId?.destination ?? "")}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {booking.rideId?.dateTime
                        ? formatDateTime(booking.rideId.dateTime)
                        : "TBA"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-right">
                    {booking.status === "confirmed" ? (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="
                          opacity-0 translate-y-1
                          group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-200
                          text-sm font-medium text-red-600
                        "
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-2xl py-20 text-center animate-fade-in">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            No bookings found
          </p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes rowEnter {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-row-enter {
            animation: rowEnter 0.4s ease-out forwards;
          }

          @keyframes pulseSoft {
            0%,100% { opacity: 1 }
            50% { opacity: 0.92 }
          }
          .animate-pulse-soft {
            animation: pulseSoft 2.5s ease-in-out infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
