import React from "react";
import { 
  MapPin, Calendar, Users, CheckCircle, 
  XCircle, Clock, ArrowRight, TrendingUp,
  Map, MoreHorizontal, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";

export default function MyRides({ rides = [], onCancel }) {
  const navigate = useNavigate();
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return { text: "text-pastel-lavender-dark", bg: "bg-pastel-lavender-light/30", border: "border-pastel-lavender/20", icon: <Clock size={12} /> };
      case "full":
        return { text: "text-pastel-peach-dark", bg: "bg-pastel-peach-light/30", border: "border-pastel-peach/20", icon: <Users size={12} /> };
      case "completed":
        return { text: "text-pastel-mint-dark", bg: "bg-pastel-mint-light/30", border: "border-pastel-mint/20", icon: <CheckCircle size={12} /> };
      case "cancelled":
        return { text: "text-red-600", bg: "bg-pastel-pink/30", border: "border-pastel-pink/20", icon: <XCircle size={12} /> };
      default:
        return { text: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200", icon: <TrendingUp size={12} /> };
    }
  };

  const handleCancel = (ride) => {
    notify.confirm(`Are you sure you want to decommission the ride: ${ride.route}?`, () => {
      onCancel?.(ride);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Fleet Manifest</h2>
          <p className="text-slate-400 font-medium italic mt-1 text-sm">
            "Your active expeditions and historical traversals."
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-white rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
           <Map size={14} className="text-pastel-lavender-dark" /> Synchronized Node
        </div>
      </div>

      {rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rides.map((ride, index) => {
            const config = getStatusConfig(ride.status);
            return (
              <div
                key={index}
                className="glass-morphism rounded-[2.5rem] p-8 border-white shadow-pastel-shadow hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150 ${config.bg}`} />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border} flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]`}>
                         {config.icon} {ride.status}
                      </div>
                   </div>
                   <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={20} />
                   </button>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                     <div className="mt-1 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-white shadow-sm text-pastel-lavender-dark">
                        <MapPin size={20} strokeWidth={2.5} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Traverse Route</p>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{ride.route}</h4>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pl-2">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Time Sync</span>
                       </div>
                       <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{ride.date}</p>
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Users size={12} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Nodes Filled</span>
                       </div>
                       <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{ride.seats} Occupants</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/60 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-pastel-mint-dark" strokeWidth={3} />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Link</span>
                   </div>
                   {ride.status.toLowerCase() === "upcoming" && (
                    <button
                      onClick={() => handleCancel(ride)}
                      className="px-6 py-3 text-[10px] font-black text-pastel-pink-dark uppercase tracking-widest bg-white border-2 border-white rounded-2xl hover:bg-pastel-pink/20 hover:text-red-700 transition-all active:scale-95 shadow-sm"
                    >
                      Decommission
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-morphism rounded-[3rem] p-20 border-dashed border-white text-center group">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-inner border border-white group-hover:scale-110 transition-transform">
             <AlertCircle size={40} strokeWidth={1} />
          </div>
          <p className="text-2xl font-black text-slate-800 tracking-tight">Zero Traverse Nodes</p>
          <p className="text-slate-400 font-medium italic mt-2">
            "Broadcast your first expedition to initiate the matrix."
          </p>
          <button
            onClick={() => navigate("/offer-ride")}
            className="mt-10 bg-slate-800 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-900 transition-all active:scale-95"
          >
            + DEPLOY EXPEDITION
          </button>
        </div>
      )}
    </div>
  );
}
