import React from "react";
import { Link } from "react-router-dom";
import { Car, Search, ShieldCheck, Users, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-[Poppins] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <Car size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              RidePooling
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition">Pricing</a>
            <a href="#" className="hover:text-indigo-600 transition">Safety</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 transition">
              Log in
            </Link>
            <Link to="/register" className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <Zap size={14} />
            The Future of Urban Travel
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Smart Ridepooling for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
              Smarter Commutes.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Reduce your carbon footprint and your travel costs. Connect with verified 
            professionals heading your way in a seamless, secure environment.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all">
              Find a Ride <Search size={18} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold border-2 border-slate-100 flex items-center justify-center gap-2 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
              Offer a Ride <ArrowRight size={18} />
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <div className="rounded-[2.5rem] overflow-hidden border-[8px] border-slate-50 shadow-2xl mx-auto max-w-4xl">
              <img
                src="https://i.pinimg.com/1200x/9e/1e/7c/9e1e7c7983352dc78b81a3dd53fc4013.jpg"
                alt="Local search optimization abstract"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-slate-50 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50k+" },
              { label: "Cities", value: "120+" },
              { label: "CO2 Saved", value: "2.5M kg" },
              { label: "Rides Daily", value: "15k+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why choose RidePooling?</h2>
            <p className="text-slate-500 mt-4">Everything you need for a stress-free commute</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Verified Profiles"
              desc="We verify every user with multi-step identity checks to ensure your safety first."
            />
            <FeatureCard 
              icon={<Users className="text-indigo-500" />}
              title="Smart Matching"
              desc="Our AI finds the best route and companions based on your preferences and timing."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="Instant Booking"
              desc="No back-and-forth messaging. Book your seat instantly and get on your way."
            />
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
               <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <Car size={18} />
                </div>
                <span className="font-bold text-white text-xl">RidePooling</span>
              </div>
              <p className="text-sm leading-relaxed">
                Making the world smaller and greener, one shared ride at a time. Join the community today.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Mobile App</a></li>
                  <li><a href="#" className="hover:text-white transition">Safety</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 RidePooling Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}