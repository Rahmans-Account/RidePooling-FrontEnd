import React from "react";
import { LayoutDashboard, Car, Book, LogOut, ShieldCheck, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/profile" },
    { name: "My Rides", icon: <Car size={20} />, path: "/my-rides" },
    { name: "Bookings", icon: <Book size={20} />, path: "/bookings" },
  ];

  return (
    <aside className="w-72 bg-white h-screen flex flex-col border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      {/* Brand Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <Car size={22} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          RidePooling
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"} transition-colors`}>
                {item.icon}
              </span>
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Pro Feature or Status */}
      <div className="px-6 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden group cursor-pointer">
          <Zap className="absolute -right-2 -top-2 text-white/10 w-16 h-16 group-hover:rotate-12 transition-transform" />
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Status</p>
          <p className="text-sm font-medium">Verified Commuter</p>
          <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
            <ShieldCheck size={12} className="text-emerald-400" /> Identity Confirmed
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-slate-50">
        <button
          onClick={() => {
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout Account
        </button>
      </div>
    </aside>
  );
}