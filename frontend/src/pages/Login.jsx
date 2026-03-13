import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import authService from "../services/authService";
import { notify } from "../utils/notify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) errs.password = "Password is required.";
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
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login(form.email, form.password);
      if (response.success) {
        notify.loginSuccess();
        navigate("/dashboard");
      } else {
        const errorMessage = response.message || "Invalid email or password. Please try again.";
        setServerError(errorMessage);
        notify.loginError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || "Invalid email or password. Please try again.";
      setServerError(errorMessage);
      notify.loginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col justify-center items-center p-4 md:p-6 font-[Poppins] selection:bg-pastel-mint-light selection:text-pastel-mint-dark overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] md:w-[40%] h-[40%] bg-pastel-mint-light/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] md:w-[40%] h-[40%] bg-pastel-lavender-light/60 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors duration-200"
      >
        <div className="p-2 rounded-full bg-white/70 shadow-sm group-hover:shadow-md border border-slate-200/70 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-bold">Back to Home</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-4xl md:rounded-[3rem] shadow-pastel-shadow border border-slate-200/70 p-5 sm:p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pastel-mint to-pastel-lavender" />
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pastel-mint rounded-2xl text-slate-800 shadow-lg shadow-pastel-mint/20 mb-6 border border-white/80">
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your details to sign in</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-shake">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pastel-mint-dark transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-4 bg-white/50 border ${
                  errors.email ? "border-red-300 focus:ring-red-100 text-red-900" : "border-slate-200/70 focus:ring-pastel-mint-light"
                } rounded-2xl outline-none focus:bg-white focus:ring-4 focus:border-pastel-mint transition-all text-slate-800 placeholder:text-slate-400`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
              <button type="button" className="text-xs font-bold text-pastel-lavender-dark hover:text-pastel-lavender transition">Forgot?</button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pastel-lavender-dark transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-4 bg-white/50 border ${
                  errors.password ? "border-red-300 focus:ring-red-100 text-red-900" : "border-slate-200/70 focus:ring-pastel-lavender-light"
                } rounded-2xl outline-none focus:bg-white focus:ring-4 focus:border-pastel-lavender transition-all text-slate-800 placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-5 bg-gradient-to-r from-pastel-mint to-pastel-mint-dark text-slate-800 font-black rounded-3xl shadow-lg shadow-pastel-mint/30 hover:shadow-pastel-mint/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:-translate-y-1"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New to the platform?{" "}
            <Link
              to="/register"
              className="text-pastel-mint-dark hover:text-pastel-mint font-black ml-1 transition"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Small Legal Text */}
      <p className="mt-6 md:mt-8 text-slate-400 text-xs text-center px-3">
        By signing in, you agree to our Terms of Service & Privacy Policy.
      </p>

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