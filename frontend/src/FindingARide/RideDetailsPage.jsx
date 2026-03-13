import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, Users, Car, ArrowLeft, Star, 
  MapPin, Clock, ShieldCheck, MessageCircle, 
  Info, Loader2, ChevronRight, IndianRupee, Navigation,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import RouteMap from "../components/RouteMap";
import RideReview from "../components/RideReview";
import CheckoutModal from "../components/CheckoutModal";
import LiveTracking from "../components/LiveTracking";
import axios from "axios";
import api from "../api/client";
import bookingService from "../api/bookingService";
import reviewService from "../api/reviewService";
import authService from "../services/authService";

export default function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [message, setMessage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [driverRating, setDriverRating] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        setRide(res.data.data);
        
        const reviewsRes = await reviewService.getReviewsByRide(id);
        setReviews(reviewsRes.data || []);
        
        const driverId = res.data.data.driver?._id || res.data.data.driverId;
        if (driverId) {
          const ratingRes = await reviewService.getDriverAverageRating(driverId);
          setDriverRating(ratingRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch ride:", err);
        setMessage({ type: 'error', text: 'Failed to synchronize trip node' });
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-pastel-lavender-dark mb-6" size={48} strokeWidth={3} />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Assembling Expedition Matrix...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white text-pastel-pink-dark rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border-4 border-white">
          <Info size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Expedition Void</h2>
        <p className="text-slate-500 mb-10 max-w-xs font-medium italic">This node in the journey matrix has been decommissioned.</p>
        <button onClick={() => navigate(-1)} className="px-10 py-5 bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all">Return to Search Hub</button>
      </div>
    );
  }

  const date = new Date(ride.departureTime);
  const formattedDate = date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const fromCoords = { 
    lat: ride.startLocation?.latitude || 0, 
    lng: ride.startLocation?.longitude || 0 
  };
  const toCoords = { 
    lat: ride.endLocation?.latitude || 0, 
    lng: ride.endLocation?.longitude || 0 
  };

  const seatsLeft = (ride.availableSeats || 0) - (ride.seatsBooked || 0);
  const totalPrice = (ride.pricePerSeat || 0) * (ride.seatsBooked || 1);

  const handleBook = async () => {
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-pastel-cream font-[Poppins] relative overflow-x-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pastel-lavender-light/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-mint-light/20 rounded-full blur-[120px]" />
      </div>

      {/* Live Tracking Modal */}
      {showLiveTracking && ride && (
        <LiveTracking
          rideId={ride._id}
          isDriver={currentUser?._id === ride.driver?._id}
          pickupLocation={ride.startLocation}
          dropLocation={ride.endLocation}
          rideData={{ ...ride, totalAmount: totalPrice }}
          onClose={() => setShowLiveTracking(false)}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout}
        ride={ride}
        onClose={() => setShowCheckout(false)}
        onSuccess={async () => {
          try {
            await bookingService.bookRide(id);
            setBooked(true);
            setMessage({ type: 'success', text: 'Quantum link established. Journey confirmed.' });
            setTimeout(() => navigate('/bookings'), 2500);
          } catch (err) {
            setMessage({ 
              type: 'error', 
              text: err.response?.data?.message || 'Synchronization failure post-settlement.' 
            });
          }
        }}
      />

      {/* Top Floating Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl border-2 border-slate-200/70 text-slate-800 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white hover:scale-105 transition-all group active:scale-95"
        >
          <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Search
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Journey Details */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Immersive Map Container */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] md:rounded-[4rem] shadow-pastel-shadow border border-slate-200/70 overflow-hidden group">
              <div className="h-[320px] md:h-[450px] w-full bg-white relative">
                <RouteMap from={fromCoords} to={toCoords} />
                <div className="absolute top-6 right-6 px-6 py-2.5 bg-slate-800 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl animate-pulse-slow">
                  Live Path Sync
                </div>
              </div>
              
              {/* Route Summary */}
              <div className="p-8 md:p-14 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-mint-light/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="flex-1 space-y-12 relative">
                   {/* Vertical Journey Visual */}
                   <div className="absolute left-[13px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-pastel-lavender via-slate-100 to-pastel-mint rounded-full opacity-60" />
                   
                   <div className="relative pl-14">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-2xl bg-white border-2 border-pastel-lavender shadow-sm flex items-center justify-center z-10">
                         <div className="w-2 h-2 bg-pastel-lavender-dark rounded-full" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Initial Origin</p>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">{ride.startLocation?.address || "Station Alpha"}</h3>
                   </div>

                   <div className="relative pl-14">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-2xl bg-white border-2 border-pastel-mint shadow-sm flex items-center justify-center z-10">
                          <MapPin size={14} className="text-pastel-mint-dark" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Target Terminus</p>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">{ride.endLocation?.address || "Station Omega"}</h3>
                   </div>
                </div>
              </div>
            </div>

            {/* Driver Profile Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-slate-200/70 shadow-pastel-shadow flex flex-col md:flex-row items-center gap-8 md:gap-10 group/driver transition-all hover:bg-white/50">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white transform transition-transform group-hover/driver:rotate-3">
                  {ride.driver?.name?.[0] || "U"}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-pastel-mint-light">
                  <ShieldCheck size={24} className="text-pastel-mint-dark" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-3">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{ride.driver?.name || "Anonymous Pilot"}</h2>
                  <span className="inline-flex items-center gap-2 px-5 py-2 bg-pastel-mint text-slate-800 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm border border-white">
                    <CheckCircle size={12} /> Verified Operator
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <span className="flex items-center gap-2 text-slate-800 font-black text-sm">
                    <Star size={20} className="fill-amber-400 text-amber-400" /> {driverRating?.averageRating || ride.driver?.rating?.toFixed(1) || "5.0"}
                  </span>
                  <div className="w-[1.5px] h-4 bg-slate-200" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{driverRating?.totalReviews || 0} Missions</span>
                </div>
              </div>

              <button className="p-6 bg-white/70 text-slate-400 rounded-[1.75rem] hover:bg-white hover:text-pastel-lavender-dark transition-all shadow-sm border border-slate-200/70 active:scale-95 group-hover/driver:scale-110">
                <MessageCircle size={28} />
              </button>
            </div>

            {/* Additional Info Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-slate-200/70 shadow-pastel-shadow relative overflow-hidden">
               <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-pastel-peach-light/10 rounded-full blur-3xl -z-10" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Operator Disclosure</h3>
              <p className="text-slate-600 font-medium leading-[1.8] italic text-lg md:text-xl pl-6 border-l-4 border-pastel-peach/30">
                "{ride.description || "Safe transmission, timely synchronization, and zero-latency movement. Ready for the jump!"}"
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Sidebar (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-12 space-y-8">
              <div className="bg-white/85 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-200/70 relative overflow-hidden group/sidebar">
                <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-lavender-light/30 rounded-full -mr-24 -mt-24 group-hover/sidebar:scale-125 transition-all duration-1000" />
                
                <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mb-10 text-center">Journey Manifest</h3>
                
                <div className="space-y-8 mb-12">
                  <DetailItem icon={<Calendar />} label="Cycle" value={formattedDate} />
                  <DetailItem icon={<Clock />} label="Window" value={formattedTime} />
                  <DetailItem icon={<Users />} label="Capacity" value={`${seatsLeft} Nodes Free`} />
                  <DetailItem icon={<Car />} label="Vessel" value={ride.vehicleInfo?.description || "Stealth Commuter"} />
                </div>

                <div className="pt-10 border-t border-slate-200/70 flex items-center justify-between mb-10">
                  <div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Quantum Settle</p>
                    <div className="flex items-center text-slate-800 mt-2">
                      <IndianRupee size={24} className="text-pastel-peach" strokeWidth={3} />
                      <span className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums">{totalPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pastel-mint/10 text-pastel-mint-dark text-[9px] font-black uppercase tracking-widest rounded-full border border-pastel-mint/20">
                      Auto-Sync
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleBook}
                  disabled={booking || booked || seatsLeft <= 0}
                  className="w-full py-6 md:py-7 bg-pastel-lavender-light text-slate-800 font-black rounded-[2.5rem] hover:bg-pastel-lavender shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-4 group/book text-[11px] uppercase tracking-[0.3em] disabled:opacity-20 disabled:cursor-not-allowed mb-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-pastel-lavender translate-y-full group-hover/book:translate-y-0 transition-transform duration-500 -z-10" />
                  {booking ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Syncing...
                    </>
                  ) : booked ? (
                    <>
                       <CheckCircle size={20} /> Identity Confirmed
                    </>
                  ) : seatsLeft <= 0 ? (
                    "Void: No Slots"
                  ) : (
                    <>
                      Initialize Link
                      <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>

                {/* Live Tracking Button */}
                {(booked || currentUser?._id === ride.driver?._id) && (
                  <button
                    onClick={() => setShowLiveTracking(true)}
                    className="w-full py-6 bg-pastel-mint text-slate-800 font-black rounded-[2.5rem] hover:bg-pastel-mint-dark hover:text-white transition-all active:scale-[0.97] flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] shadow-xl"
                  >
                    <Navigation size={20} className="animate-pulse" />
                    Engage HUD
                  </button>
                )}

                {message && (
                  <div className={`mt-6 p-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-bottom-4 ${
                    message.type === 'success' 
                      ? 'bg-pastel-mint-light/20 text-pastel-mint-dark border-2 border-pastel-mint-light' 
                      : 'bg-pastel-pink/20 text-red-700 border-2 border-pastel-pink'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>

              {/* Trust Footer */}
                <div className="px-8 text-center bg-white/70 p-8 rounded-[2.5rem] border-2 border-slate-200/70 shadow-sm">
                 <div className="flex items-center justify-center gap-2 mb-3 text-pastel-lavender-dark">
                    <ShieldCheck size={16} strokeWidth={3} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Protocol 1.0 Safe</span>
                 </div>
                 <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-relaxed italic">
                   Settlement is absolute only upon destination verification.
                 </p>
              </div>
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-20">
           <RideReview 
             rideId={id}
             rideStatus={ride.rideStatus}
             reviews={reviews}
             onReviewAdded={() => {
               reviewService.getReviewsByRide(id).then(res => setReviews(res.data || []));
               const driverId = ride.driver?._id || ride.driverId;
               if (driverId) {
                 reviewService.getDriverAverageRating(driverId).then(res => setDriverRating(res.data));
               }
             }}
           />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 text-slate-800 group/item">
      <div className="w-12 h-12 rounded-[1.25rem] bg-pastel-lavender-light/50 flex items-center justify-center text-pastel-lavender-dark transition-all group-hover/item:bg-white group-hover/item:text-slate-800 shadow-inner border border-slate-200/70">
        {React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}