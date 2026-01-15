import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Loader2, 
  Sparkles,
  Map as MapIcon,
  ChevronRight
} from "lucide-react";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import RideCard from "./RideCard";
import rideService from "../services/rideService";
import authService from "../services/authService";

export default function FindRide() {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [date, setDate] = useState("");
  const [minSeats, setMinSeats] = useState(1);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // MARKETPLACE MODEL: Load all available rides on component mount
  React.useEffect(() => {
    loadAllAvailableRides();
  }, []);

  // MARKETPLACE MODEL: Load all available rides on component mount
  React.useEffect(() => {
    loadAllAvailableRides();
  }, []);

  const loadAllAvailableRides = async () => {
    try {
      setLoading(true);
      const response = await rideService.getAllRides({ minSeats: 1 });
      if (response.success) {
        const currentUser = authService.getCurrentUser();
        const filteredRides = (response.data.rides || []).filter(
          (ride) => ride.driver?._id !== currentUser?._id
        );
        setRides(filteredRides);
      }
    } catch (error) {
      console.error("Failed to load rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const findRides = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      
      // MARKETPLACE MODEL: Fetch ALL active rides with optional filters
      const params = {
        minSeats: minSeats,
      };
      
      // Add filters only if provided (optional, not required)
      if (currentLocation) {
        params.startLocation = currentLocation.name;
      }
      if (date) {
        params.departureDate = date;
      }
      
      const response = await rideService.getAllRides(params);
      if (response.success) {
        // Filter out user's own rides
        const currentUser = authService.getCurrentUser();
        const filteredRides = (response.data.rides || []).filter(
          (ride) => ride.driver?._id !== currentUser?._id
        );
        setRides(filteredRides);
      } else {
        alert(response.message || "Failed to fetch rides");
      }
    } catch (error) {
      alert(error.message || "Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentLocation(null);
    setDate("");
    setMinSeats(1);
    setRides([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Poppins] selection:bg-indigo-100">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-semibold"
          >
            <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Network Active</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Find Your Next Journey
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Search for verified rides heading your way. Simple, secure, and sustainable travel.
          </p>
        </div>

        {/* Search Command Hub */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white p-4 md:p-6 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Location Input */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-indigo-600">
                <MapPin size={20} />
              </div>
              <div className="pl-6">
                <AutoCompleteLocation
                  label="Pickup Area"
                  onSelect={(loc) => setCurrentLocation({
                    name: loc.name,
                    lat: loc.lat ?? loc.latitude ?? loc.geometry?.location?.lat,
                    lng: loc.lng ?? loc.lon ?? loc.longitude ?? loc.geometry?.location?.lng,
                  })}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="lg:col-span-3 relative px-4 lg:border-l lg:border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Departure Date</label>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                <input
                  type="date"
                  className="w-full bg-transparent outline-none font-bold text-slate-900"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Seats Input */}
            <div className="lg:col-span-2 relative px-4 lg:border-l lg:border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Seats</label>
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400" />
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent outline-none font-bold text-slate-900"
                  value={minSeats}
                  onChange={(e) => setMinSeats(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                onClick={findRides}
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Search
              </button>
              <button
                onClick={handleRefresh}
                className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-rose-500 transition-all"
                title="Reset Search"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Sparkles className="text-amber-400" /> 
              {hasSearched ? `Available Rides (${rides.length})` : "Recommended Rides"}
            </h2>
            {rides.length > 0 && (
               <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                 Sorted by Date <ChevronRight size={14} />
               </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : rides.length === 0 ? (
            <div className="bg-white rounded-[3rem] py-20 px-6 text-center border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                <MapIcon size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {hasSearched ? "No rides found for this date" : "Start your search"}
              </h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">
                Try adjusting your location or selecting a different date to find available commutes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}