import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, Mail, Phone, MapPin, Shield, Edit2, Save, X, 
  User, CheckCircle, AlertCircle, Camera, Calendar, ArrowLeft, Star, TrendingUp, Zap
} from "lucide-react";
import authService from "../services/authService";
import reviewService from "../api/reviewService";

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Syncing your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-[Poppins]">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Shield size={14} className="text-indigo-500" /> Account Security: High
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-100">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-50 text-indigo-600 hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-extrabold text-slate-900">{user?.name}</h2>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {user?.city || "Location not set"}
                </p>

                <div className="mt-8 w-full space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <Calendar size={18} className="text-indigo-500" /> Member Since
                    </div>
                    <span className="text-xs font-bold text-slate-400">Jan 2026</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 text-sm font-semibold text-blue-800">
                      <CheckCircle size={18} className="text-blue-500" /> Completed Rides
                    </div>
                    <span className="text-lg font-bold text-blue-600">{user?.completedRides || 0}</span>
                  </div>

                  {user?.totalEarnings > 0 && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-3 text-sm font-semibold text-green-800">
                        <TrendingUp size={18} className="text-green-500" /> Total Earnings
                      </div>
                      <span className="text-lg font-bold text-green-600">₹{user?.totalEarnings.toLocaleString()}</span>
                    </div>
                  )}

                  {driverStats && (
                    <>
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="flex items-center gap-3 text-sm font-semibold text-amber-800">
                          <Star size={18} className="text-amber-500 fill-amber-500" /> Average Rating
                        </div>
                        <span className="text-lg font-bold text-amber-600">{driverStats.averageRating || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="flex items-center gap-3 text-sm font-semibold text-indigo-800">
                          <Shield size={18} className="text-indigo-500" /> Reviews
                        </div>
                        <span className="text-lg font-bold text-indigo-600">{driverStats.totalReviews || 0}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                  <p className="text-slate-500 text-sm mt-1">Update your account information and preferences</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm font-bold"
                  >
                    <Edit2 size={16} /> Edit
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
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-lg">Locked</span>
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
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1">Gender</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none appearance-none transition-all font-medium ${
                          editing ? "bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-50 border-2" : "bg-slate-50 border-slate-100 text-slate-500"
                        }`}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex items-center gap-4 mt-12 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Driver Reviews Section */}
            {driverReviews.length > 0 && (
              <div className="mt-8 bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
                <h3 className="text-xl font-black text-slate-900 mb-6">Recent Passenger Reviews</h3>
                <div className="space-y-4">
                  {driverReviews.slice(0, 5).map((review) => (
                    <div key={review._id} className="p-4 border border-slate-100 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{review.reviewer?.name || "Anonymous"}</p>
                          <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 mt-2">{review.comment}</p>
                      )}
                      {review.ride && (
                        <p className="text-xs text-slate-400 mt-2">
                          Route: {review.ride.origin} → {review.ride.destination}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, icon, disabled, ...props }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-indigo-600'}`}>
          {icon}
        </div>
        <input
          {...props}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all font-medium ${
            disabled 
              ? "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed" 
              : "bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 border-2"
          }`}
        />
      </div>
    </div>
  );
}