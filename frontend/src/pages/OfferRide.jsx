import React, { useState } from "react";
import { 
  Minus, Plus, ArrowLeft, IndianRupee, 
  MapPin, Calendar, Clock, Car, 
  FileText, Loader2, ChevronRight, Navigation 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import axios from "axios";

export default function OfferRide() {
  const navigate = useNavigate();

  const [seatsTotal, setSeatsTotal] = useState(1);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const increment = () => setSeatsTotal((s) => s + 1);
  const decrement = () => seatsTotal > 1 && setSeatsTotal((s) => s - 1);

  const validate = () => {
    const e = {};
    if (!pickup?.lat || !pickup?.lng) e.pickup = true;
    if (!destination?.lat || !destination?.lng) e.destination = true;
    if (!date) e.date = true;
    if (!time) e.time = true;
    if (!price || Number(price) <= 0) e.price = true;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const payload = {
      origin: pickup.name,
      destination: destination.name,
      dateTime: new Date(`${date}T${time}`),
      seatsTotal,
      price: Number(price),
      vehicle,
      description,
      originCoords: { type: "Point", coordinates: [pickup.lng, pickup.lat] },
      destinationCoords: { type: "Point", coordinates: [destination.lng, destination.lat] },
    };

    try {
      await axios.post("http://localhost:5003/api/rides", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
      navigate("/profile"); // Navigating back to the new dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-[Poppins] selection:bg-indigo-100">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-medium"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Post a New Ride</h1>
          <p className="text-slate-500 mt-2">Fill in the details to share your journey with others.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Route */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Navigation size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Route Details</h2>
            </div>

            <div className="relative pl-8">
              {/* Vertical Route Line Visual */}
              <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-dashed bg-gradient-to-b from-indigo-500 via-slate-200 to-emerald-500" />
              
              <div className="space-y-10">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 z-10" />
                  <AutoCompleteLocation
                    label="Starting From"
                    onSelect={(loc) => {
                      setPickup(loc);
                      setErrors((e) => ({ ...e, pickup: false }));
                    }}
                    error={errors.pickup}
                  />
                  {errors.pickup && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">Pickup location is required</p>}
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-emerald-500 z-10" />
                  <AutoCompleteLocation
                    label="Going To"
                    onSelect={(loc) => {
                      setDestination(loc);
                      setErrors((e) => ({ ...e, destination: false }));
                    }}
                    error={errors.destination}
                  />
                  {errors.destination && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">Destination is required</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Timing & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" /> Schedule
              </h3>
              <div className="space-y-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((err) => ({ ...err, date: false }));
                  }}
                  className={`w-full px-4 py-4 bg-slate-50 border ${errors.date ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900`}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors((err) => ({ ...err, time: false }));
                  }}
                  className={`w-full px-4 py-4 bg-slate-50 border ${errors.time ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900`}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <IndianRupee size={16} className="text-emerald-500" /> Pricing
              </h3>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <IndianRupee size={20} />
                </div>
                <input
                  type="number"
                  placeholder="Price per seat"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setErrors((err) => ({ ...err, price: false }));
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.price ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-slate-900`}
                />
              </div>
              <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase text-center">Recommended: ₹150 - ₹300</p>
            </div>
          </div>

          {/* Card 3: Vehicle & Capacity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Seats Counter */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Available Seats</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-2">
                  <button 
                    type="button" 
                    onClick={decrement}
                    className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-black text-slate-900">{seatsTotal}</span>
                  <button 
                    type="button" 
                    onClick={increment}
                    className="w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center text-white hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Vehicle Input */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Vehicle Description</label>
                <div className="relative group">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={20} />
                  <input
                    type="text"
                    placeholder="e.g. White Tesla Model 3"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Journey Notes (Optional)</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600" size={20} />
                <textarea
                  placeholder="E.g. No smoking, I have space for luggage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-indigo-600 shadow-2xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Confirm & Post Ride
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}