import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Users, Search } from "lucide-react";

export default function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedRideId, setExpandedRideId] = useState(null);
  const [booking, setBooking] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:5003/api/rides/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (rideId) => {
    const token = localStorage.getItem("jwtToken");
    const res = await axios.get(
      `http://localhost:5003/api/rides/${rideId}/details`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.data.booking[0] || null;
  };

  const handleRideClick = async (ride) => {
    const isBooked = ride.seatsAvailable < ride.seatsTotal;
    if (!isBooked) return;

    if (expandedRideId === ride._id) {
      setExpandedRideId(null);
      setBooking(null);
      return;
    }

    setExpandedRideId(ride._id);
    const bookingData = await fetchBookingDetails(ride._id);
    setBooking(bookingData);
  };
const filteredRides = useMemo(() => {
  let result = rides;

  if (search.trim()) {
    const q = search.toLowerCase();
    result = rides.filter((r) =>
      [r.origin, r.destination, r.status]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }

  // Booked rides first (semantic priority, not UI sorting)
  return [...result].sort((a, b) => {
    const aBooked = a.seatsAvailable < a.seatsTotal;
    const bBooked = b.seatsAvailable < b.seatsTotal;

    if (aBooked === bBooked) return 0;
    return aBooked ? -1 : 1;
  });
}, [rides, search]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading rides…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              My Rides
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage, review, and track your posted rides
            </p>
          </div>

          <div className="relative w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route, city, status…"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* RIDES */}
        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const isBooked = ride.seatsAvailable < ride.seatsTotal;
            const isExpanded = expandedRideId === ride._id;

            return (
              <div
                key={ride._id}
                onClick={() => handleRideClick(ride)}
                className={`relative rounded-2xl border bg-white transition-all duration-200 group
                  ${
                    isBooked
                      ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-xl border-slate-200"
                      : "opacity-60 cursor-default border-slate-100"
                  }
                `}
              >
                {/* accent bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl
                    ${
                      ride.status === "open"
                        ? "bg-blue-500"
                        : ride.status === "completed"
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }
                    opacity-30 group-hover:opacity-100 transition-opacity
                  `}
                />

                {/* main card */}
                <div className="p-6 pl-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {ride.origin.split(",")[0]} →{" "}
                        {ride.destination.split(",")[0]}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(ride.dateTime).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${
                          ride.status === "open"
                            ? "bg-blue-50 text-blue-700"
                            : ride.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }
                      `}
                    >
                      {ride.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <p className="text-slate-600">
                      Seats booked:{" "}
                      <span className="font-semibold text-slate-800">
                        {ride.seatsTotal
                          ? `${ride.seatsTotal - (ride.seatsAvailable ?? 0)}/${ride.seatsTotal}`
                          : "—"}
                      </span>
                    </p>

                    {isBooked && (
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition">
                        {isExpanded ? "Hide passenger" : "View passenger"}
                      </span>
                    )}
                  </div>

                  {/* PASSENGER — SINGLE, NESTED */}
                  {isExpanded && isBooked && booking && (
                    <div className="mt-5 ml-4 border-l-2 border-slate-200 pl-6">
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        <Users size={14} />
                        Passenger
                      </div>

                      <div className="rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">
                          {booking.passengerId.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.passengerId.email}
                        </p>

                        <div className="mt-2 text-xs text-slate-600">
                          Seats booked:{" "}
                          <span className="font-medium">
                            {booking.seatsBooked}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRides.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              No rides match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
