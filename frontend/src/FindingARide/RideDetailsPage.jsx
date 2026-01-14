import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, Users, Car, ArrowLeft, Star, 
  MapPin, Clock, ShieldCheck, MessageCircle, 
  Info, Loader2, ChevronRight, IndianRupee 
} from "lucide-react";
import RouteMap from "../components/RouteMap";
import axios from "axios";

export default function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/api/rides/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Consistent token naming
          },
        });
        setRide(res.data.data);
      } catch (err) {
        console.error("Failed to fetch ride:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Assembling trip details...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <Info size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Ride Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-xs">This journey may have been cancelled or completed.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Return to Search</button>
      </div>
    );
  }

  const date = new Date(ride.dateTime);
  const formattedDate = date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const fromCoords = { lat: ride.originCoords.coordinates[1], lng: ride.originCoords.coordinates[0] };
  const toCoords = { lat: ride.destinationCoords.coordinates[1], lng: ride.destinationCoords.coordinates[0] };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Poppins]">
      {/* Top Floating Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-100 text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-200/50 hover:bg-white transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Results
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Journey Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Immersive Map Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
              <div className="h-[400px] w-full bg-slate-100 relative">
                <RouteMap from={fromCoords} to={toCoords} />
                <div className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Live Route
                </div>
              </div>
              
              {/* Route Summary */}
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-8 relative">
                   {/* Vertical Journey Visual */}
                   <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-slate-100 to-emerald-500" />
                   
                   <div className="relative pl-10">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 z-10" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pickup Point</p>
                      <h3 className="text-xl font-bold text-slate-900">{ride.origin}</h3>
                   </div>

                   <div className="relative pl-10">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-emerald-500 z-10" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Destination</p>
                      <h3 className="text-xl font-bold text-slate-900">{ride.destination}</h3>
                   </div>
                </div>
              </div>
            </div>

            {/* Driver Profile Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100">
                  {ride.driverId?.name?.[0] || "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-slate-50">
                  <ShieldCheck size={20} className="text-emerald-500" fill="currentColor" fillOpacity={0.1} />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h2 className="text-2xl font-black text-slate-900">{ride.driverId?.name}</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    <ShieldCheck size={12} /> Verified Driver
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" /> {ride.driverId?.rating?.toFixed(1)}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span>50+ Rides Completed</span>
                </div>
              </div>

              <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <MessageCircle size={24} />
              </button>
            </div>

            {/* Additional Info Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-6">Driver's Notes</h3>
              <p className="text-slate-500 leading-relaxed italic">
                "{ride.description || "No special notes provided. I'm a safe driver and always on time!"}"
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Sidebar (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                
                <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Booking Details</h3>
                
                <div className="space-y-6 mb-10">
                  <DetailItem icon={<Calendar />} label="Date" value={formattedDate} />
                  <DetailItem icon={<Clock />} label="Time" value={formattedTime} />
                  <DetailItem icon={<Users />} label="Availability" value={`${ride.seatsAvailable} Seats Left`} />
                  <DetailItem icon={<Car />} label="Vehicle" value={ride.vehicle || "Standard Car"} />
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center justify-between mb-8">
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Total Price</p>
                    <div className="flex items-center text-white mt-1">
                      <IndianRupee size={20} className="text-indigo-400" />
                      <span className="text-4xl font-black tracking-tighter">{ride.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Instant Booking
                    </div>
                  </div>
                </div>

                <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-lg">
                  Book This Ride
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Footer */}
              <div className="px-8 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                   Your payment is secure. We only release funds to the driver after the journey is complete.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 text-white">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}