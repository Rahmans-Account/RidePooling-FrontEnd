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
import authService from "../services/authService";
import { notify } from "../utils/notify";

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

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
        const response = await authService.register(form);
        if (response.success) {
          notify.registerSuccess();
          navigate("/login");
        }
      } catch (err) {
        const errorMessage =
          err.message ||
          "Registration failed. Email might already exist.";
        setServerError(errorMessage);
        notify.registerError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col justify-center items-center p-4 md:p-6 font-[Poppins] selection:bg-pastel-mint-light selection:text-pastel-mint-dark overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] md:w-[40%] h-[40%] bg-pastel-mint-light/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] md:w-[40%] h-[40%] bg-pastel-lavender-light/60 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <div className="p-2 rounded-full bg-white/70 shadow-sm border border-slate-200/70 group-hover:shadow-md transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-bold tracking-tight">Return Home</span>
      </button>

      {/* Registration Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-4xl md:rounded-[3rem] shadow-pastel-shadow border border-slate-200/70 p-5 sm:p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pastel-mint via-pastel-lavender to-pastel-pink" />
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pastel-lavender rounded-3xl text-slate-800 shadow-lg shadow-pastel-lavender/20 mb-6 border border-white/80">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Join thousands of smart commuters today</p>
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
                  errors.password ? "border-red-300 text-red-900" : "border-slate-200/70"
                } rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-pastel-lavender-light focus:border-pastel-lavender transition-all text-slate-800 placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-pastel-lavender-dark transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-5 bg-gradient-to-r from-pastel-mint via-pastel-mint-dark to-pastel-lavender text-slate-800 font-black rounded-3xl shadow-lg shadow-pastel-mint/30 hover:shadow-pastel-mint/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group transform hover:-translate-y-1"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Create Account
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pastel-mint-dark hover:text-pastel-mint font-black ml-1 transition"
            >
              Sign in here
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
  const isEmail = props.type === 'email';
  const isPhone = props.name === 'phone';
  const focusColor = isEmail ? 'focus:ring-pastel-lavender-light' : isPhone ? 'focus:ring-pastel-peach-light' : 'focus:ring-pastel-mint-light';
  const iconColor = isEmail ? 'group-focus-within:text-pastel-lavender-dark' : isPhone ? 'group-focus-within:text-pastel-peach-dark' : 'group-focus-within:text-pastel-mint-dark';

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 ${iconColor} transition-colors`}>
          {icon}
        </div>
        <input
          {...props}
          className={`w-full pl-11 pr-4 py-4 bg-white/50 border ${
            error ? "border-red-300 text-red-900" : "border-slate-200/70"
          } rounded-2xl outline-none focus:bg-white focus:ring-4 ${focusColor} transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium`}
        />
      </div>
      {error && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1 leading-none">{error}</p>}
    </div>
  );
}