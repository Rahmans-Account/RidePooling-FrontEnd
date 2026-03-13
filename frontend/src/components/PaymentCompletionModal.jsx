import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Smartphone, Zap, Shield, Clock } from 'lucide-react';
import { paymentService } from '../api/paymentService';

export default function PaymentCompletionModal({ isOpen, ride, totalAmount, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [info, setInfo] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [paymentType, setPaymentType] = useState('pg'); // 'pg' or 'upi'

  const loadCashfreeScript = () => new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';
    script.onload = () => resolve(window.Cashfree);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      console.log('🚀 Starting payment for ride:', ride._id);
      
      // Step 1: Create payment session
      setInfo('Creating payment session...');
      const response = await paymentService.createCashfreeOrder(ride._id);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create session');
      }

      const { paymentSessionId, environment, amount } = response.data.data;

      if (!paymentSessionId) {
        throw new Error('No payment session received from server');
      }

      console.log('✅ Session created:', paymentSessionId);

      // Step 2: Load Cashfree SDK
      setInfo('Loading payment gateway...');
      await loadCashfreeScript();
      
      if (!window.Cashfree) {
        throw new Error('Failed to load Cashfree SDK');
      }

      // Step 3: Initialize Cashfree
      const mode = environment === 'production' || environment === 'live' ? 'production' : 'sandbox';
      console.log('🔧 Mode:', mode);
      
      const cf = new window.Cashfree({ mode });

      // Step 4: Open checkout
      setInfo('Opening payment options...');
      console.log('🎟️ Opening checkout...');

      await cf.checkout({
        paymentSessionId,
        redirectTarget: '_blank',
      });

      setInfo('Confirming payment...');
      
    } catch (err) {
      console.error('❌ Error:', err);
      const msg = 
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        'Payment failed. Please try again.';
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpiIntentLaunch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await paymentService.getUpiIntent(ride._id);
      if (response.data.success) {
        setUpiLink(response.data.data.upiLink);
        // Launch the UPI Intent!
        window.open(response.data.data.upiLink, '_self');
        setInfo('UPI App opened. Please complete the payment and return here.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate UPI link');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    let timer;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setError('Payment session expired. Please restart the process.');
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen || !ride) return null;

  return (
    <div className='fixed inset-0 bg-pastel-cream/40 backdrop-blur-xl flex items-center justify-center z-[100] p-4 font-[Poppins]'>
      <div className='glass-morphism rounded-[3rem] shadow-pastel-shadow max-w-md w-full mx-auto overflow-hidden animate-in fade-in scale-95 duration-500 border-white'>
        {/* Header with gradient */}
        <div className='bg-gradient-to-r from-pastel-lavender-dark via-pastel-lavender to-pastel-mint px-8 py-10 flex items-center justify-between text-slate-800 relative'>
          <div className='absolute top-0 left-0 w-full h-1 bg-white/20' />
          <div className='flex items-center gap-4'>
            <div className='bg-white/40 p-3 rounded-2xl backdrop-blur-md shadow-inner border border-white'>
              <Smartphone size={28} className="text-pastel-lavender-dark" />
            </div>
            <div>
              <h2 className='text-2xl font-black tracking-tight'>Payment</h2>
              <p className='text-slate-600 text-xs font-black uppercase tracking-widest mt-1 opacity-70'>Secure Pastel Link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className='p-2 hover:bg-white/40 rounded-full transition-all disabled:opacity-50'
          >
            <X size={26} />
          </button>
        </div>

        {/* Body */}
        {!success ? (
          <form onSubmit={handlePayment} className='p-6 space-y-6'>
            {/* Amount Display */}
            <div className='text-center py-10 bg-white/40 rounded-4xl border border-white shadow-inner relative overflow-hidden group'>
              <div className="absolute inset-0 bg-gradient-to-br from-pastel-lavender-light/20 to-pastel-mint-light/20 opacity-50" />
              <p className='text-slate-500 text-xs font-black uppercase tracking-widest mb-3 relative z-10'>Total Amount Due</p>
              <p className='text-5xl font-black text-slate-800 relative z-10 tracking-tighter'>₹{totalAmount}</p>
              <div className='flex items-center justify-center gap-2 mt-4 relative z-10'>
                <div className="w-1.5 h-1.5 rounded-full bg-pastel-pink animate-ping" />
                <p className='text-xs font-black text-pastel-pink-dark uppercase tracking-widest'>Expires {formatCountdown(countdown)}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className='flex bg-white/50 p-1.5 rounded-2xl border border-white shadow-sm'>
              <button 
                type="button"
                onClick={() => setPaymentType('pg')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${paymentType === 'pg' ? 'bg-white text-pastel-lavender-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Cards / Bank
              </button>
              <button 
                type="button"
                onClick={() => setPaymentType('upi')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${paymentType === 'upi' ? 'bg-white text-pastel-mint-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Direct UPI App
              </button>
            </div>

            {/* Ride Summary */}
            <div className='space-y-4 p-6 bg-white/40 rounded-3xl border border-white'>
              <h3 className='font-black text-slate-800 text-xs uppercase tracking-[0.2em] flex items-center gap-2'>
                <Shield size={16} className='text-pastel-lavender-dark' /> Trip Summary
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-500 font-bold'>Runner</span>
                  <span className='font-black text-slate-800'>{ride.driver?.name || 'Unknown'}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-500 font-bold'>Route</span>
                  <span className='font-black text-slate-800 text-right line-clamp-1'>
                    {ride.startLocation?.address?.split(',')[0]} → {ride.endLocation?.address?.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Pills */}
            <div className='flex flex-col gap-3'>
              <div className='p-4 bg-pastel-mint-light/40 border-2 border-white rounded-2xl flex gap-3 shadow-sm'>
                <CheckCircle size={20} className='text-pastel-mint-dark flex-shrink-0' />
                <p className='text-xs font-black text-slate-800 uppercase tracking-tight leading-[1.4]'>Ride Completed! confirm payment to close the trip.</p>
              </div>
              <div className='p-4 bg-pastel-lavender-light/40 border-2 border-white rounded-2xl flex gap-3 shadow-sm'>
                <Zap size={20} className='text-pastel-lavender-dark flex-shrink-0' />
                <p className='text-xs font-bold text-slate-700 leading-relaxed'>Tap "Secure Checkout" to open our pastel-powered payment gateway.</p>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
                <AlertCircle size={20} className='text-red-600 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm font-bold text-red-900'>Payment Failed</p>
                  <p className='text-xs text-red-700 mt-1'>{error}</p>
                </div>
              </div>
            )}

            {/* Loading / Info State */}
            {loading && (
              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3'>
                <div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-blue-600'></div>
                <p className='text-sm font-semibold text-blue-700'>Processing your payment...</p>
              </div>
            )}
            {info && !loading && (
              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800'>
                {info}
              </div>
            )}

            {/* Submit Button */}
            {paymentType === 'pg' ? (
              <button
                type='submit'
                disabled={loading || countdown <= 0}
                className='w-full bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender hover:scale-105 disabled:grayscale disabled:opacity-50 text-slate-800 font-black py-5 px-6 rounded-3xl transition-all shadow-lg shadow-pastel-lavender/30 flex items-center justify-center gap-3 transform active:scale-95'
              >
                {loading ? (
                  <div className='animate-spin rounded-full h-6 w-6 border-4 border-slate-800 border-t-transparent'></div>
                ) : (
                  <>
                    <Shield size={22} strokeWidth={3} />
                    Secure Checkout
                  </>
                )}
              </button>
            ) : (
              <button
                type='button'
                onClick={handleUpiIntentLaunch}
                disabled={loading || countdown <= 0}
                className='w-full bg-gradient-to-br from-pastel-mint-dark to-pastel-mint hover:scale-105 disabled:grayscale disabled:opacity-50 text-slate-800 font-black py-6 px-6 rounded-3xl transition-all shadow-lg shadow-pastel-mint/30 flex flex-col items-center justify-center gap-1 transform active:scale-95'
              >
                <div className="flex items-center gap-3 text-lg">
                  <Smartphone size={24} strokeWidth={3} />
                  <span>Open UPI App</span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Smarter Instant Pay</span>
              </button>
            )}

            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='w-full mt-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 font-semibold py-2 px-4 rounded-xl transition duration-200'
            >
              Cancel
            </button>

              <p className='text-xs text-slate-500 text-center mt-3'>
                ✓ Secure payment via Cashfree UPI Checkout (Sandbox)
              </p>
          </form>
        ) : (
          /* Success State */
          <div className='p-10 text-center space-y-6'>
            <div className='flex justify-center'>
              <div className='bg-pastel-mint-light/50 p-6 rounded-full border-4 border-white shadow-pastel-shadow animate-bounce'>
                <CheckCircle size={64} className='text-pastel-mint-dark' strokeWidth={3} />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='text-3xl font-black text-slate-800 tracking-tight'>Payment Success! 🎉</h3>
              <p className='text-slate-500 font-bold'>Your dreamy journey is officially complete.</p>
            </div>
            <div className='bg-white/40 border-2 border-white rounded-3xl p-6 space-y-2 shadow-inner'>
              <p className='text-[10px] text-slate-400 uppercase tracking-widest font-black'>Transaction ID</p>
              <p className='font-mono text-sm font-black text-slate-700'>{transactionId || 'PASTEL-TXN-SUCCESS'}</p>
            </div>
            <button
              onClick={onClose}
              className='w-full mt-8 bg-slate-800 hover:bg-slate-900 text-white font-black py-4 px-6 rounded-3xl transition-all shadow-xl shadow-slate-200 transform hover:-translate-y-1'
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
