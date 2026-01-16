import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import MyBookedRides from "../components/MyBookedRides";
import bookingService from "../api/bookingService";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeBookings = bookings.filter(
    (b) => (b.rideStatus || "").toLowerCase() !== "completed"
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        console.log("Bookings fetched:", response);
        setBookings(response.bookings || response.data?.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response?.data?.message || "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (rideId) => {
    try {
      await bookingService.cancelBooking(rideId);
      setBookings(bookings.filter(b => b.rideId !== rideId));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-indigo-600 mx-auto" size={40} />
          <p className="text-slate-600 font-semibold">Loading your bookings...</p>
        </div>
      </div>
    );

  if (error) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border-2 border-red-200 p-6 md:p-8 flex gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-bold text-red-900 text-lg">Failed to Load Bookings</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Your Bookings</h1>
          <p className="text-slate-600 mt-2 flex items-center gap-2">
            <CheckCircle size={18} className="text-indigo-600" />
            You have <span className="font-bold text-indigo-600">{activeBookings.length}</span> active booking{activeBookings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-100 p-12 text-center">
            <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
            <p className="text-slate-600 font-semibold text-lg">No bookings yet</p>
            <p className="text-slate-500 text-sm mt-2">Start booking rides to see them here!</p>
          </div>
        ) : (
          <MyBookedRides 
            bookings={bookings} 
            onCancelBooking={handleCancelBooking}
            onRefresh={async () => {
              const response = await bookingService.getMyBookings();
              setBookings(response.bookings || response.data?.bookings || []);
            }}
          />
        )}
      </div>
    </div>
  );
}
