import React from "react";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-2">Welcome, John! 👋</h1>
        <p className="text-gray-500 mb-8">
          Your ridepooling dashboard is ready.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-sm rounded-2xl p-5">
          <img
              src="../../public/offer.png"
              alt="Offer a Ride"
              className="rounded-xl w-full h-50 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-1">Offer a Ride</h2>
            <p className="text-gray-500 mb-4">
              Share your commute and save money.
            </p>
            <button
              onClick={() => navigate("/offer-ride")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition"
            >
              Offer Now
            </button>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-5">
          <img
              src="../../public/book.png"
              alt="Find a Ride"
              className="rounded-xl w-full h-50 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-1">Find a Ride</h2>
            <p className="text-gray-500 mb-4">
              Book a ride with a colleague or friend.
            </p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
              onClick={() => navigate("/find-ride")}
            >
              Find a Ride
            </button>
          </div>
        </div>

        {/* Summary Section */}
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
