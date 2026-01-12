/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import api from "../api/client";

const genderAvatar = {
  male: { emoji: "🚹", bg: "bg-blue-100", text: "text-blue-700" },
  female: { emoji: "🚺", bg: "bg-pink-100", text: "text-pink-700" },
  other: { emoji: "✨", bg: "bg-purple-100", text: "text-purple-700" },
};

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const avatar = useMemo(() => {
    const key = (user?.gender || "other").toLowerCase();
    return genderAvatar[key] || genderAvatar.other;
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
      } catch (err) {
        // ignore header fetch errors
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b border-gray-200">
      <div className="text-xl font-semibold text-blue-600">
        Going My way? Let’s ride together
      </div>

      <div className="relative flex items-center gap-4">
        <Link
          to="/user-profile"
          className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
        >
          Profile
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${avatar.bg} ${avatar.text}`}
          >
            {avatar.emoji}
          </div>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <User size={18} />
              Profile
            </Link>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
