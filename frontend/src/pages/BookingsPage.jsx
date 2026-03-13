import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import MyBookedRides from "../components/MyBookedRides";
import bookingService from "../api/bookingService";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeBookings = bookings.filter(
    (b) => (b.rideStatus || b.status || "").toLowerCase() !== "completed"
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
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-pastel-lavender-dark mx-auto" size={40} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Syncing Bookings...</p>
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
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 relative overflow-x-hidden font-[Poppins]">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-pastel-lavender-light/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-pastel-mint-light/30 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Your Expeditions</h1>
          <p className="text-slate-500 mt-3 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-pastel-mint rounded-xl border border-white shadow-sm">
              <CheckCircle size={14} className="text-slate-800" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Active Bookings: <span className="text-pastel-lavender-dark">{activeBookings.length}</span> Ready for departure</span>
          </p>
        </div>

        {activeBookings.length === 0 ? (
          <div className="glass-morphism rounded-[3rem] p-16 text-center border-white shadow-pastel-shadow">
            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-pastel-lavender-dark mx-auto mb-8 shadow-inner border border-white">
              <AlertCircle size={32} strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tight">Silent Horizons</p>
            <p className="text-slate-500 text-sm mt-3 font-medium">You haven't reserved any seats in the pastel fleet yet.</p>
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
