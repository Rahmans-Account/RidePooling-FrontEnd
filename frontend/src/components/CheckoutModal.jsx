import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, MapPin, Users, IndianRupee, Clock, Shield, Smartphone, TrendingUp, Navigation, Loader2 } from 'lucide-react';
import bookingService from '../api/bookingService';

export default function CheckoutModal({ isOpen, ride, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const seatsToBook = ride?.seatsBooked || 1;
  const pricePerSeat = ride?.pricePerSeat || 0;
  const totalAmount = seatsToBook * pricePerSeat;

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bookingService.bookRide(ride._id, seatsToBook);
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Quantum mismatch during booking sync.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ride) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-500'>
      <div className='bg-pastel-cream rounded-[3.5rem] shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-in zoom-in duration-300 border-4 border-white relative'>
        
        {/* Animated Background Bloom */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pastel-lavender-light/30 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-pastel-mint-light/20 rounded-full blur-[60px] -z-10" />

        {!success ? (
          <div className="relative">
            {/* Header Section */}
            <div className='px-10 py-12 relative overflow-hidden'>
              <div className='relative z-10'>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-white shadow-sm">
                        <Navigation size={20} className="text-pastel-lavender-dark" />
                    </div>
                     <h2 className='text-3xl font-black text-slate-800 tracking-tight'>Confirm expedition</h2>
                </div>
                <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2'>
                  <Shield size={14} className="text-pastel-mint-dark" strokeWidth={3} /> Protocol X-Security Active
                </p>
              </div>
              
              <button
                onClick={onClose}
                disabled={loading}
                className='absolute top-8 right-8 text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-all p-3 bg-white/60 rounded-2xl shadow-sm border border-white hover:scale-110 active:scale-95'
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleBooking} className='px-10 pb-12 space-y-8'>
              
              {/* Route Blueprint */}
              <div className='bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-white shadow-sm space-y-8'>
                <div className='space-y-6'>
                  <div className='flex gap-5'>
                    <div className='flex flex-col items-center pt-2'>
                      <div className='w-2.5 h-2.5 bg-slate-800 rounded-full'></div>
                      <div className='w-[1.5px] flex-1 bg-gradient-to-b from-slate-200 to-pastel-lavender/50 my-1 rounded-full'></div>
                    </div>
                    <div className='flex-1'>
                      <p className='text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1'>Origin Terminal</p>
                      <p className='font-black text-slate-800 text-sm leading-snug truncate max-w-[200px]'>{ride.startLocation?.address || 'Terminal A'}</p>
                    </div>
                  </div>
                  
                  <div className='flex gap-5'>
                    <div className='flex flex-col items-center'>
                      <MapPin size={24} className='text-pastel-lavender-dark' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1'>Dropoff Objective</p>
                      <p className='font-black text-slate-800 text-sm leading-snug truncate max-w-[200px]'>{ride.endLocation?.address || 'Terminal B'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Consumption Grid */}
              <div className='grid grid-cols-3 gap-6'>
                <div className='bg-white/60 border-2 border-white rounded-[2rem] p-5 text-center shadow-sm'>
                  <Users className='w-4 h-4 text-pastel-lavender-dark mx-auto mb-2' />
                  <p className='text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2'>Capacity</p>
                  <p className='text-xl font-black text-slate-800 tracking-tighter'>{seatsToBook}</p>
                </div>
                <div className='bg-white/60 border-2 border-white rounded-[2rem] p-5 text-center shadow-sm'>
                   <IndianRupee className='w-4 h-4 text-pastel-peach-dark mx-auto mb-2' />
                  <p className='text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2'>Rate</p>
                  <p className='text-xl font-black text-slate-800 tracking-tighter'>₹{pricePerSeat}</p>
                </div>
                <div className='bg-white/60 border-2 border-white rounded-[2rem] p-5 text-center shadow-sm'>
                  <TrendingUp className='w-4 h-4 text-pastel-mint-dark mx-auto mb-2' />
                  <p className='text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2'>Total</p>
                  <p className='text-xl font-black text-slate-800 tracking-tighter'>₹{totalAmount}</p>
                </div>
              </div>

              {/* Economic Disclosure */}
              <div className='bg-gradient-to-r from-pastel-lavender-light/30 to-pastel-mint-light/30 rounded-[2rem] p-6 border-2 border-white flex items-start gap-4 shadow-inner'>
                   <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-white shrink-0 shadow-sm">
                        <IndianRupee size={18} className="text-pastel-lavender-dark" />
                   </div>
                  <div>
                    <p className='font-black text-slate-800 text-xs uppercase tracking-widest'>Deferred Settlement</p>
                    <p className='text-[10px] text-slate-500 font-medium mt-1 leading-relaxed italic'>Pay the operator ₹{totalAmount} via direct quantum link (UPI) post-arrival.</p>
                  </div>
              </div>

              {/* Error Protocol */}
              {error && (
                <div className='p-5 bg-pastel-pink/30 border border-pastel-pink rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2'>
                  <AlertCircle size={20} className='text-red-700 flex-shrink-0' />
                  <p className='text-[10px] font-black text-red-900 uppercase tracking-widest leading-relaxed'>{error}</p>
                </div>
              )}

              {/* Action Matrix */}
              <div className='space-y-4 pt-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] py-6 px-10 rounded-[2.5rem] hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 group/btn overflow-hidden relative'
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10 group-hover:h-full transition-all duration-700" />
                  {loading ? (
                    <Loader2 size={18} className='animate-spin relative z-10' />
                  ) : (
                    <>
                      <CheckCircle size={18} strokeWidth={3} className="relative z-10" />
                      <span className="relative z-10">Sync Reservation • ₹{totalAmount}</span>
                    </>
                  )}
                </button>
                <button
                  type='button'
                  onClick={onClose}
                  disabled={loading}
                  className='w-full bg-white text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] py-4 px-10 rounded-[2rem] border border-white hover:bg-slate-50 hover:text-slate-600 transition-all'
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Quantum Success State */
          <div className='p-12 text-center min-h-[500px] flex flex-col items-center justify-center relative bg-gradient-to-b from-white to-pastel-cream'>
            
             <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden">
                <div className="w-[80%] h-[80%] bg-pastel-mint-light/40 rounded-full blur-[100px] animate-pulse" />
             </div>

            <div className='relative z-10 space-y-8 max-w-sm'>
              <div className='w-24 h-24 bg-white p-6 rounded-[2rem] inline-block shadow-2xl border-4 border-pastel-mint-light animate-bounce'>
                <CheckCircle size={48} className='text-pastel-mint-dark' strokeWidth={3} />
              </div>
              
              <div>
                <h3 className='text-4xl font-black text-slate-800 tracking-tighter mb-2'>Expedition Logged</h3>
                <p className='text-pastel-mint-dark text-[10px] font-black uppercase tracking-[0.4em]'>Synchronization Absolute</p>
              </div>
              
              <div className='bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 space-y-4 border-2 border-white shadow-xl'>
                 <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-pastel-mint/10">
                    <span>Node ID</span>
                    <span className="text-slate-800">#BK{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                 </div>
                 <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Rate Link</span>
                    <span className="text-slate-800">₹{totalAmount}</span>
                 </div>
              </div>

              <div className='text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse mt-8 flex items-center justify-center gap-3'>
                 <div className="w-1.5 h-1.5 bg-pastel-lavender rounded-full animate-ping" />
                 Redirection to command hub...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
