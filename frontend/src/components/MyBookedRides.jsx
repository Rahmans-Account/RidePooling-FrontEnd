import React, { useState } from "react";
import { Trash2, MapPin, Clock, Users, IndianRupee, Check, Navigation, AlertCircle, Loader2 } from "lucide-react";
import LiveTracking from "./LiveTracking";
import bookingService from "../api/bookingService";

export default function MyBookedRides({ bookings = [], onCancelBooking = null, onRefresh = null }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [trackingBooking, setTrackingBooking] = useState(null);

  const activeBookings = (bookings || []).filter(
    (b) => (b.rideStatus || b.status || "").toLowerCase() !== "completed"
  );

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
      case "accepted":
        return "bg-pastel-mint text-slate-800 border-white";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "completed":
        return "bg-pastel-lavender text-slate-800 border-white";
      case "cancelled":
      case "rejected":
        return "bg-pastel-pink text-red-800 border-white";
      default:
        return "bg-white/50 text-slate-400 border-white";
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
    <div className="space-y-8">
      {/* Visual Progress Header */}
      {!trackingBooking && (
        <div className="flex items-center gap-4 px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm mb-10">
          <div className="p-3 bg-pastel-lavender-light rounded-xl shadow-inner">
            <Navigation size={20} className="text-pastel-lavender-dark" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fleet Telemetry</p>
            <p className="text-xs font-medium text-slate-400">All active reservations are currently synced</p>
          </div>
        </div>
      )}

      {activeBookings.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {activeBookings.map((booking) => (
            <div
              key={booking._id || booking.id || Math.random()}
              className="glass-morphism rounded-[3rem] p-8 border-white shadow-pastel-shadow hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-mint-light/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pastel-mint-light/20 transition-all" />
              
              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="space-y-8">
                  {/* Status & ID Header */}
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${getStatusStyle(booking.status)}`}>
                      {(booking.status || "Pending")}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/40 rounded-xl border border-white/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">EXP-ID</p>
                      <p className="text-[10px] font-black text-slate-600 tracking-tighter">#{(booking._id || booking.id || "").toString().slice(-6)}</p>
                    </div>
                  </div>

                  {/* Route Visualization */}
                  <div className="flex gap-4 mb-2">
                    <div className="flex flex-col items-center py-2">
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                      <div className="w-[2px] flex-1 bg-gradient-to-b from-slate-200 to-pastel-lavender/50 my-1 rounded-full" />
                      <MapPin size={16} className="text-pastel-lavender-dark" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="group/loc">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin Terminal</p>
                        <h4 className="text-[13px] font-black text-slate-800 line-clamp-1 group-hover/loc:text-pastel-lavender-dark transition-colors">{booking.startLocation?.address || "Undefined"}</h4>
                      </div>
                      <div className="group/loc">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Final Objective</p>
                        <h4 className="text-[13px] font-black text-slate-800 line-clamp-1 group-hover/loc:text-pastel-mint-dark transition-colors">{booking.endLocation?.address || "Undefined"}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/40 border border-white rounded-[2rem] shadow-inner space-y-1">
                      <div className="flex items-center gap-2 text-pastel-lavender-dark">
                        <Clock size={14} strokeWidth={3} />
                        <p className="text-[8px] font-black uppercase tracking-widest">Departure</p>
                      </div>
                      <p className="text-[11px] font-black text-slate-800 uppercase tabular-nums">{formatDateTime(booking.departureTime)}</p>
                    </div>
                    <div className="p-4 bg-white/40 border border-white rounded-[2rem] shadow-inner space-y-1">
                      <div className="flex items-center gap-2 text-pastel-mint-dark">
                        <Users size={14} strokeWidth={3} />
                        <p className="text-[8px] font-black uppercase tracking-widest">Pilot</p>
                      </div>
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{booking.driver?.name || "Anonymous"}</p>
                    </div>
                  </div>

                  {/* Pricing & Vehicle Container */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pastel-peach-light/20 to-pastel-peach-light/40 border border-white rounded-3xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <IndianRupee size={20} className="text-pastel-peach-dark" strokeWidth={3} />
                        <div>
                          <p className="text-[9px] font-black text-pastel-peach-dark uppercase tracking-widest">Net Fare</p>
                          <p className="text-sm font-black text-slate-800 tracking-tighter">₹{booking.pricePerSeat} × {booking.seats} Seats</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-800 tracking-tighter">₹{(booking.pricePerSeat || 0) * (booking.seats || 1)}</p>
                      </div>
                    </div>

                    {booking.driver?.vehicle && (
                      <div className="flex items-center gap-4 p-4 bg-white/60 border border-white rounded-3xl group/car">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pastel-lavender-dark border border-white shadow-sm group-hover/car:scale-110 transition-transform">
                           <Navigation size={18} strokeWidth={2.5} className="rotate-45" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assigned Vessel</p>
                          <p className="text-[11px] font-bold text-slate-800 pr-4">{booking.driver.vehicle}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Code & Interactions */}
                  <div className="space-y-4 pt-2">
                    {booking.status === 'accepted' && booking.pickupCode && !booking.pickupVerified && (
                      <div className="bg-white rounded-[2.5rem] p-6 border-2 border-white shadow-xl shadow-pastel-mint/10 relative overflow-hidden group/code">
                        <div className="absolute top-0 left-0 w-2 h-full bg-pastel-mint" />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black text-pastel-mint-dark uppercase tracking-[0.3em] mb-1">Authorization Code</p>
                            <p className="text-3xl font-black text-slate-800 tracking-[0.2em]">{booking.pickupCode}</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-pastel-mint/20 flex items-center justify-center text-pastel-mint-dark">
                            <Check size={24} strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    )}

                    {booking.pickupVerified && (
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-pastel-lavender to-pastel-mint rounded-[2.5rem] border-2 border-white shadow-lg text-slate-800">
                        <div className="animate-pulse flex items-center justify-center w-10 h-10 bg-white/40 rounded-2xl">
                           <Navigation size={20} className="text-slate-800" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Vessel in Motion</p>
                          <p className="text-xs font-black">Quantum link established • En route</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Action Hub */}
                <div className="flex flex-col gap-4 mt-12">
                  <div className="flex gap-4">
                    {(booking.rideStatus === "active" || booking.rideStatus === "in_progress") && (
                      <button
                        onClick={() => setTrackingBooking(booking)}
                        className="flex-1 py-5 rounded-[2rem] bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-3 group border-2 border-white/20"
                      >
                        <Navigation size={18} strokeWidth={3} className="group-hover:rotate-45 transition-transform" />
                        Live Hub
                      </button>
                    )}

                    {booking.rideStatus === "in_progress" && booking.status !== "completed" && (
                      <button
                        onClick={() => handleMarkDone(booking.rideId)}
                        disabled={completingId === booking.rideId}
                        className="flex-1 py-5 rounded-[2rem] bg-pastel-mint text-slate-800 text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-2 border-white"
                      >
                        {completingId === booking.rideId ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                        Confirm Arrival
                      </button>
                    )}
                  </div>

                  {booking.rideStatus === "active" && booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.rideId)}
                      disabled={cancellingId === booking.rideId}
                      className="w-full py-5 rounded-[2rem] bg-white border-2 border-white text-pastel-pink-dark text-[10px] font-black uppercase tracking-widest hover:bg-pastel-pink-light/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group/cancel"
                    >
                      {cancellingId === booking.rideId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} strokeWidth={3} className="group-hover/cancel:rotate-12 transition-transform" />}
                      Withdraw Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-morphism rounded-[3rem] p-16 text-center border-white shadow-pastel-shadow mt-12">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-pastel-lavender-dark mx-auto mb-8 shadow-inner border border-white">
            <Navigation size={32} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-slate-800 tracking-tight">Fleet Hibernation</p>
          <p className="text-slate-500 text-sm mt-3 font-medium">No active expeditions found. Your journey history is archived safely.</p>
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
