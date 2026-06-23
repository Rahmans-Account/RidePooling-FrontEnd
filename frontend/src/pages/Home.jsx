import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Search, ShieldCheck, Users, ArrowRight, Zap, X, MapPin, Sparkles, Navigation, Calendar } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AutoCompleteLocation from "../components/AutoCompleteLocation";
import api from "../api/client";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: "50k+",
    totalCities: "120+",
    co2Saved: "2.5M kg",
    completedRides: "15k+",
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split("T")[0]);

  const getHabitGuesses = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) {
      return [
        { name: "🏢 Corporate Tech Park, DLF Phase 3", lat: 28.495, lng: 77.089, icon: "🏢", label: "Office Commute" },
        { name: "🏫 Delhi University North Campus", lat: 28.690, lng: 77.210, icon: "🏫", label: "Morning Class" },
        { name: "☕ Blue Tokai Coffee Roasters", lat: 28.528, lng: 77.219, icon: "☕", label: "Morning Brew" }
      ];
    } else if (hour >= 11 && hour < 16) {
      return [
        { name: "🥗 Social CP Eating House", lat: 28.630, lng: 77.218, icon: "🥗", label: "Lunch Spot" },
        { name: "💻 WeWork CyberCity", lat: 28.502, lng: 77.080, icon: "💻", label: "Afternoon Cowork" },
        { name: "🛍️ Select CITYWALK Mall Saket", lat: 28.528, lng: 77.219, icon: "🛍️", label: "Quick Errands" }
      ];
    } else if (hour >= 16 && hour < 21) {
      return [
        { name: "💪 Cult.fit Gym, Sector 45", lat: 28.452, lng: 77.080, icon: "💪", label: "Evening Workout" },
        { name: "🏡 Cyber Terraces Residency Sector 56", lat: 28.432, lng: 77.100, icon: "🏡", label: "Heading Home" },
        { name: "🍹 Sector 29 Food Market & Bars", lat: 28.468, lng: 77.065, icon: "🍹", label: "Social Hour" }
      ];
    } else {
      return [
        { name: "🏡 Cyber Terraces Residency Sector 56", lat: 28.432, lng: 77.100, icon: "🏡", label: "Late Return" },
        { name: "✈️ IGI Airport Terminal 3", lat: 28.556, lng: 77.100, icon: "✈️", label: "Airport Run" },
        { name: "🍔 24/7 Food Plaza Sector 18", lat: 28.570, lng: 77.320, icon: "🍔", label: "Midnight Cravings" }
      ];
    }
  };

  const handleQuickGuessSearch = (guess) => {
    // Navigate with pre-filled state
    const simulatedPickup = { name: "Current Location", lat: 28.535, lng: 77.155 }; // Simulated start point
    navigate("/find-ride", {
      state: {
        prefillPickup: simulatedPickup,
        prefillDestination: { name: guess.name, lat: guess.lat, lng: guess.lng },
        prefillDate: searchDate
      }
    });
  };

  const handleFullSearchSubmit = () => {
    if (!pickup || !destination) return;
    navigate("/find-ride", {
      state: {
        prefillPickup: pickup,
        prefillDestination: destination,
        prefillDate: searchDate
      }
    });
  };

  useEffect(() => {
    api.get("/auth/stats")
      .then((res) => {
        if (res.data && res.data.success) {
          const s = res.data.data;
          setStats({
            totalUsers: s.totalUsers >= 1000 ? `${(s.totalUsers / 1000).toFixed(1)}k+` : s.totalUsers,
            totalCities: s.totalCities,
            co2Saved: s.co2Saved >= 1000 ? `${(s.co2Saved / 1000).toFixed(1)}k kg` : `${s.co2Saved} kg`,
            completedRides: s.completedRides >= 1000 ? `${(s.completedRides / 1000).toFixed(1)}k+` : s.completedRides,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load statistics:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-pastel-cream font-[Poppins] text-slate-800 selection:bg-pastel-pink-light selection:text-pastel-pink-dark">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-mint-dark rounded-2xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 shadow-lg shadow-pastel-mint/20">
              <Car size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base sm:text-xl tracking-tight text-slate-800">
              RidePooling
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-pastel-mint-dark transition">
              Features
            </a>
            <span className="opacity-80">Safety</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-pastel-mint rounded-full hover:bg-pastel-mint-dark shadow-xl shadow-pastel-mint/30 transition-all active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 sm:px-5 py-2 text-sm font-bold text-slate-600 hover:text-pastel-mint-dark transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-pastel-mint rounded-full hover:bg-pastel-mint-dark shadow-xl shadow-pastel-mint/30 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pastel-lavender-light text-pastel-lavender-dark text-xs font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
            <Zap size={14} fill="currentColor" />
            The Future of Urban Travel
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-800 leading-[1.05] tracking-tight">
            Smart Ridepooling for <br />
            <span className="text-pastel-mint-dark">
              Smarter Commutes.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Reduce your carbon footprint and your travel costs. Connect with
            verified professionals heading your way in a seamless, secure
            environment.
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            {/* Minimalist Floating Chalk Cream Pill */}
            <div className="w-full md:flex-1 relative">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsSearchOpen(true);
                  } else {
                    navigate("/login");
                  }
                }}
                className="w-full flex items-center justify-between px-8 py-5 bg-[#FFFBE6] hover:bg-[#FFF8CC] text-slate-800 font-bold border-2 border-slate-200/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-pastel-mint rounded-full text-slate-800 animate-pulse">
                    <Search size={18} strokeWidth={3} />
                  </div>
                  <span className="text-slate-400 font-bold tracking-tight text-sm md:text-base">Where shall we wander today?...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-pastel-lavender-dark uppercase tracking-widest px-3 py-1 bg-pastel-lavender-light rounded-full hidden sm:inline-block">Instant Sync</span>
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </button>
            </div>

            <Link
              to={isAuthenticated ? "/offer-ride" : "/login"}
              className="w-full md:w-auto px-10 py-5 rounded-full bg-slate-800 text-white font-black hover:bg-slate-900 border-2 border-slate-800 flex items-center justify-center gap-2 hover:shadow-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10"
            >
              Offer a Ride <ArrowRight size={20} />
            </Link>
          </div>

          {/* Zero-Input Gesture Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 250 }}
                  className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-slate-200/70 p-6 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-lavender-light/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-pastel-mint/30 text-slate-800 rounded-2xl">
                        <Navigation size={22} className="text-pastel-mint-dark" strokeWidth={3} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configure Expedition</h2>
                        <p className="text-xs font-black text-pastel-lavender-dark uppercase tracking-widest mt-0.5">Explore the pastel network</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-2xl transition-all hover:rotate-90"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-focus-within:text-pastel-lavender-dark transition-colors">
                          <MapPin size={22} strokeWidth={3} />
                        </div>
                        <div className="pl-10">
                          <AutoCompleteLocation
                            label="Pickup Location"
                            onSelect={(loc) => setPickup({
                              name: loc.name,
                              lat: loc.lat ?? loc.latitude ?? loc.geometry?.location?.lat,
                              lng: loc.lng ?? loc.lon ?? loc.longitude ?? loc.geometry?.location?.lng,
                            })}
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-focus-within:text-pastel-mint-dark transition-colors">
                          <MapPin size={22} strokeWidth={3} />
                        </div>
                        <div className="pl-10">
                          <AutoCompleteLocation
                            label="Destination Target"
                            onSelect={(loc) => setDestination({
                              name: loc.name,
                              lat: loc.lat ?? loc.latitude ?? loc.geometry?.location?.lat,
                              lng: loc.lng ?? loc.lon ?? loc.longitude ?? loc.geometry?.location?.lng,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div className="md:col-span-2 relative pl-6 border-l-2 border-dashed border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Departure Date</label>
                        <div className="flex items-center gap-4 group">
                          <Calendar size={22} className="text-slate-300 group-focus-within:text-pastel-lavender-dark transition-colors" strokeWidth={3} />
                          <input
                            type="date"
                            className="w-full bg-transparent outline-none font-black text-slate-800 placeholder:text-slate-300"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={handleFullSearchSubmit}
                        disabled={!pickup || !destination}
                        className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      >
                        <Search size={18} strokeWidth={3} /> Search Journeys
                      </button>
                    </div>

                    {/* Twist: Calendar Sync & Habits */}
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Sparkles size={14} className="text-pastel-peach-dark" /> Habit-Based Predictions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {getHabitGuesses().map((guess, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickGuessSearch(guess)}
                            className="p-4 bg-[#FFFBE6] hover:bg-[#FFF3C5] border border-[#FFE0B2]/40 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group flex items-start gap-3 cursor-pointer"
                          >
                            <span className="text-2xl mt-0.5">{guess.icon}</span>
                            <div>
                              <span className="text-[9px] font-black text-pastel-peach-dark uppercase tracking-widest block mb-0.5">{guess.label}</span>
                              <span className="text-xs font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-pastel-peach-dark transition-colors">{guess.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Visual */}
          <div className="mt-16 md:mt-24 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-pastel-cream via-transparent to-transparent z-10" />
            <div className="rounded-4xl overflow-hidden border-[12px] border-slate-100 shadow-pastel-shadow mx-auto max-w-5xl">
              <img
                src="https://i.pinimg.com/1200x/9e/1e/7c/9e1e7c7983352dc78b81a3dd53fc4013.jpg"
                alt="Ridepooling commute"
                className="w-full h-[280px] sm:h-[380px] md:h-[500px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-slate-200/70 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "Active Users", value: stats.totalUsers, color: "text-pastel-mint-dark" },
              { label: "Cities Covered", value: stats.totalCities, color: "text-pastel-lavender-dark" },
              { label: "CO2 Saved", value: stats.co2Saved, color: "text-pastel-pink-dark" },
              { label: "Completed Rides", value: stats.completedRides, color: "text-pastel-peach-dark" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl md:text-5xl font-black ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-2 font-black uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800">
              Why choose RidePooling?
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              Everything you need for a stress-free, dreamy commute
            </p>
          </div>
 
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon={<ShieldCheck className="text-white" size={32} />}
              title="Verified Profiles"
              desc="We verify every user with multi-step identity checks to ensure your safety first."
              bgColor="bg-pastel-mint"
            />
            <FeatureCard
              icon={<Users className="text-white" size={32} />}
              title="Smart Matching"
              desc="Our AI finds the best route and companions based on your preferences and timing."
              bgColor="bg-pastel-lavender"
            />
            <FeatureCard
              icon={<Zap className="text-white" size={32} />}
              title="Instant Booking"
              desc="No back-and-forth messaging. Book your seat instantly and get on your way."
              bgColor="bg-pastel-peach"
            />
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/70 text-slate-600 py-16 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pastel-mint rounded-2xl flex items-center justify-center text-slate-800 shadow-lg">
                  <Car size={18} strokeWidth={3} />
                </div>
                <span className="font-black text-slate-800 text-xl tracking-tight">
                  RidePooling
                </span>
              </div>
              <p className="text-sm leading-relaxed font-medium italic text-slate-500">
                Making the world smaller and greener, one shared ride at a time.
                Join the dreamy community today.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-slate-800 font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span>Features</span>
                  </li>
                  <li>
                    <span>Mobile App</span>
                  </li>
                  <li>
                    <span>Safety</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-slate-800 font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span>About Us</span>
                  </li>
                  <li>
                    <span>Careers</span>
                  </li>
                  <li>
                    <span>Blog</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 RidePooling Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, bgColor }) {
  return (
    <div className="p-10 rounded-4xl bg-white border border-slate-200/70 hover:border-pastel-mint shadow-pastel-shadow hover:shadow-2xl transition-all group overflow-hidden relative">
      <div className={`w-20 h-20 rounded-3xl ${bgColor} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      
      {/* Decorative Pastel Blob */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 ${bgColor} opacity-10 rounded-full group-hover:scale-150 transition-transform`} />
    </div>
  );
}
