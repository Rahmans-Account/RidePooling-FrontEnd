import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
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
        // ignore header fetch errors
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b border-gray-200">
      <div className="text-xl font-semibold text-blue-600">
        Going My way? Let’s ride together
      </div>

      <div className="relative flex items-center gap-4">
        <Link 
          to="/user-profile" 
          className="focus:outline-none hover:opacity-80 transition"
          title="View Profile"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 cursor-pointer">
            <User size={20} />
          </div>
        </Link>
      </div>
    </header>
  );
}
