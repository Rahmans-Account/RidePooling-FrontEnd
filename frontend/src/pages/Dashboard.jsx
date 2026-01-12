import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("John");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return; // remain with default when logged out
        const { data } = await api.get("/auth/me");
        const name = data?.data?.user?.name;
        if (name) setDisplayName(name);
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      }
    };
    fetchName();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-2">
          Welcome, {displayName}! 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Your ridepooling dashboard is ready.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-sm rounded-2xl p-5">
            <img
              src="/offer.png"
              alt="Offer a Ride"
              className="rounded-xl w-full h-50 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-1">Offer a Ride</h2>
            <p className="text-gray-500 mb-4">
              Share your commute and save money.
            </p>
            <button
              onClick={() => navigate("/offer-ride")}
              className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition"
            >
              Offer Now
            </button>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-5">
            <img
              src="/book.png"
              alt="Find a Ride"
              className="rounded-xl w-full h-50 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-1">Find a Ride</h2>
            <p className="text-gray-500 mb-4">
              Book a ride with a colleague or friend.
            </p>
            <button
              onClick={() => navigate("/find-ride")}
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
            >
              Find a Ride
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Your Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <p className="text-gray-500 mb-1">Rides Offered</p>
            <span className="text-4xl font-bold text-indigo-600">12</span>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <p className="text-gray-500 mb-1">Rides Booked</p>
            <span className="text-4xl font-bold text-blue-600">8</span>
          </div>
        </div>
      </main>
    </div>
  );
}
