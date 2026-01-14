import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, loading, error } = useUserProfile();
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const errs = {};
    
    if (!formData.currentPassword) {
      errs.currentPassword = "Current password is required";
    }
    
    if (!formData.newPassword) {
      errs.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      errs.newPassword = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    
    if (formData.currentPassword === formData.newPassword) {
      errs.newPassword = "New password must be different from current password";
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const success = await changePassword(
      formData.currentPassword,
      formData.newPassword
    );
    
    if (success) {
      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-[Poppins]">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Shield size={14} className="text-indigo-500" /> Security
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 rounded-2xl">
                <Lock className="text-red-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Change Password
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
              <CheckCircle size={18} /> {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1">
                Current Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl outline-none transition-all font-medium ${
                    errors.currentPassword
                      ? "bg-red-50 border-red-200 focus:ring-4 focus:ring-red-50"
                      : "bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 border-2"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-xs font-medium">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min. 6 characters)"
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl outline-none transition-all font-medium ${
                    errors.newPassword
                      ? "bg-red-50 border-red-200 focus:ring-4 focus:ring-red-50"
                      : "bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 border-2"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-xs font-medium">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl outline-none transition-all font-medium ${
                    errors.confirmPassword
                      ? "bg-red-50 border-red-200 focus:ring-4 focus:ring-red-50"
                      : "bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 border-2"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Requirements */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Password Requirements
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-slate-300'}`} />
                At least 6 characters
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'bg-green-500' : 'bg-slate-300'}`} />
                Passwords match
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${formData.newPassword && formData.newPassword !== formData.currentPassword ? 'bg-green-500' : 'bg-slate-300'}`} />
                Different from current password
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
