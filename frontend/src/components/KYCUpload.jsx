import React, { useState } from 'react';
import { Upload, ShieldCheck, FileImage, Loader2, Info, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

const fieldConfig = [
  { key: 'licensePhoto', label: 'Driving license' },
  { key: 'idPhoto', label: 'Government identity' },
  { key: 'vehiclePhoto', label: 'Vessel visual' },
  { key: 'platePhoto', label: 'Identity plate' },
];

export default function KYCUpload({ user, onUploaded }) {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event, key) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (Object.keys(files).length === 0) {
      setError('Log entry invalid: At least one archive is required.');
      return;
    }

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    try {
      setUploading(true);
      const response = await authService.uploadKYC(formData);
      if (response.success) {
        setMessage('Archives received. Verification link pending synchronization.');
        setFiles({});
        if (onUploaded) onUploaded();
      } else {
        setError(response.message || 'Transmission failed.');
      }
    } catch (uploadError) {
      setError(uploadError.message || 'Synapse failure during upload.');
    } finally {
      setUploading(false);
    }
  };

  const currentStatus = (user?.kycStatus || 'pending').toLowerCase();

  return (
    <div className="glass-morphism rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 border-white shadow-pastel-shadow mt-12 relative overflow-hidden group">
      {/* Background Bloom */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pastel-lavender-light/10 rounded-full blur-[80px] -z-10 group-hover:bg-pastel-lavender-light/20 transition-all duration-1000" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-pastel-lavender-light rounded-[1.5rem] shadow-sm border border-white">
             <ShieldCheck size={28} className="text-pastel-lavender-dark" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Identity Shield</h3>
              <div className="flex items-center gap-2 mt-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'verified' ? 'bg-pastel-mint-dark' : 'bg-pastel-peach-dark'} animate-pulse`} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-4">Document Verification Matrix</p>
              </div>
           </div>
        </div>
        
        <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border-4 border-white ${
          currentStatus === 'verified'
            ? 'bg-pastel-mint text-slate-800'
            : currentStatus === 'rejected'
            ? 'bg-pastel-pink text-white'
            : 'bg-white text-slate-400'
        }`}>
          {currentStatus}
        </span>
      </div>

      {user?.kycRejectionReason && (
        <div className="mb-10 p-6 rounded-3xl bg-pastel-pink/20 text-red-800 text-xs font-bold border-2 border-white flex items-center gap-4 animate-shake">
           <AlertCircle size={20} className="shrink-0" />
           <p className="tracking-tight uppercase tracking-widest leading-relaxed">Matrix Rejection: {user.kycRejectionReason}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fieldConfig.map((field) => (
            <label key={field.key} className="block group/field">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block translate-x-1">{field.label}</span>
              <div className="relative overflow-hidden bg-white/40 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 hover:border-pastel-lavender hover:bg-white hover:shadow-lg transition-all cursor-pointer group-hover/field:scale-[1.02] active:scale-95">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm border border-white text-slate-400 group-hover/field:text-pastel-lavender-dark transition-colors ${files[field.key] ? 'text-pastel-mint-dark' : ''}`}>
                    {files[field.key] ? <CheckCircle size={24} /> : <FileImage size={24} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800 line-clamp-1 pr-2">
                        {files[field.key]?.name || 'Select Source Archive'}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supports high-res visual assets</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, field.key)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </label>
          ))}
        </div>

        {/* Global info disclosure */}
        <div className="p-6 bg-white/60 rounded-[2rem] border-2 border-white flex items-center gap-4 text-slate-400">
           <Info size={20} className="shrink-0 text-pastel-lavender-dark" />
           <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Archives are encrypted via quantum-grade protocols and stored in off-matrix vaults.</p>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 flex flex-col items-center md:items-start">
                 {message && <div className="flex items-center gap-2 text-pastel-mint-dark text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2"><CheckCircle size={14} /> {message}</div>}
                 {error && <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2"><AlertCircle size={14} /> {error}</div>}
            </div>

            <button
            type="submit"
            disabled={uploading}
            className="w-full md:w-auto px-12 py-5 bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 group/submit"
            >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} strokeWidth={2.5} className="group-hover/submit:translate-y-[-2px] transition-transform" />}
            {uploading ? 'Processing Archives...' : 'Broadcast KYC Matrix'}
            </button>
        </div>
      </form>
    </div>
  );
}
