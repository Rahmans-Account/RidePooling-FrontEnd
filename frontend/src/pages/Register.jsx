import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, X } from "lucide-react";
import axios from "axios"; // Import Axios

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (!form.phone) errs.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Phone number must be 10 digits.";
    if (!form.city) errs.city = "City is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    if (validate()) {
      setLoading(true);
      try {
        // Send POST request to register endpoint
        const response = await axios.post(
          "http://localhost:5003/api/auth/register",
          {
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            city: form.city,
          }
        );

        // Backend returns { success: true, data: { token, user: { _id, name, email, phone, city, ... } } }
        const { token } = response.data.data;

        // Store JWT in localStorage
        localStorage.setItem("jwtToken", token);

        // Navigate to profile on success
        navigate("/profile");
      } catch (err) {
        // Handle server-side errors
        const errorMessage =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setServerError(errorMessage);
      } finally {
        setLoading(false);
      }
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

          {/* Phone Field */}
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number (10 digits)"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border ${
                submitted && errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {submitted && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* City Field */}
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className={`w-full border ${
                submitted && errors.city ? "border-red-500" : "border-gray-300"
              } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {submitted && errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
