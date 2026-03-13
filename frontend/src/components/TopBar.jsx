import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, Menu } from "lucide-react";
import api from "../api/client";

export default function TopBar({ onToggleSidebar }) {
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
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-3 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-200/60">
      {/* Left side: Greeting & Search */}
      <div className="flex items-center gap-3 md:gap-12">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-pastel-lavender-light/50"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-[10px] font-black text-pastel-lavender-dark uppercase tracking-[0.3em] mb-1">
            {getGreeting()}
          </h1>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            {user ? `${user.name.split(" ")[0]}! ✨` : "Welcome back!"}
          </p>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        {/* Notifications */}
        <button
          onClick={() => navigate("/payment-history")}
          className="relative p-2.5 text-slate-500 hover:bg-pastel-mint-light/50 hover:text-pastel-mint-dark rounded-[1.25rem] transition-all hover:shadow-pastel-shadow"
          title="Payment History"
        >
          <span className="text-xl">💳</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/user-profile")}
          className="p-2.5 text-slate-500 hover:bg-pastel-lavender-light/50 hover:text-pastel-lavender-dark rounded-[1.25rem] transition-all hover:shadow-pastel-shadow"
        >
          <Settings size={20} strokeWidth={2.5} />
        </button>

        <div className="h-8 w-[2px] bg-slate-100/50 mx-1 md:mx-2 rounded-full"></div>

        {/* Profile Quick Link */}
        <Link
          to="/user-profile"
          className="flex items-center gap-3 p-1.5 pl-4 rounded-3xl hover:bg-white transition-all border-2 border-transparent hover:border-slate-200/70 hover:shadow-pastel-shadow group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-none tracking-tight">
              {user?.name || "User"}
            </p>
            <div className="text-[9px] font-black text-pastel-lavender-dark uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
              <span className="w-1 h-1 bg-pastel-mint-dark rounded-full animate-pulse" />
              <span>Verified</span>
            </div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender flex items-center justify-center text-slate-800 font-black shadow-lg shadow-pastel-lavender/20 group-hover:scale-105 transition-transform duration-500 text-lg border-2 border-white">
            {user?.name?.charAt(0) || <User size={20} />}
          </div>
        </Link>
      </div>
    </header>
  );
}
