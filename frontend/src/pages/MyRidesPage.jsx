import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUp, ArrowDown, ChevronsUpDown, Users } from "lucide-react";

export default function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedRideId, setExpandedRideId] = useState(null);
  const [bookers, setBookers] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "dateTime",
    direction: "asc",
  });

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

  // Dummy bookers fetch
  const fetchBookers = async () => {
    await new Promise((r) => setTimeout(r, 400));
    return [
      { id: 1, name: "Rahul Sharma", phone: "9XXXXXXXX1", seats: 1 },
      { id: 2, name: "Ananya Reddy", phone: "9XXXXXXXX2", seats: 1 },
    ];
  };

  const handleRowClick = async (ride) => {
    const isBooked = ride.seatsAvailable < ride.seatsTotal;
    if (!isBooked) return;

    if (expandedRideId === ride._id) {
      setExpandedRideId(null);
      setBookers([]);
      return;
    }

    setExpandedRideId(ride._id);
    const data = await fetchBookers();
    setBookers(data);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRides = [...rides].sort((a, b) => {
    const { key, direction } = sortConfig;
    let valA = a[key];
    let valB = b[key];

    if (key === "dateTime") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <ChevronsUpDown size={14} className="text-slate-400" />;

    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="text-slate-700" />
    ) : (
      <ArrowDown size={14} className="text-slate-700" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading rides…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">My Rides</h1>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr className="text-slate-800">
                <Header label="Route" onClick={() => handleSort("origin")}>
                  <SortIcon column="origin" />
                </Header>

                <Header
                  label="Date & Time"
                  onClick={() => handleSort("dateTime")}
                >
                  <SortIcon column="dateTime" />
                </Header>

                <Header
                  label="Seats"
                  onClick={() => handleSort("seatsAvailable")}
                >
                  <SortIcon column="seatsAvailable" />
                </Header>

                <Header label="Status" onClick={() => handleSort("status")}>
                  <SortIcon column="status" />
                </Header>
              </tr>
            </thead>

            <tbody>
              {sortedRides.map((ride) => {
                const isBooked = ride.seatsAvailable < ride.seatsTotal;

                return (
                  <React.Fragment key={ride._id}>
                    <tr
                      onClick={() => handleRowClick(ride)}
                      className={`group border-t transition-all duration-150 ease-out ${
                        isBooked
                          ? "cursor-pointer hover:bg-slate-50"
                          : "opacity-60 cursor-default"
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-700 transition-all duration-150 ease-out group-hover:text-black group-hover:font-bold group-hover:translate-x-[2px]">
                        {ride.origin.split(",")[0]} →{" "}
                        {ride.destination.split(",")[0]}
                      </td>

                      <td className="px-6 py-4 text-slate-600 transition-all duration-150 ease-out group-hover:text-black group-hover:font-bold">
                        {new Date(ride.dateTime).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-slate-600 transition-all duration-150 ease-out group-hover:text-black group-hover:font-bold">
                        {ride.seatsAvailable}/{ride.seatsTotal}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            ride.status === "open"
                              ? "bg-blue-50 text-blue-700"
                              : ride.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          } group-hover:font-black`}
                        >
                          {ride.status}
                        </span>
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {expandedRideId === ride._id && isBooked && (
                      <tr className="bg-slate-50 border-t">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-3 text-slate-800">
                            <Users size={16} />
                            <span className="text-sm font-semibold">
                              Bookers
                            </span>
                          </div>

                          <div className="space-y-2">
                            {bookers.map((b) => (
                              <div
                                key={b.id}
                                className="flex justify-between items-center bg-white border border-slate-200 rounded-lg px-4 py-2"
                              >
                                <div>
                                  <p className="text-slate-800 text-sm font-medium">
                                    {b.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {b.phone}
                                  </p>
                                </div>
                                <p className="text-xs text-slate-600">
                                  Seats: {b.seats}
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Header({ label, onClick, children }) {
  return (
    <th className="px-6 py-3 text-left font-bold">
      <button
        onClick={onClick}
        className="flex items-center gap-1 hover:text-slate-900 transition"
      >
        {label}
        {children}
      </button>
    </th>
  );
}
