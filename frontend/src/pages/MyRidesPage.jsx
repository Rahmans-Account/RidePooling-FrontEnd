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

export default function MyRidesPage() {
  const navigate = useNavigate();
  const { myRides, loading, error, fetchMyRides, cancelRide } = useRide();
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleCancel = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;
    
    setCancellingId(rideId);
    const success = await cancelRide(rideId);
    setCancellingId(null);
    if (success) {
      await fetchMyRides();
    }
  };

  const handleEndRide = async (rideId) => {
    if (!window.confirm("Have you completed this ride? This will mark it as done from your side.")) return;
    
    try {
      await bookingService.markCompletedByDriver(rideId);
      alert("Ride marked as complete! Waiting for passenger confirmation.");
      await fetchMyRides();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark ride as complete");
    }
  };

  // Filter rides based on tab
  const filteredRides = myRides.filter(ride => {
    if (activeTab === "active") return ride.rideStatus === "active";
    return ride.rideStatus === "completed" || ride.rideStatus === "cancelled";
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">Fetching your journeys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Offered Rides</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your scheduled commutes and history</p>
          </div>
          
          <button 
            onClick={() => navigate("/offer-ride")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm"
          >
            <Plus size={18} /> Offer New Ride
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active Rides
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Past History
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
          <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Car size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No rides found</h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto">You don't have any {activeTab} rides at the moment.</p>
            {activeTab === 'active' && (
              <button 
                onClick={() => navigate("/offer-ride")}
                className="text-indigo-600 font-black flex items-center justify-center gap-2 hover:gap-3 transition-all"
              >
                Post your first ride <ArrowRight size={18} />
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
    <div className={`bg-white rounded-[2.5rem] border ${isCancelled ? 'border-slate-100 opacity-75' : 'border-white'} shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden group hover:shadow-xl transition-all`}>
      <div className="p-8">
        {/* Card Header: Status & Price */}
        <div className="flex justify-between items-start mb-8">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            ride.rideStatus === 'active' ? 'bg-indigo-50 text-indigo-600' : 
            ride.rideStatus === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {ride.rideStatus}
          </div>
          <div className="flex items-center gap-1 text-slate-900">
            <IndianRupee size={16} className="text-slate-400" />
            <span className="text-xl font-black">{ride.pricePerSeat}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">/ Seat</span>
          </div>
        </div>

        {/* Route Visualization */}
        <div className="flex gap-4 mb-8">
          <div className="flex flex-col items-center py-1">
            <div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-white" />
            <div className="w-0.5 h-10 bg-slate-100 my-1" />
            <MapPin size={14} className="text-emerald-500" />
          </div>
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pickup</p>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ride.startLocation.address}</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Destination</p>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ride.endLocation.address}</h4>
            </div>
          </div>
        </div>

        {/* Trip Details Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
          <div className="text-center border-r border-slate-200">
            <Calendar size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{new Date(ride.departureTime).toLocaleDateString()}</p>
          </div>
          <div className="text-center border-r border-slate-200">
            <Clock size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          <div className="text-center">
            <Users size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{ride.availableSeats} Seats</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <Car size={16} />
          </div>
          <p className="text-xs font-medium text-slate-500 italic">"{ride.vehicleInfo?.description || 'No vehicle details'}"</p>
        </div>

        {/* Actions */}
        {!isCancelled && !isCompleted && (
          <div className="flex gap-3">
            {isInProgress && (
              <button 
                onClick={handleEndRide}
                disabled={endingRide}
                className="flex-1 py-3 px-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-xs font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {endingRide ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                End Ride
              </button>
            )}
            
            {!isInProgress && (
            <button 
              onClick={() => onCancel(ride._id)}
              disabled={isCancelling}
              className="flex-1 py-3 px-4 rounded-xl border border-rose-100 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Cancel Ride
            </button>
            )}
            <button className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-2 group">
              View Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
        
        {(isCancelled || isCompleted) && (
          <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-default">
            Ride Archive <MoreHorizontal size={14} />
          </button>
        )}
      </div>
    </div>
  );
}