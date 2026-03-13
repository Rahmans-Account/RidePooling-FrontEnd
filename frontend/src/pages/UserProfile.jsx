import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, Mail, Phone, MapPin, Shield, Edit2, Save, X, 
  User, CheckCircle, Camera, Calendar, ArrowLeft, Star, TrendingUp, ChevronRight, IndianRupee
} from "lucide-react";
import authService from "../services/authService";
import reviewService from "../api/reviewService";
import KYCUpload from "../components/KYCUpload";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [driverStats, setDriverStats] = useState(null);
  const [driverReviews, setDriverReviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    gender: "other",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!authService.isAuthenticated()) {
        navigate("/login");
        return;
      }
      const response = await authService.getProfile();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          city: userData.city || "",
          gender: userData.gender || "other",
        });

        // Fetch driver stats if user is a driver
        try {
          const statsRes = await reviewService.getDriverAverageRating(userData._id);
          setDriverStats(statsRes.data);

          const reviewsRes = await reviewService.getReviewsByDriver(userData._id);
          setDriverReviews(reviewsRes.data || []);
        } catch (err) {
          console.error("Failed to fetch driver stats:", err);
        }
      }
    } catch (err) {
      setError("Unable to sync profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        setUser(response.data.user);
        setSuccess("Profile settings updated!");
        setEditing(false);
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-pastel-lavender-dark mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Syncing your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 font-[Poppins] relative overflow-x-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-lavender-light/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pastel-mint-light/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-3 mb-10">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back to previous page"
            className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-all font-black text-[10px] uppercase tracking-widest group"
          >
            <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/70 group-hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Hub
          </button>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200/70 rounded-full shadow-sm text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <Shield size={14} className="text-pastel-lavender-dark" /> Security Level: <span className="text-pastel-mint-dark">Optimum</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 shadow-pastel-shadow border border-slate-200/70 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-lavender-light/20 rounded-full -mr-16 -mt-16 z-0 blur-2xl" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender rounded-[2rem] flex items-center justify-center text-slate-800 text-5xl font-black shadow-xl shadow-pastel-lavender/20 border-4 border-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <button type="button" aria-label="Change profile photo" className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg border border-pastel-lavender/10 text-pastel-lavender-dark hover:scale-110 transition-transform">
                    <Camera size={20} strokeWidth={3} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-2 opacity-60">
                  <MapPin size={12} className="text-pastel-mint-dark" /> {user?.city || "Unknown Realm"}
                </p>

                <div className="mt-10 w-full space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/50 border border-slate-200/70 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Calendar size={18} className="text-pastel-lavender-dark" /> Since
                    </div>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Jan 2026</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pastel-mint-light/20 to-pastel-mint-light/40 border border-slate-200/70 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] font-black text-pastel-mint-dark uppercase tracking-widest">
                      <CheckCircle size={18} /> Journeys
                    </div>
                    <span className="text-xl font-black text-slate-800">{user?.completedRides || 8}</span>
                  </div>

                  {user?.totalEarnings > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pastel-peach-light/20 to-pastel-peach-light/40 border border-slate-200/70 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-black text-pastel-peach-dark uppercase tracking-widest">
                        <IndianRupee size={18} /> Revenue
                      </div>
                      <span className="text-xl font-black text-slate-800">₹{user?.totalEarnings.toLocaleString()}</span>
                    </div>
                  )}

                  {driverStats && (
                    <>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pastel-lavender-light/20 to-pastel-lavender-light/40 border border-slate-200/70 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-[10px] font-black text-pastel-lavender-dark uppercase tracking-widest">
                          <Star size={18} className="fill-pastel-lavender-dark" /> Rating
                        </div>
                        <span className="text-xl font-black text-slate-800">{driverStats.averageRating || "5.0"}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/50 border border-slate-200/70 rounded-2xl shadow-inner">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Edit2 size={16} /> Feedback
                        </div>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{driverStats.totalReviews || 12} Reviews</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 shadow-pastel-shadow border border-slate-200/70 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-mint-light/10 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 relative z-10">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Identity Hub</h1>
                  <p className="text-slate-500 text-sm font-medium mt-1">Refine your personality in the pastel network</p>
                </div>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all active:scale-95 text-xs font-black uppercase tracking-widest group"
                  >
                    <Edit2 size={16} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> Edit Profile
                  </button>
                )}
              </div>

              {/* Status Messages */}
              {success && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
                  <CheckCircle size={18} /> {success}
                </div>
              )}

              <div className="space-y-8">
                {/* Email Section (Disabled) */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                    <Mail size={16} /> Official Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                      <Mail size={20} strokeWidth={3} />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      aria-label="Official email"
                      className="w-full pl-16 pr-6 py-5 bg-white/40 border border-white rounded-2xl text-slate-400 cursor-not-allowed font-bold shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Locked</p>
                    </div>
                  </div>
                </div>

                {/* Editable Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileInput 
                    label="Display Name" 
                    icon={<User size={18} />} 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    disabled={!editing} 
                  />
                  <ProfileInput 
                    label="Phone Number" 
                    icon={<Phone size={18} />} 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    disabled={!editing} 
                  />
                  <ProfileInput 
                    label="City" 
                    icon={<MapPin size={18} />} 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    disabled={!editing} 
                  />
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                      <Shield size={16} /> Gender
                    </label>
                    <div className="relative group">
                      <Shield className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${editing ? 'text-pastel-lavender-dark' : 'text-slate-300'}`} size={20} strokeWidth={3} />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full pl-16 pr-6 py-5 border rounded-2xl outline-none appearance-none transition-all font-black text-sm uppercase tracking-widest ${
                          editing ? "bg-white border-white focus:ring-4 focus:ring-pastel-lavender-light/50 shadow-md" : "bg-white/40 border-white text-slate-500 shadow-inner"
                        }`}
                      >
                        <option value="male">Mars (Male)</option>
                        <option value="female">Venus (Female)</option>
                        <option value="other">Universal (Other)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
                {editing && <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 relative z-10">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="w-full sm:w-auto px-10 py-5 border-2 border-slate-200/70 bg-white/60 backdrop-blur-md text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-3"
                  >
                    <X size={18} strokeWidth={3} /> Abort Edits
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:flex-1 py-5 bg-gradient-to-r from-pastel-lavender-dark to-pastel-lavender text-slate-800 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-pastel-lavender/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group border-2 border-white"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />}
                    {saving ? "Synchronizing..." : "Authorize Update"}
                  </button>
                </div>}
            </div>

            {/* Driver Reviews Section */}
            {driverReviews.length > 0 && (
              <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-pastel-shadow border border-slate-200/70 relative overflow-hidden group">
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-pastel-peach-light/10 rounded-full blur-3xl z-0" />
                
                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-10 flex items-center gap-3 relative z-10">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-white">
                    <Star className="text-pastel-peach-dark fill-pastel-peach-dark" size={20} />
                  </div>
                  Passenger Chronicles
                </h3>
                
                <div className="space-y-6 relative z-10">
                  {driverReviews.slice(0, 5).map((review) => (
                    <div key={review._id} className="p-6 bg-white/40 border-2 border-white rounded-[2rem] hover:shadow-md transition-all group/review">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pastel-mint-light/30 rounded-full flex items-center justify-center text-pastel-mint-dark font-black text-xs border border-white shadow-sm">
                            {review.reviewer?.name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm tracking-tight">{review.reviewer?.name || "Global Traveler"}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 px-3 py-1.5 bg-white/80 rounded-full border border-white shadow-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={`${
                                i < review.rating
                                  ? "fill-pastel-peach-dark text-pastel-peach-dark"
                                  : "text-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-pastel-lavender pl-4 ml-1">{review.comment}</p>
                      )}
                      {review.ride && (
                        <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                          <MapPin size={10} /> {review.ride.origin} <ChevronRight size={8} /> {review.ride.destination}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <KYCUpload user={user} onUploaded={fetchProfile} />
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, icon, disabled, ...props }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative group/input">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within/input:text-pastel-lavender-dark'}`}>
          {React.cloneElement(icon, { size: 18, strokeWidth: 3 })}
        </div>
        <input
          {...props}
          disabled={disabled}
          className={`w-full pl-16 pr-6 py-5 border-2 rounded-[2rem] outline-none transition-all font-black text-sm tracking-tight ${
            disabled 
              ? "bg-white/40 border-white text-slate-400 cursor-not-allowed shadow-inner" 
              : "bg-white border-white focus:border-pastel-lavender focus:ring-4 focus:ring-pastel-lavender-light/30 shadow-md"
          }`}
        />
        {!disabled && (
           <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
              <CheckCircle size={16} className="text-pastel-mint-dark" />
           </div>
        )}
      </div>
    </div>
  );
}