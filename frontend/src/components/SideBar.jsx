import React from "react";
import { LayoutDashboard, Car, Book, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/profile" },
    { name: "My Rides", icon: <Car size={18} />, path: "/my-rides" },
    { name: "Bookings", icon: <Book size={18} />, path: "/bookings" },
  ];

  return (
    <aside
      className="w-64 bg-white h-screen flex flex-col justify-between
                 border-r border-gray-200 rounded-r-3xl shadow-sm transition-all duration-300"
    >
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600">Ride Pooling</div>

        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 mx-3 mb-2 rounded-lg transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
