import React, { useEffect, useState } from "react";
import { 
  MapPin, Clock, Users, IndianRupee, Navigation, Check, Loader2, 
  CheckCircle, XCircle, Key, MoreHorizontal, MessageSquare, ShieldCheck, 
  AlertCircle,
  Truck
} from "lucide-react";
import bookingService from "../api/bookingService";
import LiveTracking from "../components/LiveTracking";

export default function RiderBookingsPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingRide, setTrackingRide] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [forceCompletingId, setForceCompletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [pickupCode, setPickupCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getDriverBookings();
      setRides(res?.bookings || res?.data?.bookings || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load rider bookings", err);
      setError(err.response?.data?.message || "Quantum synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const activeRides = rides.filter((r) => r.rideStatus !== "completed");

  const handleDriverComplete = async (rideId) => {
    if (!window.confirm("Broadcast journey completion?")) return;
    setCompletingId(rideId);
    try {
      await bookingService.markCompletedByDriver(rideId);
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to finalize journey.");
    } finally {
      setCompletingId(null);
    }
  };

  const handleAcceptBooking = async (rideId, passengerId) => {
    try {
      await bookingService.acceptBooking(rideId, passengerId);
      await fetchRides();
    } catch (err) {
      console.error("Failed to accept passenger sync", err);
    }
  };

  const handleForceComplete = async (rideId) => {
    if (!window.confirm("Engage force-completion protocol?")) return;
    setForceCompletingId(rideId);
    try {
      await bookingService.forceCompleteByDriver(rideId);
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Protocol failure.");
    } finally {
      setForceCompletingId(null);
    }
  };

  const handleRejectBooking = async (rideId, passengerId) => {
    if (!window.confirm("Decline this passenger link?")) return;
    try {
      await bookingService.rejectBooking(rideId, passengerId);
      await fetchRides();
    } catch (err) {
      console.error("Failed to terminate link", err);
    }
  };

  const handleVerifyPickup = async (rideId) => {
    if (!pickupCode.trim()) return;
    setVerifyingId(rideId);
    try {
      await bookingService.verifyPickupCode(rideId, pickupCode);
      setPickupCode("");
      setShowCodeInput(null);
      await fetchRides();
    } catch (err) {
      console.error("Verification matrix mismatch", err);
    } finally {
      setVerifyingId(null);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-pastel-lavender-dark mx-auto" size={40} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Command Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 font-[Poppins] relative overflow-x-hidden pb-20">
       {/* Background Blooms */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pastel-mint-light/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-lavender-light/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Pilot Command</h1>
                <p className="text-slate-500 mt-2 font-medium italic">"Managing the flow of souls through the pastel matrix."</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-white/60 border-2 border-white rounded-3xl shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Truck size={18} className="text-pastel-lavender-dark" /> Active Logistics
            </div>
        </div>

        {error && (
            <div className="p-6 bg-pastel-pink/30 border-2 border-white rounded-3xl flex items-center gap-4 text-red-800 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <AlertCircle size={20} /> {error}
            </div>
        )}

        {activeRides.length === 0 ? (
          <div className="glass-morphism border-dashed border-white rounded-[3rem] p-24 text-center group">
             <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-inner border border-white group-hover:scale-110 transition-transform">
                <Navigation size={40} strokeWidth={1} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Static Fleet</h3>
             <p className="text-slate-400 font-medium italic mt-3">"Awaiting your next expedition deployment."</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeRides.map((ride) => {
              const totalSeatsBooked = (ride.passengers || []).reduce((sum, p) => sum + (p.seats || 0), 0);
              const totalAmount = (ride.pricePerSeat || 0) * totalSeatsBooked;
              return (
                <div key={ride.rideId} className="glass-morphism rounded-[3.5rem] p-8 md:p-12 border-white shadow-pastel-shadow relative overflow-hidden group/card">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-mint-light/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover/card:bg-pastel-mint-light/20 transition-all duration-1000" />
                  
                  <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between relative z-10">
                    <div className="flex-1 space-y-10">
                      {/* Detailed Route Hub */}
                      <div className="space-y-10">
                        <div className="flex items-start gap-5 group/row">
                          <div className="mt-1 w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-white shadow-sm text-pastel-lavender-dark group-hover/row:scale-110 transition-transform">
                             <MapPin size={24} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Expedition Path</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tighter leading-tight break-words max-w-xl">
                              {ride.startLocation?.address} <span className="text-pastel-lavender mx-2">→</span> {ride.endLocation?.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10 pl-2">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/60 rounded-xl border border-white">
                                <Clock size={16} className="text-pastel-lavender-dark" />
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure sync</p>
                                <p className="text-xs font-black text-slate-800 uppercase tabular-nums tracking-widest">{formatDateTime(ride.departureTime)}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/60 rounded-xl border border-white">
                                <Users size={16} className="text-pastel-mint-dark" />
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Crew Index</p>
                                <p className="text-xs font-black text-slate-800 uppercase tabular-nums tracking-widest">{totalSeatsBooked} Nodes Linked</p>
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* Passenger Matrix */}
                      <div className="p-8 bg-white/30 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                           <Users size={14} className="text-pastel-lavender-dark" /> Passenger Manifest
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(ride.passengers || []).map((p, idx) => (
                            <div key={p.userId || idx} className="flex items-center gap-4 p-4 bg-white/60 rounded-[1.75rem] border border-white group/p hover:bg-white hover:shadow-md transition-all">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender flex items-center justify-center text-white font-black text-lg shadow-sm">
                                 {p.name?.[0] || "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-800 text-sm truncate">{p.name || "Passenger"}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.seats} SEATS • {p.status}</p>
                              </div>
                              {p.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleAcceptBooking(ride.rideId, p.userId)} className="p-2 bg-pastel-mint text-slate-800 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm">
                                    <CheckCircle size={14} />
                                  </button>
                                  <button onClick={() => handleRejectBooking(ride.rideId, p.userId)} className="p-2 bg-pastel-pink text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm">
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="p-2 text-pastel-mint-dark">
                                   <CheckCircle size={20} strokeWidth={2.5} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Hub Sidebar (Within Card) */}
                    <div className="w-full lg:w-72 space-y-4">
                      <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group/actions">
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12" />
                        
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 uppercase tracking-[0.3em] text-[8px] font-black text-white/40">
                           <span>Matrix Settle</span>
                           <span>{(ride.rideStatus || "").replace('_', ' ')}</span>
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-10">
                           <IndianRupee size={28} className="text-pastel-peach" strokeWidth={3} />
                           <span className="text-5xl font-black tracking-tighter tabular-nums">{totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="space-y-3">
                           <button
                             onClick={() => setTrackingRide({ ...ride, totalAmount })}
                             className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
                           >
                             <Navigation size={14} /> Engauge HUD
                           </button>

                           {ride.rideStatus === "in_progress" && (
                            <button
                                onClick={() => handleDriverComplete(ride.rideId)}
                                disabled={completingId === ride.rideId}
                                className="w-full py-5 bg-pastel-mint text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30"
                            >
                                {completingId === ride.rideId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                                Broadcast End
                            </button>
                           )}
                        </div>
                      </div>

                      {/* Pickup Verification Grid */}
                      {ride.rideStatus === 'active' && !ride.pickupVerified && ride.passengers.some(p => p.status === 'accepted') && (
                        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white shadow-sm space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sync Identity Code</p>
                          {showCodeInput === ride.rideId ? (
                            <div className="space-y-4">
                              <input
                                type="text"
                                value={pickupCode}
                                onChange={(e) => setPickupCode(e.target.value)}
                                placeholder="####"
                                className="w-full px-6 py-4 bg-white border-2 border-white rounded-2xl text-center text-lg font-black tracking-[0.5em] focus:ring-4 focus:ring-pastel-lavender-light/30 focus:border-pastel-lavender outline-none shadow-inner"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleVerifyPickup(ride.rideId)} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 active:scale-95 transition-all">
                                   {verifyingId === ride.rideId ? <Loader2 size={16} className="animate-spin" /> : "Authorize"}
                                </button>
                                <button onClick={() => setShowCodeInput(null)} className="p-4 bg-white text-slate-400 rounded-2xl hover:text-slate-600 active:scale-95 border border-white transition-all">
                                  <ArrowLeft size={16} strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setShowCodeInput(ride.rideId)} className="w-full py-4 bg-pastel-lavender-light text-pastel-lavender-dark rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest border-2 border-white hover:bg-pastel-lavender transition-all active:scale-95 shadow-sm">
                               Input Key Node
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {trackingRide && (
        <LiveTracking
          rideId={trackingRide.rideId}
          isDriver={true}
          pickupLocation={trackingRide.startLocation}
          dropLocation={trackingRide.endLocation}
          rideData={{
            driver: trackingRide.driver,
            totalAmount: trackingRide.totalAmount,
          }}
          onClose={() => setTrackingRide(null)}
        />
      )}
    </div>
  );
}
