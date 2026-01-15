import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, MapPin, Users, IndianRupee, Clock, Shield, Smartphone, TrendingUp } from 'lucide-react';
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
      // Book the ride without payment
      await bookingService.bookRide(ride._id, seatsToBook);
      
      setSuccess(true);

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Booking failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ride) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden animate-in scale-95 duration-300'>
        
        {!success ? (
          <>
            {/* Header with gradient background */}
            <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-8 relative overflow-hidden'>
              {/* Animated background elements */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-pulse' style={{animationDelay: '0.5s'}}></div>
              
              <div className='relative z-10'>
                <h2 className='text-3xl font-black text-white tracking-tight'>Confirm Your Ride</h2>
                <p className='text-blue-100 text-sm mt-2 flex items-center gap-1'>
                  <Shield size={14} /> Secure booking with easy cancellation
                </p>
              </div>
              
              <button
                onClick={onClose}
                disabled={loading}
                className='absolute top-4 right-4 text-white/60 hover:text-white disabled:opacity-50 transition-colors p-2 hover:bg-white/10 rounded-xl'
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleBooking} className='p-8 space-y-6'>
              
              {/* Route Card with Map Visual */}
              <div className='bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100'>
                <h3 className='font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest text-slate-600'>Your Journey</h3>
                <div className='space-y-3'>
                  {/* From */}
                  <div className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div className='w-4 h-4 bg-green-500 rounded-full ring-4 ring-green-100'></div>
                      <div className='w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 my-1'></div>
                    </div>
                    <div className='flex-1 pt-1'>
                      <p className='text-xs font-bold text-slate-500 uppercase tracking-wide mb-1'>Pickup</p>
                      <p className='font-semibold text-slate-900 text-sm line-clamp-2'>{ride.startLocation?.address || 'Start Location'}</p>
                    </div>
                  </div>
                  
                  {/* To */}
                  <div className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div className='w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100'></div>
                    </div>
                    <div className='flex-1 pt-1'>
                      <p className='text-xs font-bold text-slate-500 uppercase tracking-wide mb-1'>Dropoff</p>
                      <p className='font-semibold text-slate-900 text-sm line-clamp-2'>{ride.endLocation?.address || 'End Location'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ride Details Grid */}
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-blue-50 rounded-xl p-4 text-center border border-blue-100'>
                  <Users className='w-5 h-5 text-blue-600 mx-auto mb-2' />
                  <p className='text-xs text-slate-600 font-semibold uppercase mb-1'>Seats</p>
                  <p className='text-2xl font-black text-blue-600'>{seatsToBook}</p>
                </div>
                <div className='bg-amber-50 rounded-xl p-4 text-center border border-amber-100'>
                  <IndianRupee className='w-5 h-5 text-amber-600 mx-auto mb-2' />
                  <p className='text-xs text-slate-600 font-semibold uppercase mb-1'>Per Seat</p>
                  <p className='text-2xl font-black text-amber-600'>₹{pricePerSeat}</p>
                </div>
                <div className='bg-green-50 rounded-xl p-4 text-center border border-green-100'>
                  <TrendingUp className='w-5 h-5 text-green-600 mx-auto mb-2' />
                  <p className='text-xs text-slate-600 font-semibold uppercase mb-1'>Total</p>
                  <p className='text-2xl font-black text-green-600'>₹{totalAmount}</p>
                </div>
              </div>

              {/* Payment Info Card */}
              <div className='bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200 space-y-3'>
                <div className='flex items-start gap-3'>
                  <Smartphone className='w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='font-bold text-indigo-900 text-sm'>Pay After Ride</p>
                    <p className='text-xs text-indigo-700 mt-1'>You'll pay the driver ₹{totalAmount} via UPI after both of you confirm the ride is completed. No upfront payment required!</p>
                  </div>
                </div>
              </div>

              {/* Safety Info */}
              <div className='bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3'>
                <Shield className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-bold text-emerald-900 text-xs uppercase tracking-widest'>Safe & Secure</p>
                  <p className='text-xs text-emerald-700 mt-1'>Share your ride with verified drivers. Cancel anytime before driver accepts.</p>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className='p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-shake'>
                  <AlertCircle size={20} className='text-red-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm font-bold text-red-900'>Booking Failed</p>
                    <p className='text-xs text-red-700 mt-1'>{error}</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className='p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3'>
                  <div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-blue-600'></div>
                  <p className='text-sm font-semibold text-blue-700'>Confirming your booking...</p>
                </div>
              )}

              {/* Buttons */}
              <div className='space-y-3 pt-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-200'
                >
                  {loading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Confirm Booking for ₹{totalAmount}
                    </>
                  )}
                </button>
                <button
                  type='button'
                  onClick={onClose}
                  disabled={loading}
                  className='w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 font-semibold py-3 px-6 rounded-xl transition duration-200'
                >
                  Cancel
                </button>
              </div>

              <p className='text-xs text-slate-500 text-center'>
                By confirming, you agree to our Terms of Service and cancellation policy
              </p>
            </form>
          </>
        ) : (
          /* Success State - Immersive Celebration */
          <div className='bg-gradient-to-b from-green-50 to-emerald-50 p-8 text-center space-y-4 min-h-96 flex flex-col items-center justify-center relative overflow-hidden'>
            
            {/* Confetti animation background */}
            <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className='absolute bg-green-400 rounded-full animate-bounce'
                  style={{
                    width: Math.random() * 8 + 2 + 'px',
                    height: Math.random() * 8 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: -10 + 'px',
                    animationDelay: Math.random() * 0.5 + 's',
                    animation: `float-down ${Math.random() * 3 + 2}s linear infinite`,
                  }}
                />
              ))}
            </div>

            <div className='relative z-10'>
              <div className='bg-green-100 p-6 rounded-full inline-block mb-6 animate-bounce'>
                <CheckCircle size={72} className='text-green-600' />
              </div>
              
              <h3 className='text-3xl font-black text-green-900 mb-2'>Ride Booked! 🎉</h3>
              
              <p className='text-green-700 font-semibold mb-4'>Your ride has been confirmed</p>
              
              <div className='bg-white rounded-2xl p-6 space-y-3 mb-6 border-2 border-green-200 shadow-lg'>
                <div className='text-left space-y-3'>
                  <div className='flex items-center gap-3 text-sm'>
                    <CheckCircle size={18} className='text-green-600' />
                    <span className='text-slate-700'>Booking ID: <span className='font-bold'>#BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <IndianRupee size={18} className='text-green-600' />
                    <span className='text-slate-700'>Pay on completion: <span className='font-bold'>₹{totalAmount}</span></span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <MapPin size={18} className='text-green-600' />
                    <span className='text-slate-700'>Trip ready for pickup</span>
                  </div>
                </div>
              </div>

              <p className='text-sm text-green-700 mb-6 leading-relaxed'>
                Check your bookings page to see driver details and track your ride in real-time
              </p>

              <div className='text-xs text-green-600 font-semibold animate-pulse'>
                ✓ Redirecting to your bookings in a moment...
              </div>
            </div>

            <style>{`
              @keyframes float-down {
                to {
                  transform: translateY(400px);
                  opacity: 0;
                }
              }
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
