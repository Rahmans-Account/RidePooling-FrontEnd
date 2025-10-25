import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, X } from "lucide-react";
import axios from "axios"; // Import Axios

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // New state for server-side errors
  const [submitted, setSubmitted] = useState(false); // track if form was submitted
  const [loading, setLoading] = useState(false); // Optional: to show loading state
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
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
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on typing
    setServerError(""); // Clear server error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // mark that user submitted
    setServerError(""); // Clear previous server errors
    if (validate()) {
      setLoading(true); // Start loading
      try {
        // Send POST request to your backend login API using Axios
        const response = await axios.post(
          "http://localhost:5003/api/auth/login",
          {
            // Replace with your actual backend URL and endpoint
            email: form.email,
            password: form.password,
          }
        );

        // Assuming the backend returns { token: "jwt-token-here" } in response.data
        const { token } = response.data.data;
        console.log("login successful, token:", token);
        // Store the JWT in localStorage (or use cookies for more security)
        localStorage.setItem("jwtToken", token);

        // Navigate to Dashboard on success
        navigate("/profile");
      } catch (err) {
        // Set server error message
        // Axios errors have err.response, so we can get the message from there
        const errorMessage =
          err.response?.data?.error?.message ||
          "Login failed. Please check your credentials.";
        setServerError(errorMessage);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 backdrop-blur-xl">
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
          <LogIn className="text-gray-800 w-7 h-7" />
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4">
          <div>
            <input
              type="email" // Changed to type="email" for better built-in validation
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

          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
