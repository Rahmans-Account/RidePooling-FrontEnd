import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ChevronRight,
  Heart,
  LayoutGrid,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import RideCard from "./RideCard";
import rideService from "../services/rideService";
import authService from "../services/authService";
import { notify } from "../utils/notify";

export default function FindRide() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [date, setDate] = useState("");
  const [minSeats, setMinSeats] = useState(1);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Premium Features toggles
  const [cardDeckMode, setCardDeckMode] = useState(false);
  const [pinkRouteMode, setPinkRouteMode] = useState(false);
  const [deckIndex, setDeckIndex] = useState(0);

  const displayedRides = rides;

  // Prefill check on mount / state change
  React.useEffect(() => {
    if (location.state) {
      const { prefillPickup, prefillDestination, prefillDate } = location.state;
      if (prefillPickup) setCurrentLocation(prefillPickup);
      if (prefillDestination) setDestinationLocation(prefillDestination);
      if (prefillDate) setDate(prefillDate);

      if (prefillPickup && prefillDestination) {
        setTimeout(() => {
          triggerPrefilledSearch(prefillPickup, prefillDestination, prefillDate);
        }, 100);
      }
    } else {
      loadAllAvailableRides();
    }
  }, [location.state]);

  const triggerPrefilledSearch = async (pickup, dest, depDate) => {
    try {
      setLoading(true);
      setHasSearched(true);
      const params = {
        minSeats: minSeats,
        startLocation: pickup.name,
        latitude: pickup.lat,
        longitude: pickup.lng,
        maxDistanceKm: 25,
        endLocation: dest.name,
        destLatitude: dest.lat,
        destLongitude: dest.lng
      };
      if (depDate) {
        params.departureDate = depDate;
      }
      const response = await rideService.getAllRides(params);
      if (response.success) {
        const currentUser = authService.getCurrentUser();
        const filteredRides = (response.data.rides || []).filter(
          (ride) => ride.driver?._id !== currentUser?._id
        );
        setRides(filteredRides);
      } else {
        notify.error(response.message || "Failed to fetch rides");
      }
    } catch (error) {
      notify.error("Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        notify.error(response.message || "Failed to fetch rides");
      }
    } catch (error) {
      notify.error("Failed to load rides");
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
        params.latitude = currentLocation.lat;
        params.longitude = currentLocation.lng;
        params.maxDistanceKm = 25;
      }
      if (destinationLocation) {
        params.endLocation = destinationLocation.name;
        params.destLatitude = destinationLocation.lat;
        params.destLongitude = destinationLocation.lng;
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
        notify.error(response.message || "Failed to fetch rides");
      }
    } catch (error) {
      notify.error(error.message || "Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentLocation(null);
    setDestinationLocation(null);
    setDate("");
    setMinSeats(1);
    setRides([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-pastel-cream font-[Poppins] selection:bg-pastel-lavender-light/50 relative overflow-x-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pastel-lavender-light/30 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pastel-mint-light/30 rounded-full blur-[120px] -z-10 animate-pulse-slow-reverse" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm border border-slate-200/70 group-hover:shadow-md group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Dashboard
          </button>
 
          <div className="flex items-center gap-4 px-6 py-3 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-[2rem] shadow-sm">
             <div className="w-2.5 h-2.5 rounded-full bg-pastel-mint-dark animate-pulse shadow-[0_0_10px_#A8E6CF]" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pastel Network Encryption Active</span>
          </div>
        </div>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter mb-6 leading-tight">
            Discover Your <span className="text-pastel-lavender-dark">Perfect</span> Ride
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Search for cute, verified rides heading your way. Simple, dreamy, and sustainable travel.
          </p>
        </div>

        {/* Search Command Hub */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[3.5rem] shadow-pastel-shadow border border-slate-200/70 p-6 md:p-8 mb-20 ring-1 ring-slate-100/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
             {/* Pickup Location Input */}
            <div className="lg:col-span-3 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-focus-within:text-pastel-lavender-dark transition-colors">
                <MapPin size={24} strokeWidth={3} />
              </div>
              <div className="pl-10">
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

            {/* Destination Location Input */}
            <div className="lg:col-span-3 relative group lg:border-l-2 lg:border-dashed lg:border-slate-100 lg:pl-6">
              <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-focus-within:text-pastel-mint-dark transition-colors">
                <MapPin size={24} strokeWidth={3} />
              </div>
              <div className="pl-16">
                <AutoCompleteLocation
                  label="Destination Area"
                  onSelect={(loc) => setDestinationLocation({
                    name: loc.name,
                    lat: loc.lat ?? loc.latitude ?? loc.geometry?.location?.lat,
                    lng: loc.lng ?? loc.lon ?? loc.longitude ?? loc.geometry?.location?.lng,
                  })}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="lg:col-span-2 relative px-6 lg:border-l-2 lg:border-dashed lg:border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Departure Date</label>
              <div className="flex items-center gap-4 group">
                <Calendar size={22} className="text-slate-300 group-focus-within:text-pastel-lavender-dark transition-colors" strokeWidth={3} />
                <input
                  type="date"
                  className="w-full bg-transparent outline-none font-black text-slate-800 placeholder:text-slate-300"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Seats Input */}
            <div className="lg:col-span-2 relative px-6 lg:border-l-2 lg:border-dashed lg:border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Seats</label>
              <div className="flex items-center gap-4 group">
                <Users size={22} className="text-slate-300 group-focus-within:text-pastel-lavender-dark transition-colors" strokeWidth={3} />
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent outline-none font-black text-slate-800 tabular-nums"
                  value={minSeats}
                  onChange={(e) => setMinSeats(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>
 
            {/* Action Buttons */}
            <div className="lg:col-span-2 flex items-center gap-3">
              <button
                onClick={findRides}
                disabled={loading}
                className="flex-1 bg-slate-800 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : <Search size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />}
                <span className="text-sm">Explore</span>
              </button>
              <button
                onClick={handleRefresh}
                className="p-5 bg-white shadow-inner border border-slate-200/70 text-slate-300 rounded-3xl hover:text-pastel-pink-dark transition-all hover:scale-110 active:scale-90"
                title="Reset Search"
              >
                <RefreshCw size={20} strokeWidth={3} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-20">
          {/* Filter and View Toggles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-white">
                <Sparkles className="text-pastel-peach-dark animate-spin-slow" size={24} /> 
              </div>
              {hasSearched ? `Network Results (${displayedRides.length})` : "Featured Journeys"}
            </h2>

            <div className="flex flex-wrap items-center gap-4 z-10">
              {/* Pink Route Option Switch */}
              <button
                onClick={() => {
                  setPinkRouteMode(!pinkRouteMode);
                  setDeckIndex(0);
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                  pinkRouteMode
                    ? "bg-pastel-pink-light/30 border-pastel-pink text-pastel-pink-dark shadow-[0_0_15px_rgba(240,98,146,0.2)]"
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                }`}
              >
                <Heart size={14} className={pinkRouteMode ? "fill-pastel-pink-dark text-pastel-pink-dark animate-pulse" : ""} />
                Pink Route
              </button>

              {/* View Toggle Mode */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/70 p-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <button
                  onClick={() => setCardDeckMode(false)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${!cardDeckMode ? 'bg-pastel-mint-light text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setCardDeckMode(true)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${cardDeckMode ? 'bg-pastel-lavender-light text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Card Deck Mode"
                >
                  <Layers size={16} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 bg-white/70 border border-slate-200/70 rounded-[3rem] animate-pulse" />
              ))}
            </div>
          ) : displayedRides.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[4rem] py-32 px-10 text-center border border-slate-200/70 shadow-pastel-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-inner flex items-center justify-center text-slate-200 mx-auto mb-10 group-hover:scale-110 transition-transform duration-700">
                <MapIcon size={56} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {hasSearched ? "The Horizon is Quiet" : "Begin Your Exploration"}
              </h3>
              <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium leading-relaxed">
                Adjust your destination or disable filters to discover journeys in the pastel network.
              </p>
            </div>
          ) : cardDeckMode ? (
            /* Card Deck Swiper View */
            <div className="flex flex-col items-center justify-center py-6 max-w-md mx-auto relative min-h-[420px]">
              <AnimatePresence mode="wait">
                {deckIndex < displayedRides.length ? (
                  <motion.div
                    key={displayedRides[deckIndex]._id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 140) {
                        // Swipe Right -> View details
                        notify.success("Opening ride details!");
                        navigate(`/ride/${displayedRides[deckIndex]._id}`);
                      } else if (info.offset.x < -140) {
                        // Swipe Left -> Skip
                        setDeckIndex((prev) => prev + 1);
                      }
                    }}
                    initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className="w-full cursor-grab active:cursor-grabbing select-none"
                  >
                    <RideCard ride={displayedRides[deckIndex]} isPinkOverlay={pinkRouteMode} />
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 animate-pulse">
                      ◀ Drag Left to Skip | Drag Right to Book ▶
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-center p-10 bg-white/90 backdrop-blur-xl rounded-[3.5rem] border border-slate-200/70 shadow-pastel-shadow">
                    <Sparkles size={40} className="text-pastel-lavender-dark mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-black text-slate-800">Deck Exhausted</h3>
                    <p className="text-slate-500 text-xs mt-2 font-medium">You've reached the end of this journey list.</p>
                    <button
                      onClick={() => setDeckIndex(0)}
                      className="mt-6 px-6 py-3 bg-slate-800 text-white rounded-full font-black text-[9px] uppercase tracking-widest cursor-pointer"
                    >
                      Restart Exploration
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Standard Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {displayedRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} isPinkOverlay={pinkRouteMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}