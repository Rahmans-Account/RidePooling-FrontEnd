import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, X } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Track submission
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format.";
    if (!form.password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the specific error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (validate()) {
      console.log("Registered successfully!", form);
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 backdrop-blur-xl">
      <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-10 w-[90%] max-w-lg relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 mt-4">
          <UserPlus className="text-gray-800 w-7 h-7" />
          <h2 className="text-3xl font-bold text-gray-800">Register</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4">
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border ${
                submitted && errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {submitted && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border ${
                submitted && errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {submitted && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border ${
                submitted && errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {submitted && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
