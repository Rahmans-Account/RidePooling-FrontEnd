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
        const [ridesResult, bookingsResult, paymentsResult] = await Promise.allSettled([
          rideService.getMyRides(),
          bookingService.getMyBookings(),
          paymentService.getPaymentHistory("passenger"),
        ]);

        const ridesRes = ridesResult.status === "fulfilled" ? ridesResult.value : null;
        const bookingsRes = bookingsResult.status === "fulfilled" ? bookingsResult.value : null;
        const paymentsRes = paymentsResult.status === "fulfilled" ? paymentsResult.value : null;

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
          const amount = p.status === "completed" ? `-₹${amountValue}` : `Pending`;
          const date = p.createdAt
            ? new Date(p.createdAt).toLocaleString()
            : "";
          return { title, date, amount, type: "book" };
        });
        setRecentActivities(normalized);

        if (ridesResult.status === "rejected" || bookingsResult.status === "rejected") {
          notify.error("Could not fully refresh dashboard stats");
        }

        if (paymentsResult.status === "rejected") {
          setRecentActivities([]);
        }
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
    <div className="min-h-screen bg-pastel-cream p-4 md:p-6 lg:p-10 font-[Poppins] selection:bg-pastel-mint-light selection:text-pastel-mint-dark">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Hey, {displayName}! 👋
            </h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">
              Ready for your next dreamy shared journey?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/70 border border-slate-200/70 flex items-center justify-center text-pastel-mint-dark shadow-sm">
              <Zap size={24} fill="currentColor" />
            </div>
          </div>
        </header>

        {/* Primary Action Cards - THE FOCUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-12">
          {/* Offer a Ride */}
          <div
            onClick={() => navigate("/offer-ride")}
            className="group relative overflow-hidden rounded-4xl md:rounded-[3.5rem] bg-gradient-to-br from-pastel-mint-dark to-pastel-mint h-[340px] md:h-[420px] cursor-pointer shadow-pastel-shadow hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-slate-100"
          >
            <img
              src="https://images.unsplash.com/photo-1449960232330-79ba99d70d91?auto=format&fit=crop&q=80&w=800"
              alt="Offer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pastel-mint-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Offer a Ride
              </h2>
              <p className="text-slate-700 mb-8 max-w-xs font-bold text-sm leading-relaxed">
                Earn while you drive and help reduce urban traffic waste.
              </p>
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-2xl font-black shadow-lg shadow-black/5 group-hover:bg-slate-800 group-hover:text-white transition-all">
                Offer Now <Plus size={22} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Find a Ride */}
          <div
            onClick={() => navigate("/find-ride")}
            className="group relative overflow-hidden rounded-4xl md:rounded-[3.5rem] bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender h-[340px] md:h-[420px] cursor-pointer shadow-pastel-shadow hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-slate-100"
          >
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
              alt="Find"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pastel-lavender-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Find a Ride
              </h2>
              <p className="text-slate-700 mb-8 max-w-xs font-bold text-sm leading-relaxed">
                Travel affordably with verified commuters heading your way.
              </p>
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-2xl font-black shadow-lg shadow-black/5 group-hover:bg-slate-800 group-hover:text-white transition-all">
                Search Rides <Search size={22} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Activity & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8 mb-12">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-4xl p-6 md:p-10 border border-slate-200/70 shadow-pastel-shadow">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-800">
                Recent Activity
              </h3>
              <button className="text-pastel-mint-dark font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Full History <ArrowUpRight size={18} />
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

          <div className="bg-pastel-lavender-light rounded-4xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-center border border-slate-200/70">
            <h3 className="text-pastel-lavender-dark font-black text-xl mb-3">
              Did you know?
            </h3>
            <p className="text-slate-600/80 text-sm font-bold leading-relaxed mb-8">
              Pooling just twice a week can save you over <span className="text-pastel-lavender-dark">₹10,000</span> annually in
              fuel and maintenance.
            </p>
            <button
              onClick={() => navigate("/user-profile")}
              className="text-pastel-lavender-dark font-black text-sm flex items-center gap-2 group"
            >
              Optimize Profile <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Zap className="absolute -bottom-8 -right-8 text-pastel-lavender w-36 h-36 rotate-12 opacity-20" />
          </div>
        </div>

        {/* BOTTOM STATS - USER ACTIVITY */}
        <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 md:p-8 border border-slate-200/70 shadow-pastel-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-pastel-pink-light text-pastel-pink-dark rounded-3xl flex items-center justify-center shadow-sm">
              <Car size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Your Impact
              </p>
              <h4 className="text-xl font-black text-slate-800">
                Eco Statistics
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 md:gap-16">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Rides
              </p>
              <p className="text-3xl font-black text-pastel-mint-dark">{stats.totalRides}</p>
            </div>
            <div className="w-px h-12 bg-slate-200 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Bookings
              </p>
              <p className="text-3xl font-black text-pastel-lavender-dark">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto px-10 py-4 bg-white text-slate-700 rounded-2xl text-sm font-black shadow-sm hover:shadow-md hover:bg-slate-50 transition-all border border-slate-200/70">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, date, amount, type }) {
  const isOffer = type === "offer";
  const bgColor = isOffer ? "bg-pastel-mint-light" : "bg-pastel-lavender-light";
  const iconColor = isOffer ? "text-pastel-mint-dark" : "text-pastel-lavender-dark";

  return (
    <div className="flex items-center justify-between p-5 rounded-3xl hover:bg-white/50 transition-all border border-transparent hover:border-slate-200/70 shadow-none hover:shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} ${iconColor} shadow-inner`}>
          <MapPin size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-base font-black ${isOffer ? "text-pastel-mint-dark" : "text-slate-800"
            }`}
        >
          {amount}
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {isOffer ? "Earned" : "Paid"}
        </p>
      </div>
    </div>
  );
}
