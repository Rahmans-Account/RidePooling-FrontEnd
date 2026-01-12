import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft,
  ChevronRight 
} from "lucide-react";
import axios from "axios";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Full name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Must be at least 6 characters.";
    if (!form.phone) errs.phone = "Phone is required.";
    else if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Must be 10 digits.";
    if (!form.city) errs.city = "City is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5003/api/auth/register",
          form
        );
        const { token } = response.data.data;
        localStorage.setItem("jwtToken", token);
        navigate("/dashboard");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message ||
          "Registration failed. Email might already exist.";
        setServerError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-[Poppins] selection:bg-indigo-100">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <div className="p-2 rounded-full bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">Return Home</span>
      </button>

      {/* Registration Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-lg shadow-indigo-200 mb-4">
            <UserPlus size={26} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm">Join thousands of smart commuters today</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm animate-shake flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <InputField 
              label="Full Name" 
              icon={<User size={18}/>}
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* Email */}
            <InputField 
              label="Email Address" 
              icon={<Mail size={18}/>}
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Phone */}
            <InputField 
              label="Phone Number" 
              icon={<Phone size={18}/>}
              name="phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            {/* City */}
            <InputField 
              label="Current City" 
              icon={<MapPin size={18}/>}
              name="city"
              placeholder="New York"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
          </div>

          {/* Password - Full Width */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Secure Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-4 bg-slate-50/50 border ${
                  errors.password ? "border-red-300" : "border-slate-100"
                } rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Create Account
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  );
}

// Helper component for clean code
function InputField({ label, icon, error, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
        <input
          {...props}
          className={`w-full pl-11 pr-4 py-4 bg-slate-50/50 border ${
            error ? "border-red-300" : "border-slate-100"
          } rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
        />
      </div>
      {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{error}</p>}
    </div>
  );
}