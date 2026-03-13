import React, { useEffect, useState } from "react";
import { MapPin, Clock, IndianRupee, CheckCircle, RefreshCw, Navigation, Loader2, Users } from "lucide-react";
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
    <div key={item.rideId || item._id} className="p-6 bg-white/40 border-2 border-white rounded-[2.5rem] hover:shadow-md transition-all group/card mb-6 last:mb-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-pastel-mint-light/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover/card:bg-pastel-mint-light/20 transition-all" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="flex items-center gap-2 px-4 py-1.5 bg-pastel-mint rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border border-white text-slate-800">
          <CheckCircle size={12} strokeWidth={3} /> Success
        </span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{roleLabel} Unit</span>
      </div>

      <div className="flex gap-4 mb-6 relative z-10 pl-1">
        <div className="flex flex-col items-center py-2">
          <div className="w-2 h-2 rounded-full bg-pastel-lavender" />
          <div className="w-[1.5px] flex-1 bg-gradient-to-b from-pastel-lavender/50 to-pastel-mint/50 my-1 rounded-full" />
          <MapPin size={16} className="text-pastel-mint-dark" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Initial Origin</p>
            <h4 className="text-[11px] font-black text-slate-800 line-clamp-1">{item.startLocation?.address || "Station X"}</h4>
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Final Terminus</p>
            <h4 className="text-[11px] font-black text-slate-800 line-clamp-1">{item.endLocation?.address || "Station Y"}</h4>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/60 border border-white rounded-[1.5rem] relative z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-pastel-lavender-dark" />
          <span className="text-[10px] font-black text-slate-600 tabular-nums uppercase">{formatDateTime(item.departureTime)}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-800">
          <IndianRupee size={14} className="text-pastel-peach-dark" strokeWidth={3} />
          <span className="text-lg font-black tracking-tighter">{amountLabel.includes('₹') ? amountLabel.split('₹')[1] : amountLabel.split('Paid ')[1] || amountLabel.split('Earned ')[1]}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-pastel-lavender-dark mx-auto" size={40} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Accessing Archives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pastel-cream p-4 md:p-8 flex flex-col items-center justify-center space-y-6">
        <div className="bg-pastel-pink/20 p-8 rounded-[3rem] border-2 border-white shadow-xl text-center max-w-md">
           <AlertCircle size={48} className="text-pastel-pink-dark mx-auto mb-4" />
           <p className="text-red-800 font-black uppercase tracking-widest text-sm mb-2">Sync Error</p>
           <p className="text-slate-600 font-medium">{error}</p>
        </div>
        <button
          onClick={loadHistory}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-pastel-lavender-dark rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-lg border-2 border-white hover:scale-105 transition-all"
        >
          <RefreshCw size={16} strokeWidth={3} /> Retry Link
        </button>
      </div>
    );
  }

  const passengerContent = passengerHistory.length > 0 ? (
    <div className="space-y-2">
      {passengerHistory.map((item) => {
        const totalPaid = (item.pricePerSeat || 0) * (item.seats || 1);
        return renderCard(item, "Passenger", `₹${totalPaid}`);
      })}
    </div>
  ) : (
    <div className="py-12 text-center opacity-40">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-white">
        <Users size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest">No Passenger Records</p>
    </div>
  );

  const driverContent = driverHistory.length > 0 ? (
    <div className="space-y-2">
      {driverHistory.map((item) => {
        const seats = (item.passengers || []).reduce((sum, p) => sum + (p.seats || 0), 0);
        const totalEarned = (item.pricePerSeat || 0) * seats;
        return renderCard(item, "Driver", `₹${totalEarned}`);
      })}
    </div>
  ) : (
    <div className="py-12 text-center opacity-40">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-white">
        <Navigation size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest">No Pilot Records</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 font-[Poppins] relative overflow-x-hidden pb-20">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-pastel-mint-light/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-pastel-lavender-light/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Temporal Records</h1>
            <p className="text-slate-500 mt-2 font-medium italic">"A journey reflected is a journey understood."</p>
          </div>
          <button
            onClick={loadHistory}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-white backdrop-blur-md border-2 border-white text-pastel-lavender-dark rounded-3xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 group"
          >
            <RefreshCw size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700" /> Sync Records
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-morphism rounded-[3rem] p-8 md:p-10 border-white shadow-pastel-shadow flex flex-col h-full">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
              <div className="p-3 bg-pastel-lavender-light rounded-2xl shadow-sm border border-white">
                <Users className="text-pastel-lavender-dark" size={20} />
              </div>
              Passenger Odyssey
            </h2>
            <div className="flex-1">
              {passengerContent}
            </div>
          </div>

          <div className="glass-morphism rounded-[3rem] p-8 md:p-10 border-white shadow-pastel-shadow flex flex-col h-full">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
              <div className="p-3 bg-pastel-mint-light rounded-2xl shadow-sm border border-white">
                <Navigation className="text-pastel-mint-dark" size={20} />
              </div>
              Driver Dominion
            </h2>
            <div className="flex-1">
              {driverContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
