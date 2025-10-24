import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    gender: "Male",
    city: "Hyderabad",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("✅ Changes saved successfully (simulated)!");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-2">User Profile</h1>
        <p className="text-gray-500 mb-8">
          Update your personal details below.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
          <img
              src="../../public/profile.png"
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-600"
            />
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition"
            >
              Go Back
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
