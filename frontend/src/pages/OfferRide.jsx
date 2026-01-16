import React, { useState } from "react";
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Seats Counter */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                  <Users size={16} /> Available Seats
                </label>
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

              {/* Show/Hide Vehicle Form Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowVehicleForm(!showVehicleForm)}
                  className="w-full h-16 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-indigo-600 hover:bg-indigo-100 group"
                >
                  <Car size={20} className="group-hover:scale-110 transition-transform" />
                  {showVehicleForm ? "Hide Vehicle Details" : "Add Vehicle Details"}
                  <ChevronRight size={20} className={`transition-transform ${showVehicleForm ? "rotate-90" : ""}`} />
                </button>
              </div>
            </div>

            {/* Vehicle Details Form */}
            {showVehicleForm && (
              <div className="space-y-6 pb-6 border-t border-slate-100 pt-6">
                {/* Make and Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Vehicle Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota, Honda, BMW..."
                      value={vehicleDetails.make}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, make: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Camry, Civic, 3 Series..."
                      value={vehicleDetails.model}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, model: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Year and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                      <Gauge size={14} /> Year
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={vehicleDetails.year}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                      <Palette size={14} /> Color
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. White, Black, Silver..."
                      value={vehicleDetails.color}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, color: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Fuel Type and AC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                      <Fuel size={14} /> Fuel Type
                    </label>
                    <select
                      value={vehicleDetails.fuelType}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, fuelType: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    >
                      <option value="petrol">🛢️ Petrol</option>
                      <option value="diesel">🛢️ Diesel</option>
                      <option value="hybrid">⚡ Hybrid</option>
                      <option value="electric">🔌 Electric</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-4 w-full p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-xl cursor-pointer hover:border-blue-300 transition-all group">
                      <input
                        type="checkbox"
                        checked={vehicleDetails.acAvailable}
                        onChange={(e) => setVehicleDetails({...vehicleDetails, acAvailable: e.target.checked})}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <Wind size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-700">Air Conditioning Available</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* License Plate and Registration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">License Plate</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-01-AB-1234"
                      value={vehicleDetails.licensePlate}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, licensePlate: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Registration Number</label>
                    <input
                      type="text"
                      placeholder="e.g. ABC123456789"
                      value={vehicleDetails.registrationNumber}
                      onChange={(e) => setVehicleDetails({...vehicleDetails, registrationNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Vehicle Summary Card */}
                {getVehicleDisplay() && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Car size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Vehicle</p>
                        <p className="font-bold text-slate-900">{getVehicleDisplay()}</p>
                      </div>
                      {vehicleDetails.acAvailable && (
                        <div className="ml-auto px-3 py-1 bg-blue-200 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                          <Wind size={14} /> AC
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes Section */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Journey Notes (Optional)</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600" size={20} />
                <textarea
                  placeholder="E.g. No smoking, I have space for luggage, prefer quiet rides..."
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