import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Car, MapPin, Calendar, Clock, 
  Trash2, ChevronRight, Loader2, 
  AlertCircle, Plus, MoreHorizontal,
  IndianRupee, Users, ArrowRight,
  ArrowLeft, Edit2, CheckCircle
} from "lucide-react";
import { useRide } from "../hooks/useRide";
import bookingService from "../api/bookingService";
import { notify } from "../utils/notify";

export default function MyRidesPage() {
  const navigate = useNavigate();
  const { myRides, loading, error, fetchMyRides, cancelRide } = useRide();
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleCancel = async (rideId) => {
    notify.confirm("Are you sure you want to cancel this ride?", async () => {
      setCancellingId(rideId);
      const success = await cancelRide(rideId);
      setCancellingId(null);
      if (success) {
        notify.success("Ride cancelled successfully.");
        await fetchMyRides();
      } else {
        notify.error("Failed to cancel ride.");
      }
    });
  };

  const handleEndRide = async (rideId) => {
    notify.confirm("Have you completed this ride? This will mark it as done from your side.", async () => {
      try {
        await bookingService.markCompletedByDriver(rideId);
        notify.success("Ride marked as complete! Waiting for passenger confirmation.");
        await fetchMyRides();
      } catch (error) {
        notify.error(error.response?.data?.message || "Failed to mark ride as complete");
      }
    });
  };

  // Filter rides based on tab
  const filteredRides = myRides.filter(ride => {
    if (activeTab === "active") return ride.rideStatus === "active";
    return ride.rideStatus === "completed" || ride.rideStatus === "cancelled";
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pastel-cream">
        <Loader2 className="animate-spin text-pastel-lavender-dark mb-4" size={40} />
        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest text-xs">Syncing Journeys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-6 lg:p-10 font-[Poppins] relative overflow-x-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-pastel-mint-light/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-pastel-lavender-light/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-md border border-white group-hover:shadow-md transition-all">
                <ArrowLeft size={18} />
              </div>
              Return Home
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Hosted Journeys</h1>
              <p className="text-slate-500 mt-2 font-medium">Coordinate your scheduled commutes in pastel style</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate("/offer-ride")}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-pastel-shadow transition-all active:scale-95 group border-2 border-white/20"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Host New Journey
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-3 p-2 bg-white/40 backdrop-blur-md border border-white w-full sm:w-fit rounded-3xl mb-12 shadow-sm">
          <button 
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white text-pastel-lavender-dark shadow-md border border-pastel-lavender-light/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Active Routes
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-pastel-lavender-dark shadow-md border border-pastel-lavender-light/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Journey Logs
          </button>
        </div>

        {/* Rides Grid */}
        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredRides.map((ride) => (
              <RideCard 
                key={ride._id} 
                ride={ride} 
                onCancel={handleCancel}
                onEndRide={handleEndRide}
                isCancelling={cancellingId === ride._id}
              />
            ))}
          </div>
        ) : (
          <div className="glass-morphism rounded-[3rem] p-12 md:p-20 text-center border-white shadow-pastel-shadow">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-pastel-lavender-dark mx-auto mb-8 shadow-inner border border-white">
              <Car size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Empty Horizons</h3>
            <p className="text-slate-500 mt-3 mb-10 max-w-xs mx-auto font-medium">You haven't charted any {activeTab} journeys in the pastel network yet.</p>
            {activeTab === 'active' && (
              <button 
                onClick={() => navigate("/offer-ride")}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-pastel-mint text-slate-800 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:shadow-lg transition-all active:scale-95"
              >
                Launch Primary Route <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RideCard({ ride, onCancel, onEndRide, isCancelling }) {
  const isCancelled = ride.rideStatus === "cancelled";
  const isCompleted = ride.rideStatus === "completed";
  const isInProgress = ride.rideStatus === "in_progress";
  const [endingRide, setEndingRide] = useState(false);

  const handleEndRide = async () => {
    setEndingRide(true);
    await onEndRide?.(ride._id);
    setEndingRide(false);
  };
  
  return (
    <div className={`glass-morphism rounded-[3rem] p-6 md:p-8 border-white ${isCancelled ? 'opacity-60 bg-white/20 shadow-none' : 'shadow-pastel-shadow'} transition-all hover:shadow-xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-lavender-light/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pastel-lavender-light/20 transition-all" />
      
      {/* Card Header: Status & Price */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border border-white ${
          ride.rideStatus === 'active' ? 'bg-pastel-mint text-slate-800' : 
          ride.rideStatus === 'completed' ? 'bg-pastel-lavender text-slate-800' : 'bg-white/50 text-slate-400'
        }`}>
          {ride.rideStatus}
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-2xl shadow-sm border border-white">
          <IndianRupee size={16} className="text-pastel-lavender-dark" />
          <span className="text-2xl font-black text-slate-800 tracking-tighter">{ride.pricePerSeat}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Limit</span>
        </div>
      </div>

      {/* Route Visualization */}
      <div className="flex gap-4 mb-10 pl-2">
        <div className="flex flex-col items-center py-2">
          <div className="w-2 h-2 rounded-full bg-pastel-lavender-dark shadow-[0_0_8px_rgba(156,136,255,0.5)]" />
          <div className="w-[2px] flex-1 bg-gradient-to-b from-pastel-lavender/50 to-pastel-mint/50 my-1 rounded-full" />
          <MapPin size={16} className="text-pastel-mint-dark" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="group/loc">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Departure Origin</p>
            <h4 className="text-[13px] font-black text-slate-800 line-clamp-1 group-hover/loc:text-pastel-lavender-dark transition-colors">{ride.startLocation.address}</h4>
          </div>
          <div className="group/loc">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Final Destination</p>
            <h4 className="text-[13px] font-black text-slate-800 line-clamp-1 group-hover/loc:text-pastel-mint-dark transition-colors">{ride.endLocation.address}</h4>
          </div>
        </div>
      </div>

      {/* Trip Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1 bg-white/40 border border-white rounded-[2rem] mb-10 shadow-inner">
        <div className="p-4 text-center rounded-[1.5rem] bg-white shadow-sm border border-white/50">
          <Calendar size={16} className="mx-auto mb-2 text-pastel-lavender-dark" />
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{new Date(ride.departureTime).toLocaleDateString()}</p>
        </div>
        <div className="p-4 text-center rounded-[1.5rem] hover:bg-white transition-all group/info">
          <Clock size={16} className="mx-auto mb-2 text-pastel-peach-dark" />
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        <div className="p-4 text-center rounded-[1.5rem] hover:bg-white transition-all group/info">
          <Users size={16} className="mx-auto mb-2 text-pastel-mint-dark" />
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{ride.availableSeats} Units</p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex items-center gap-4 mb-10 px-4 py-3 bg-white/20 border border-white/50 rounded-2xl italic shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pastel-lavender-dark border border-white shadow-sm">
          <Car size={20} strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter line-clamp-2">"{ride.vehicleInfo?.description || 'Voyage specs not defined'}"</p>
      </div>

      {/* Actions */}
      {!isCancelled && !isCompleted && (
        <div className="flex flex-col sm:flex-row gap-4">
          {isInProgress ? (
            <button 
              onClick={handleEndRide}
              disabled={endingRide}
              className="flex-1 py-5 px-6 rounded-3xl bg-pastel-mint text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-pastel-mint/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-2 border-white"
            >
              {endingRide ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} strokeWidth={3} />
              )}
              Conclude
            </button>
          ) : (
            <button 
              onClick={() => onCancel(ride._id)}
              disabled={isCancelling}
              className="flex-1 py-5 px-6 rounded-3xl bg-white border-2 border-white text-pastel-pink-dark text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pastel-pink-light/20 hover:border-pastel-pink-light/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group/cancel"
            >
              {isCancelling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} strokeWidth={3} className="group-hover/cancel:rotate-12 transition-transform" />
              )}
              Discard
            </button>
          )}
          
          <button className="flex-[1.5] py-5 px-6 rounded-3xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-3 group border-2 border-white/20">
            Inspector <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
      
      {(isCancelled || isCompleted) && (
        <button className="w-full py-5 rounded-[2rem] bg-white/40 border border-white text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center justify-center gap-3 cursor-default shadow-inner">
          Legacy Record <MoreHorizontal size={18} />
        </button>
      )}
    </div>
  );
}