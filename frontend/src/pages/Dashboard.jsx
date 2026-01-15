import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Car,
} from "lucide-react";
import authService from "../services/authService";
import rideService from "../services/rideService";
import bookingService from "../api/bookingService";
import { paymentService } from "../api/paymentService";
import { notify } from "../utils/notify";

export default function Dashboard() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Commuter");
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({ totalRides: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (!authService.isAuthenticated()) return;
        const user = authService.getCurrentUser();
        if (user?.name) {
          setDisplayName(user.name.split(" ")[0]);
        }
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      }
    };
    fetchName();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!authService.isAuthenticated()) return;
      
      const currentUser = authService.getCurrentUser();
      if (!currentUser?._id) return;
      
      setLoading(true);
      try {
        const [ridesRes, bookingsRes, paymentsRes] = await Promise.all([
          rideService.getMyRides(),
          bookingService.getMyBookings(),
          paymentService.getPaymentHistory("passenger"),
        ]);

        // Validate that rides belong to current user (driver)
        const userRides = (ridesRes?.data?.rides || []).filter(
          (ride) => ride.driver?._id === currentUser._id || ride.driver === currentUser._id
        );
        
        // Validate that bookings belong to current user (passenger)
        const userBookings = (bookingsRes?.data?.bookings || []).filter(
          (booking) => booking.driver?._id !== currentUser._id
        );

        setStats({ 
          totalRides: userRides.length, 
          totalBookings: userBookings.length 
        });

        const payments = paymentsRes?.data?.data || [];
        const normalized = payments.slice(0, 4).map((p) => {
          const start = p.ride?.startLocation?.address || "Ride";
          const end = p.ride?.endLocation?.address || "";
          const title = end ? `${start} → ${end}` : start;
          const amountValue = Number(p.amount || 0).toFixed(2);
          const amount = p.status === "completed" ? `-$${amountValue}` : `Pending`;
          const date = p.createdAt
            ? new Date(p.createdAt).toLocaleString()
            : "";
          return { title, date, amount, type: "book" };
        });
        setRecentActivities(normalized);
      } catch (err) {
        console.error("Dashboard data load failed", err);
        notify.error("Could not refresh dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Clean & Minimal */}
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Hey, {displayName}! 👋
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Ready for your next shared journey?
            </p>
          </div>
        </header>

        {/* Primary Action Cards - THE FOCUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Offer a Ride */}
          <div
            onClick={() => navigate("/offer-ride")}
            className="group relative overflow-hidden rounded-[3rem] bg-slate-900 h-[400px] cursor-pointer shadow-2xl transition-all hover:-translate-y-2"
          >
            <img
              src="https://images.unsplash.com/photo-1449960232330-79ba99d70d91?auto=format&fit=crop&q=80&w=800"
              alt="Offer"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 w-full">
              <h2 className="text-3xl font-black text-white mb-3">
                Offer a Ride
              </h2>
              <p className="text-slate-300 mb-6 max-w-xs font-medium">
                Earn while you drive and help reduce urban traffic.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                Offer Now <Plus size={20} />
              </div>
            </div>
          </div>

          {/* Find a Ride */}
          <div
            onClick={() => navigate("/find-ride")}
            className="group relative overflow-hidden rounded-[3rem] bg-indigo-600 h-[400px] cursor-pointer shadow-2xl transition-all hover:-translate-y-2"
          >
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
              alt="Find"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 w-full">
              <h2 className="text-3xl font-black text-white mb-3">
                Find a Ride
              </h2>
              <p className="text-indigo-100 mb-6 max-w-xs font-medium">
                Travel affordably with verified commuters heading your way.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors">
                Search Rides <Search size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Activity & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h3>
              <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Full History <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 && !loading && (
                <p className="text-slate-400 text-sm">No recent payments yet.</p>
              )}
              {recentActivities.map((item, idx) => (
                <ActivityItem
                  key={`${item.title}-${idx}`}
                  title={item.title}
                  date={item.date}
                  amount={item.amount}
                  type={item.type}
                />
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-center">
            <h3 className="text-indigo-900 font-bold text-lg mb-2">
              Did you know?
            </h3>
            <p className="text-indigo-700/70 text-sm leading-relaxed mb-6">
              Pooling just twice a week can save you over $1,200 annually in
              fuel and maintenance.
            </p>
            <button
              onClick={() => navigate("/user-profile")}
              className="text-indigo-600 font-black text-sm flex items-center gap-2"
            >
              Optimize Profile <ChevronRight size={16} />
            </button>
            <Zap className="absolute -bottom-6 -right-6 text-indigo-200/50 w-32 h-32 rotate-12" />
          </div>
        </div>

        {/* BOTTOM STATS - USER ACTIVITY */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Your Activity
              </p>
              <h4 className="text-lg font-bold text-slate-900">
                Ride Statistics
              </h4>
            </div>
          </div>

          <div className="flex gap-12">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Total Rides
              </p>
              <p className="text-2xl font-black text-indigo-600">{stats.totalRides}</p>
            </div>
            <div className="w-px h-10 bg-slate-100 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Total Bookings
              </p>
              <p className="text-2xl font-black text-emerald-600">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, date, amount, type }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            type === "offer"
              ? "bg-slate-900 text-white"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <MapPin size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-black ${
            type === "offer" ? "text-emerald-600" : "text-slate-900"
          }`}
        >
          {amount}
        </p>
        <p className="text-[10px] font-bold text-slate-300 uppercase">
          {type === "offer" ? "Earned" : "Paid"}
        </p>
      </div>
    </div>
  );
}
