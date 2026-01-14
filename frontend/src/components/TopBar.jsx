import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Bell, Search, Settings } from "lucide-react";
import api from "../api/client";

export default function TopBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };
    fetchUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Left side: Greeting & Search */}
      <div className="flex items-center gap-12">
        <div className="hidden lg:block">
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
            {getGreeting()}
          </h1>
          <p className="text-xl font-black text-slate-900">
            {user ? `${user.name.split(" ")[0]}! 👋` : "Welcome back!"}
          </p>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button 
          onClick={() => navigate("/payment-history")}
          className="relative p-2.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
          title="Payment History"
        >
          💳
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/user-profile")}
          className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
        >
          <Settings size={20} />
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

        {/* Profile Quick Link */}
        <Link
          to="/user-profile"
          className="flex items-center gap-3 p-1.5 pl-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter mt-1">
              Verified Rider
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
            {user?.name?.charAt(0) || <User size={18} />}
          </div>
        </Link>
      </div>
    </header>
  );
}
