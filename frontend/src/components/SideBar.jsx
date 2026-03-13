import React from "react";
import {
  LayoutDashboard,
  Car,
  Book,
  LogOut,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "My Rides", icon: <Car size={20} />, path: "/my-rides" },
    { name: "User Bookings", icon: <Book size={20} />, path: "/bookings" },
    { name: "Rider Bookings", icon: <Book size={20} />, path: "/rider-bookings" },
    { name: "History of Rides", icon: <History size={20} />, path: "/history" },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/25 md:hidden"
          onClick={onClose}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/85 backdrop-blur-2xl flex flex-col border-r border-slate-200/70 shadow-pastel-shadow transform transition-transform duration-500 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Section */}
        <div className="p-8 md:p-10 flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender rounded-[1.25rem] flex items-center justify-center text-slate-800 shadow-lg shadow-pastel-lavender/20 group-hover:scale-110 transition-transform duration-500 border-2 border-white">
            <Car size={24} strokeWidth={3} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-800">
            Ride<span className="text-pastel-lavender-dark">Pool</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-2 md:mt-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${
                  isActive
                    ? "bg-pastel-lavender-light/80 border border-pastel-lavender text-slate-800 shadow-lg shadow-pastel-lavender/15 font-black"
                    : "text-slate-500 border border-transparent hover:bg-white hover:border-slate-200/70 hover:text-slate-900 hover:shadow-pastel-shadow"
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-slate-800"
                      : "text-slate-400 group-hover:text-pastel-lavender-dark"
                  } transition-colors`}
                >
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-pastel-mint-dark shadow-[0_0_8px_#DCD6F7]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t-2 border-dashed border-white/50">
          <button
            onClick={() => {
              localStorage.removeItem("jwtToken");
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-slate-200/80 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-pastel-pink-light/20 hover:text-pastel-pink-dark hover:border-pastel-pink-light/50 transition-all group shadow-sm hover:shadow-md"
          >
            <LogOut
              size={18}
              strokeWidth={3}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
