import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function ProfileInput({ label, icon, disabled, ...props }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative group/input">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within/input:text-pastel-lavender-dark'}`}>
          {icon}
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
      </div>
    </div>
  );
}
