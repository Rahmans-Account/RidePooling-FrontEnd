import React from "react";
import { Link } from "react-router-dom";
import { Car, Search, ShieldCheck, Users, ArrowRight, Zap } from "lucide-react";

export default function Home() {
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

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-gradient-to-r from-pastel-mint to-pastel-mint-dark text-slate-800 font-black flex items-center justify-center gap-2 hover:shadow-3xl hover:shadow-pastel-mint/40 transition-all transform hover:-translate-y-1"
            >
              Find a Ride <Search size={20} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-white/80 text-slate-700 font-bold border-2 border-slate-200/70 flex items-center justify-center gap-2 hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg shadow-black/5"
            >
              Offer a Ride <ArrowRight size={20} />
            </Link>
          </div>

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
              { label: "Active Users", value: "50k+", color: "text-pastel-mint-dark" },
              { label: "Cities", value: "120+", color: "text-pastel-lavender-dark" },
              { label: "CO2 Saved", value: "2.5M kg", color: "text-pastel-pink-dark" },
              { label: "Rides Daily", value: "15k+", color: "text-pastel-peach-dark" },
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
