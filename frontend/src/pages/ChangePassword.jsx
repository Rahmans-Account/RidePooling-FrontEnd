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
  Key
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
      errs.currentPassword = "Current cipher fragment required";
    }
    
    if (!formData.newPassword) {
      errs.newPassword = "New cipher fragment required";
    } else if (formData.newPassword.length < 6) {
      errs.newPassword = "Cipher must be 6+ characters";
    }
    
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Verify new fragment";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = "Mismatch in cipher sync";
    }
    
    if (formData.currentPassword === formData.newPassword) {
      errs.newPassword = "New cipher must be unique from current";
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
      setSuccess("Cipher sync complete. Matrix updated.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/profile");
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 font-[Poppins] relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pastel-lavender-light/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-mint-light/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-3 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-xl border-2 border-white text-slate-800 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white hover:scale-105 transition-all group active:scale-95"
          >
            <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> 
            Identity Hub
          </button>
          <div className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-white rounded-full shadow-lg text-[9px] font-black text-pastel-lavender-dark uppercase tracking-[0.2em]">
            <Shield size={16} strokeWidth={3} /> Protocol X-Security
          </div>
        </div>

        {/* Change Password Card */}
        <div className="glass-morphism rounded-[3.5rem] p-8 md:p-14 shadow-pastel-shadow border-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-lavender-light/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000" />
           
          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-pastel-lavender-light rounded-[1.75rem] shadow-sm border border-white">
                <Key className="text-pastel-lavender-dark" size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                  Recalibrate Cipher
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic">
                  "A rotated key is an impenetrable shield."
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {success && (
            <div className="mb-10 p-6 bg-pastel-mint/30 border-2 border-white text-pastel-mint-dark rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm animate-in zoom-in-95 duration-300">
               <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-pastel-mint/20 shadow-sm">
                  <CheckCircle size={18} strokeWidth={3} />
               </div>
               {success}
            </div>
          )}

          {error && (
            <div className="mb-10 p-6 bg-pastel-pink/30 border-2 border-white text-red-800 rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm animate-in zoom-in-95 duration-300">
               <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-pastel-pink/20 shadow-sm">
                  <AlertCircle size={18} strokeWidth={3} />
               </div>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Current Password */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                Existing Encryption Key
              </label>
              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-pastel-lavender-light/20 rounded-xl transition-colors group-focus-within/input:bg-pastel-lavender-light/50">
                    <Lock className="text-slate-400 group-focus-within/input:text-pastel-lavender-dark transition-colors" size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Input current cipher..."
                  className={`w-full pl-16 pr-14 py-6 border-2 rounded-[2rem] outline-none transition-all font-medium text-sm shadow-sm ${
                    errors.currentPassword
                      ? "bg-pastel-pink/10 border-pastel-pink focus:ring-4 focus:ring-pastel-pink/20"
                      : "bg-white border-white focus:border-pastel-lavender focus:ring-4 focus:ring-pastel-lavender-light/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-all hover:scale-110 active:scale-95"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-700 text-[10px] font-black uppercase tracking-widest ml-4">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                New Cipher Generation
              </label>
              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-pastel-mint-light/20 rounded-xl transition-colors group-focus-within/input:bg-pastel-mint-light/50">
                    <Lock className="text-slate-400 group-focus-within/input:text-pastel-mint-dark transition-colors" size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Generate new cipher..."
                  className={`w-full pl-16 pr-14 py-6 border-2 rounded-[2rem] outline-none transition-all font-medium text-sm shadow-sm ${
                    errors.newPassword
                      ? "bg-pastel-pink/10 border-pastel-pink focus:ring-4 focus:ring-pastel-pink/20"
                      : "bg-white border-white focus:border-pastel-mint focus:ring-4 focus:ring-pastel-mint-light/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-all hover:scale-110 active:scale-95"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-700 text-[10px] font-black uppercase tracking-widest ml-4">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                Synchronize Verification
              </label>
              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-pastel-lavender-light/20 rounded-xl transition-colors group-focus-within/input:bg-pastel-lavender-light/50">
                    <Lock className="text-slate-400 group-focus-within/input:text-pastel-lavender-dark transition-colors" size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Verify synchronized cipher..."
                  className={`w-full pl-16 pr-14 py-6 border-2 rounded-[2rem] outline-none transition-all font-medium text-sm shadow-sm ${
                    errors.confirmPassword
                      ? "bg-pastel-pink/10 border-pastel-pink focus:ring-4 focus:ring-pastel-pink/20"
                      : "bg-white border-white focus:border-pastel-lavender focus:ring-4 focus:ring-pastel-lavender-light/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-all hover:scale-110 active:scale-95"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-700 text-[10px] font-black uppercase tracking-widest ml-4">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-10 py-6 bg-slate-800 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-900 shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pastel-lavender to-pastel-mint opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Syncing matrix...
                  </>
                ) : (
                  <>
                    <Lock size={20} strokeWidth={2.5} className="group-hover/btn:rotate-12 transition-transform" />
                    Commit New Cipher
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Requirements Matrix */}
          <div className="mt-14 pt-10 border-t border-white shadow-inner rounded-b-[3.5rem] -mx-14 bg-white/40 p-14">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 text-center">
              Encryption Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Requirement node={formData.newPassword.length >= 6} label="6+ Fragments" />
              <Requirement node={formData.newPassword === formData.confirmPassword && formData.confirmPassword} label="Sync Verified" />
              <Requirement node={formData.newPassword && formData.newPassword !== formData.currentPassword} label="Unique Vector" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Requirement({ node, label }) {
  return (
    <div className={`p-4 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all ${node ? 'bg-pastel-mint-light/20 border-pastel-mint text-pastel-mint-dark' : 'bg-white border-white text-slate-400 opacity-60'}`}>
       {node ? <CheckCircle size={14} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
       <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
  );
}
