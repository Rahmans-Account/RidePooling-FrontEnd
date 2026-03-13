import React, { useEffect, useState } from "react";
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
import reviewService from "../api/reviewService";

export default function RideCard({ ride }) {
  const navigate = useNavigate();
  const [driverRating, setDriverRating] = useState(null);

  // Safely get driver ID
  const driverId = ride?.driver?._id || ride?.driverId;
  
  useEffect(() => {
    const fetchDriverRating = async () => {
      if (!driverId) return;
      try {
        const res = await reviewService.getDriverAverageRating(driverId);
        setDriverRating(res.data);
      } catch (err) {
        console.error("Failed to fetch driver rating:", err);
      }
    };
    fetchDriverRating();
  }, [driverId]);

  const handleClick = () => {
    navigate(`/ride/${ride._id}`);
  };

  // Use correct field names from backend schema
  const dateObj = new Date(ride.departureTime);
  const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const day = dateObj.toLocaleDateString([], { day: "numeric", month: "short" });

  // Calculate actual seats left
  const seatsLeft = (ride.availableSeats || 0) - (ride.seatsBooked || 0);
  const driverName = ride.driver?.name || "Unknown Driver";
  const driverAvatar = driverName[0] || "U";
  const driverRatingValue = driverRating?.averageRating || ride.driver?.rating?.toFixed(1) || "5.0";
  const startLocation = ride.startLocation?.address?.split(',')[0] || "Start";
  const endLocation = ride.endLocation?.address?.split(',')[0] || "Destination";
  const pricePerSeat = ride.pricePerSeat || 0;
  const estimatedFare = Number(ride.fareBreakdown?.totalFare || 0);
  const platformFee = Number(ride.fareBreakdown?.platformFee || 0);
  const driverEarningEstimate = estimatedFare > 0 ? Math.max(0, estimatedFare - platformFee) : 0;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/70 p-6 shadow-pastel-shadow hover:shadow-2xl hover:shadow-pastel-lavender/20 transition-all duration-700 cursor-pointer hover:-translate-y-2 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-lavender-light/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Top Section: Driver & Timing */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender flex items-center justify-center text-slate-800 font-black shadow-lg shadow-pastel-lavender/20 group-hover:scale-110 transition-transform duration-500">
              {driverAvatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-pastel-mint-light">
              <ShieldCheck size={14} className="text-pastel-mint-dark" fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-sm leading-tight group-hover:text-pastel-lavender-dark transition-colors tracking-tight">
              {driverName}
            </h4>
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-white/70 rounded-full border border-slate-200/70 w-fit">
              <Star size={10} className="text-pastel-peach-dark fill-pastel-peach-dark" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {driverRatingValue}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-pastel-lavender-dark mb-1">
            <Clock size={16} strokeWidth={3} />
            <span className="text-sm font-black uppercase tracking-tighter">{time}</span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">{day}</span>
        </div>
      </div>

      {/* Route Section */}
      <div className="relative mb-8 px-2 z-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full border-[3px] border-pastel-lavender-dark bg-white shadow-[0_0_8px_#DCD6F7]" />
              <p className="text-[11px] font-black text-slate-700 line-clamp-1 uppercase tracking-wider">
                {startLocation}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-pastel-mint-dark" strokeWidth={3} />
              <p className="text-[11px] font-black text-slate-700 line-clamp-1 uppercase tracking-wider">
                {endLocation}
              </p>
            </div>
          </div>
          
          {/* Visual Divider */}
          <div className="w-px h-12 bg-slate-100/50" />
          
          {/* Price Tag */}
          <div className="text-right min-w-[80px]">
            {estimatedFare > 0 ? (
              <>
                <div className="flex items-center justify-end text-slate-800">
                  <span className="text-xs font-black text-pastel-lavender-dark mr-1">₹</span>
                  <span className="text-3xl font-black tracking-tighter leading-none">{estimatedFare}</span>
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60 text-right">Estimate</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-end text-slate-800">
                  <span className="text-xs font-black text-pastel-lavender-dark mr-1">₹</span>
                  <span className="text-3xl font-black tracking-tighter leading-none">{pricePerSeat}</span>
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60 text-right">Per Seat</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Seats & Action */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-slate-50 relative z-10">
        <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl ${
          seatsLeft > 0 
            ? 'bg-pastel-mint-light/20 border border-pastel-mint-light' 
            : 'bg-pastel-pink-light/20 border border-pastel-pink-light'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${seatsLeft > 0 ? 'bg-pastel-mint-dark animate-pulse' : 'bg-pastel-pink-dark'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            seatsLeft > 0 
              ? 'text-pastel-mint-dark' 
              : 'text-pastel-pink-dark'
          }`}>
            {seatsLeft > 0 ? `${seatsLeft} ${seatsLeft !== 1 ? 'Spaces' : 'Space'}` : 'Full'}
          </span>
        </div>
 
        <div className="flex items-center gap-2 text-pastel-lavender-dark text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
          Book <span className="hidden sm:inline">Now</span>
          <div className="w-8 h-8 rounded-xl bg-pastel-lavender shadow-sm flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}