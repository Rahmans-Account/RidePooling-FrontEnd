import React, { useState, useEffect } from "react";
import { 
  Minus, Plus, ArrowLeft, IndianRupee, 
  MapPin, Calendar, Clock, Car, 
  FileText, Loader2, ChevronRight, Navigation,
  CheckCircle, AlertCircle, Fuel, Zap, Wind,
  Gauge, DollarSign, Users, Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import rideService from "../services/rideService";
import authService from "../services/authService";

export default function OfferRide() {
  const navigate = useNavigate();

  const [seatsTotal, setSeatsTotal] = useState(1);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Vehicle details
  const [vehicleDetails, setVehicleDetails] = useState({
    make: "",
    model: "",
    color: "",
    year: new Date().getFullYear(),
    fuelType: "petrol",
    acAvailable: false,
    licensePlate: "",
    registrationNumber: "",
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  useEffect(() => {
    const loadPrimaryVehicle = async () => {
      try {
        if (!authService.isAuthenticated()) return;
        const profileRes = await authService.getProfile();
        if (profileRes.success && profileRes.data) {
          const vehiclesList = profileRes.data.vehicles || [];
          const primary = vehiclesList.find((v) => v.isPrimary);
          if (primary) {
            setVehicleDetails({
              make: primary.make || "",
              model: primary.model || "",
              color: primary.color || "",
              year: primary.year || new Date().getFullYear(),
              fuelType: primary.fuelType || "petrol",
              acAvailable: primary.acAvailable || false,
              licensePlate: primary.licensePlate || "",
              registrationNumber: primary.registrationNumber || "",
            });
            setShowVehicleForm(true);
          }
        }
      } catch (err) {
        console.error("Failed to load primary vehicle:", err);
      }
    };
    loadPrimaryVehicle();
  }, []);

  const increment = () => setSeatsTotal((s) => (s < 7 ? s + 1 : s));
  const decrement = () => seatsTotal > 1 && setSeatsTotal((s) => s - 1);

  const getVehicleDisplay = () => {
    const { make, model, color, year } = vehicleDetails;
    if (make && model) {
      return `${year} ${make} ${model}${color ? ` - ${color}` : ""}`;
    }
    return "";
  };

  const validate = () => {
    const e = {};
    if (!pickup?.latitude || !pickup?.longitude) e.pickup = true;
    if (!destination?.latitude || !destination?.longitude) e.destination = true;
    if (!date) e.date = true;
    if (!time) e.time = true;
    if (!price || Number(price) <= 0) e.price = true;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setError("");
    setSuccess("");
    
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    
    const departureDateTime = new Date(`${date}T${time}`);
    
    const rideData = {
      startLocation: {
        address: pickup.name,
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      },
      endLocation: {
        address: destination.name,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      departureTime: departureDateTime,
      availableSeats: seatsTotal,
      pricePerSeat: Number(price),
      vehicleInfo: vehicleDetails,
      description: description,
    };

    try {
      const response = await rideService.createRide(rideData);
      if (response.success) {
        setSuccess("Ride posted successfully!");
        setTimeout(() => {
          navigate("/my-rides");
        }, 2000);
      } else {
        setError(response.message || "Failed to create ride");
      }
    } catch (err) {
      setError(err.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-10 font-[Poppins] selection:bg-pastel-lavender-light/50 overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pastel-lavender-light/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pastel-mint-light/30 rounded-full blur-[120px] animate-pulse-slow-reverse" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-pastel-pink-light/20 rounded-full blur-[100px]" />
      </div>
 
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all mb-10 font-black uppercase tracking-widest text-[10px]"
        >
          <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm border border-slate-200/70 group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>
 
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight">Post Your <span className="text-pastel-lavender-dark">Journey</span></h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Share your dreamy ride with fellow travelers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Messages */}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
              <CheckCircle size={18} /> {success}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {/* Card 1: Route */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 shadow-pastel-shadow border border-slate-200/70 group relative overflow-visible">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-mint-light/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender rounded-3xl flex items-center justify-center text-slate-800 shadow-lg shadow-pastel-lavender/20">
                <Navigation size={24} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Route Details</h2>
                <p className="text-xs font-black text-pastel-lavender-dark uppercase tracking-widest mt-1">Where are we going?</p>
              </div>
            </div>
 
            <div className="relative pl-8 sm:pl-10 relative z-10">
              {/* Vertical Route Line Visual */}
              <div className="absolute left-[15px] top-8 bottom-8 w-[3px] bg-slate-200/50 rounded-full" />
              <div className="absolute left-[15px] top-8 h-1/2 w-[3px] bg-pastel-lavender rounded-full shadow-[0_0_10px_#DCD6F7]" />
               
              <div className="space-y-12">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-pastel-lavender shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-pastel-lavender rounded-full" />
                  </div>
                  <AutoCompleteLocation
                    label="Starting From"
                    onSelect={(loc) => {
                      setPickup(loc);
                      setErrors((e) => ({ ...e, pickup: false }));
                    }}
                    error={errors.pickup}
                  />
                  {errors.pickup && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1 animate-bounce">Pickup location is required!</p>}
                </div>
 
                {/* Destination */}
                <div className="relative">
                  <div className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-pastel-mint shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-pastel-mint rounded-full" />
                  </div>
                  <AutoCompleteLocation
                    label="Going To"
                    onSelect={(loc) => {
                      setDestination(loc);
                      setErrors((e) => ({ ...e, destination: false }));
                    }}
                    error={errors.destination}
                  />
                  {errors.destination && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1 animate-bounce">Destination is required!</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Timing & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Schedule Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-pastel-shadow border border-slate-200/70">
              <h3 className="text-xs font-black text-pastel-lavender-dark uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Calendar size={20} /> Departure Schedule
              </h3>
              <div className="space-y-5">
                <div className="group">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setErrors((err) => ({ ...err, date: false }));
                    }}
                    className={`w-full px-6 py-4 bg-white/50 border ${errors.date ? 'border-red-300' : 'border-slate-200/70'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-bold text-slate-800 shadow-inner`}
                  />
                </div>
                <div className="group">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setErrors((err) => ({ ...err, time: false }));
                    }}
                    className={`w-full px-6 py-4 bg-white/50 border ${errors.time ? 'border-red-300' : 'border-slate-200/70'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-bold text-slate-800 shadow-inner`}
                  />
                </div>
              </div>
            </div>
 
            {/* Pricing Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-pastel-shadow border border-slate-200/70">
              <h3 className="text-xs font-black text-pastel-mint-dark uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <IndianRupee size={20} /> Fare Estimator
              </h3>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pastel-mint-dark transition-colors">
                  <IndianRupee size={24} strokeWidth={3} />
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setErrors((err) => ({ ...err, price: false }));
                  }}
                  className={`w-full pl-16 pr-6 py-5 bg-white/50 border ${errors.price ? 'border-red-300' : 'border-slate-200/70'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-mint-light/50 outline-none transition-all font-black text-2xl text-slate-800 shadow-inner`}
                />
              </div>
              <p className="mt-5 text-[9px] text-slate-400 font-black uppercase tracking-widest text-center opacity-70">Suggested: ₹150 - ₹450</p>
            </div>
          </div>

          {/* Card 3: Vehicle & Capacity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 shadow-pastel-shadow border border-slate-200/70 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pastel-pink-light/10 rounded-full blur-3xl -ml-32 -mb-32" />
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">
              {/* Seats Counter */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block flex items-center gap-2">
                  <Users size={20} className="text-pastel-lavender-dark" /> Seat Management
                </label>
                <div className="flex items-center justify-between bg-white/60 border-2 border-slate-200/70 rounded-[2rem] p-3 shadow-inner">
                  <button 
                    type="button" 
                    onClick={decrement}
                    className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-pastel-pink-dark hover:shadow-md transition-all active:scale-90"
                  >
                    <Minus size={24} strokeWidth={3} />
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-black text-slate-800 tabular-nums leading-none">{seatsTotal}</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest opacity-60">Reserved</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={increment}
                    className="w-14 h-14 rounded-2xl bg-pastel-lavender-dark shadow-lg shadow-pastel-lavender/30 flex items-center justify-center text-white hover:scale-105 transition-all active:scale-90"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
 
              {/* Show/Hide Vehicle Form Toggle */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setShowVehicleForm(!showVehicleForm)}
                  className={`w-full h-[88px] rounded-[2rem] flex items-center justify-center gap-4 transition-all font-black text-sm uppercase tracking-widest group border-2 ${
                    showVehicleForm 
                      ? "bg-white text-pastel-lavender-dark border-pastel-lavender-light shadow-inner" 
                      : "bg-pastel-lavender-light border-slate-200/70 text-slate-700 shadow-pastel-shadow hover:scale-[1.02]"
                  }`}
                >
                  <Car size={24} className="group-hover:rotate-12 transition-transform" />
                  {showVehicleForm ? "Minimize Details" : "Attach Vehicle"}
                  <div className={`p-2 rounded-xl transition-all ${showVehicleForm ? "bg-pastel-lavender-dark text-white rotate-180" : "bg-white text-slate-400 group-hover:bg-pastel-lavender-dark group-hover:text-white"}`}>
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/user-profile")}
                  className="mt-2 w-full text-center text-[10px] font-black text-pastel-lavender-dark hover:underline uppercase tracking-widest block"
                >
                  Manage garage in Profile Settings ⚙️
                </button>
              </div>
            </div>

            {/* Vehicle Details Form */}
            {showVehicleForm && (
              <div className="space-y-8 pb-10 border-t-2 border-dashed border-slate-100 pt-10 relative z-10 animate-in slide-in-from-top-4 duration-500">
                {/* Make and Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Identity</label>
                    <input
                      type="text"
                      placeholder="e.g. Tesla, Porsche, BYD..."
                      value={vehicleDetails.make}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, make: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specific Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Model 3, Taycan, Atto 3..."
                      value={vehicleDetails.model}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, model: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                </div>
 
                {/* Year and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Gauge size={14} /> Vintage Year
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={vehicleDetails.year}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, year: parseInt(e.target.value)})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Palette size={14} /> Outer Aesthetic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pastel Pink, Mint, Cream..."
                      value={vehicleDetails.color}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, color: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                </div>
 
                {/* Fuel Type and AC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Fuel size={14} /> Energy Source
                    </label>
                    <select
                      value={vehicleDetails.fuelType}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, fuelType: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="petrol">🛢️ Pure Gasoline</option>
                      <option value="diesel">🛢️ Bio-Diesel</option>
                      <option value="hybrid">⚡ Eco-Hybrid</option>
                      <option value="electric">🔌 Clean Electric</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-4 w-full p-4 bg-gradient-to-br from-pastel-mint-light/20 to-pastel-mint-light/40 border-2 border-slate-200/70 rounded-2xl cursor-pointer hover:shadow-md transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                        <Wind size={64} />
                      </div>
                      <input
                        type="checkbox"
                        checked={vehicleDetails.acAvailable}
                        onChange={(e) => setVehicleDetails({...vehicleDetails, acAvailable: e.target.checked})}
                        className="w-6 h-6 rounded-lg cursor-pointer accent-pastel-mint-dark"
                      />
                      <div className="flex items-center gap-2 relative z-10">
                        <Wind size={18} className="text-pastel-mint-dark group-hover:animate-spin-slow" />
                        <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Premium AC Chill ❄️</span>
                      </div>
                    </label>
                  </div>
                </div>
 
                {/* License Plate and Registration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plate Number</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-01-AB-1234"
                      value={vehicleDetails.licensePlate}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, licensePlate: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner tracking-widest uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registration ID</label>
                    <input
                      type="text"
                      placeholder="Official Government ID"
                      value={vehicleDetails.registrationNumber}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, registrationNumber: e.target.value})}
                      className="w-full px-6 py-4 bg-white/60 border border-slate-200/70 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                </div>
 
                {/* Vehicle Summary Card */}
                {getVehicleDisplay() && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-pastel-lavender/10 to-pastel-mint/10 border-2 border-slate-200/70 rounded-[2rem] shadow-sm relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none" />
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-pastel-lavender-dark shadow-pastel-shadow scale-90 group-hover:scale-100 transition-transform">
                        <Car size={32} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Confirmed</p>
                        <p className="text-xl font-black text-slate-800 tracking-tight">{getVehicleDisplay()}</p>
                      </div>
                      <div className="ml-auto flex flex-col items-end gap-1">
                        {vehicleDetails.acAvailable && (
                          <div className="px-3 py-1 bg-pastel-mint text-slate-700 text-[10px] font-black uppercase tracking-tighter rounded-xl border border-white shadow-sm">
                            Ice Cold ❄️
                          </div>
                        )}
                        <div className="px-3 py-1 bg-pastel-lavender text-slate-700 text-[10px] font-black uppercase tracking-tighter rounded-xl border border-slate-200/70 shadow-sm">
                          {vehicleDetails.fuelType}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
 
            {/* Notes Section */}
            <div className="relative z-10 pt-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block flex items-center gap-2">
                <FileText size={16} /> Heartfelt Ride Notes
              </label>
              <div className="relative group">
                <FileText className="absolute left-6 top-6 text-slate-300 group-focus-within:text-pastel-lavender-dark transition-colors" size={24} />
                <textarea
                  placeholder="E.g. I create amazing playlists, have extra space for luggage, or prefer quiet cozy vibes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full pl-16 pr-6 py-6 bg-white/50 border border-slate-200/70 rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light/50 outline-none transition-all font-bold text-slate-800 shadow-inner resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
 
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 md:py-8 bg-slate-800 text-white font-black rounded-[2.5rem] hover:bg-slate-900 shadow-2xl shadow-slate-200 hover:shadow-pastel-lavender/40 transition-all hover:-translate-y-1 active:scale-[0.98] flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pastel-lavender/20 to-pastel-mint/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {loading ? (
              <Loader2 className="animate-spin" size={32} strokeWidth={3} />
            ) : (
              <>
                <div className="flex items-center gap-4 text-xl">
                  <span>Create Final Post</span>
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.4em] font-black opacity-50">Launch Your Pastel Journey</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}