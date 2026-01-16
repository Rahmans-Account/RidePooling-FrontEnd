import React, { useEffect, useState } from "react";
import { MapPin, Clock, IndianRupee, CheckCircle, RefreshCw } from "lucide-react";
import bookingService from "../api/bookingService";

export default function RideHistoryPage() {
  const [passengerHistory, setPassengerHistory] = useState([]);
  const [driverHistory, setDriverHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractBookings = (res) => res?.bookings || res?.data?.bookings || [];
  const isCompleted = (item) => (item?.rideStatus || "").toLowerCase() === "completed";

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [userRes, driverRes] = await Promise.all([
        bookingService.getMyBookings(),
        bookingService.getDriverBookings(),
      ]);
      setPassengerHistory(extractBookings(userRes).filter(isCompleted));
      setDriverHistory(extractBookings(driverRes).filter(isCompleted));
      setError(null);
    } catch (err) {
      console.error("Failed to load history", err);
      setError(err?.response?.data?.message || "Failed to load ride history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCard = (item, roleLabel, amountLabel) => (
    <div key={item.rideId || item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-green-700 text-sm font-semibold">
          <CheckCircle size={16} /> Success
        </span>
        <span className="text-xs font-semibold text-slate-500 uppercase">{roleLabel}</span>
      </div>

      <div className="flex items-start gap-3 mb-2">
        <MapPin size={18} className="text-indigo-600 mt-1" />
        <p className="text-sm font-semibold text-slate-900">
          {item.startLocation?.address || "Start"} → {item.endLocation?.address || "End"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
        <Clock size={16} className="text-indigo-600" />
        <span>{formatDateTime(item.departureTime)}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-900 font-bold">
        <IndianRupee size={18} className="text-slate-400" />
        <span>{amountLabel}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading ride history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={loadHistory}
          className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const passengerContent = passengerHistory.length > 0 ? (
    <div className="grid gap-4">
      {passengerHistory.map((item) => {
        const totalPaid = (item.pricePerSeat || 0) * (item.seats || 1);
        return renderCard(item, "Passenger", `Paid ₹${totalPaid}`);
      })}
    </div>
  ) : (
    <p className="text-slate-500 text-sm">No completed rides as passenger yet.</p>
  );

  const driverContent = driverHistory.length > 0 ? (
    <div className="grid gap-4">
      {driverHistory.map((item) => {
        const seats = (item.passengers || []).reduce((sum, p) => sum + (p.seats || 0), 0);
        const totalEarned = (item.pricePerSeat || 0) * seats;
        return renderCard(item, "Driver", `Earned ₹${totalEarned}`);
      })}
    </div>
  ) : (
    <p className="text-slate-500 text-sm">No completed rides as driver yet.</p>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">History of Rides</h1>
          <p className="text-slate-500">All completed rides, split by your role.</p>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">As Passenger</h2>
          {passengerContent}
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">As Driver</h2>
          {driverContent}
        </div>
      </div>
    </div>
  );
}
