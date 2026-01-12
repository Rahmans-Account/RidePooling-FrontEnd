import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Car, MapPin, Calendar, Clock, 
  Trash2, ChevronRight, Loader2, 
  AlertCircle, Plus, MoreHorizontal,
  IndianRupee, Users, ArrowRight
} from "lucide-react";
import axios from "axios";

export default function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'history'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken"); // Consistently using jwtToken
      const response = await axios.get("http://localhost:5003/api/rides/my-rides", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load your rides");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this ride? Passengers will be notified.")) return;
    
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`http://localhost:5003/api/rides/${rideId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRides((prev) =>
        prev.map((r) => (r._id === rideId ? { ...r, status: "Cancelled" } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to cancel ride");
    }
  };

  // Filter rides based on tab
  const filteredRides = rides.filter(ride => {
    if (activeTab === "active") return ride.status === "Scheduled" || ride.status === "Ongoing";
    return ride.status === "Completed" || ride.status === "Cancelled";
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
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Offered Rides</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your scheduled commutes and history</p>
          </div>
          
          <Link 
            to="/offer-ride"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm"
          >
            <Plus size={18} /> Offer New Ride
          </Link>
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
              <RideCard key={ride._id} ride={ride} onCancel={handleCancel} />
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
              <Link to="/offer-ride" className="text-indigo-600 font-black flex items-center justify-center gap-2 hover:gap-3 transition-all">
                Post your first ride <ArrowRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RideCard({ ride, onCancel }) {
  const isCancelled = ride.status === "Cancelled";
  const isCompleted = ride.status === "Completed";
  
  return (
    <div className={`bg-white rounded-[2.5rem] border ${isCancelled ? 'border-slate-100 opacity-75' : 'border-white'} shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden group hover:shadow-xl transition-all`}>
      <div className="p-8">
        {/* Card Header: Status & Price */}
        <div className="flex justify-between items-start mb-8">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            ride.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-600' : 
            ride.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {ride.status}
          </div>
          <div className="flex items-center gap-1 text-slate-900">
            <IndianRupee size={16} className="text-slate-400" />
            <span className="text-xl font-black">{ride.price}</span>
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
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ride.origin}</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Destination</p>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ride.destination}</h4>
            </div>
          </div>
        </div>

        {/* Trip Details Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
          <div className="text-center border-r border-slate-200">
            <Calendar size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{new Date(ride.dateTime).toLocaleDateString()}</p>
          </div>
          <div className="text-center border-r border-slate-200">
            <Clock size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{new Date(ride.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          <div className="text-center">
            <Users size={14} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-900">{ride.seatsTotal} Seats</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <Car size={16} />
          </div>
          <p className="text-xs font-medium text-slate-500 italic">"{ride.vehicle || 'No vehicle details'}"</p>
        </div>

        {/* Actions */}
        {!isCancelled && !isCompleted && (
          <div className="flex gap-3">
            <button 
              onClick={() => onCancel(ride._id)}
              className="flex-1 py-3 px-4 rounded-xl border border-rose-100 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Cancel Ride
            </button>
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