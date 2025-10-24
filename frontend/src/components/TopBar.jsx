import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b border-gray-200">
      {/* Left side (title or logo) */}
      <div className="text-xl font-semibold text-blue-600">
        Going My way? Let’s ride together
      </div>

      {/* Right side (user avatar and dropdown) */}
      <div className="relative">
        {/* Avatar */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
        >
          <img
            src="../../public/profile.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <Link
              to="/user-profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <User size={18} />
              User Profile
            </Link>

            <hr className="my-1" />

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
