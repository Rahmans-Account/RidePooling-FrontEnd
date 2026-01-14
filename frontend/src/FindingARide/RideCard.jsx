import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  IndianRupee 
} from "lucide-react";

export default function RideCard({ ride }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ride/${ride._id}`);
  };

  const dateObj = new Date(ride.dateTime);
  const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const day = dateObj.toLocaleDateString([], { day: "numeric", month: "short" });

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer hover:-translate-y-2 overflow-hidden"
    >
      {/* Top Section: Driver & Timing */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
              {ride.driverId?.name?.[0] || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-500" fill="currentColor" fillOpacity={0.1} />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
              {ride.driverId?.name}
            </h4>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-slate-400">
                {ride.driverId?.rating?.toFixed(1) || "5.0"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-indigo-600 mb-1">
            <Clock size={14} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-tight">{time}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
        </div>
      </div>

      {/* Route Section */}
      <div className="relative mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full border-2 border-indigo-500 bg-white" />
              <p className="text-xs font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">
                {ride.origin.split(',')[0]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-emerald-500" />
              <p className="text-xs font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">
                {ride.destination.split(',')[0]}
              </p>
            </div>
          </div>
          
          {/* Visual Divider */}
          <div className="w-px h-8 bg-slate-100" />
          
          {/* Price Tag */}
          <div className="text-right pl-2">
            <div className="flex items-center justify-end text-indigo-600">
              <IndianRupee size={14} strokeWidth={3} />
              <span className="text-2xl font-black tracking-tighter">{ride.price}</span>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">per seat</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Seats & Action */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
          <Users size={14} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-600">
            {ride.seatsAvailable} Seat{ride.seatsAvailable !== 1 ? 's' : ''} left
          </span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
          Book Now 
          <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Subtle Background Glow on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}