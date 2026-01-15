import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Smartphone, Zap, Shield } from 'lucide-react';
import { paymentService } from '../api/paymentService';

export default function PaymentCompletionModal({ isOpen, ride, totalAmount, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // Step 1: Create payment record with UPI method (platform-collected)
      const paymentRes = await paymentService.createPayment(
        ride._id,
        totalAmount,
        'upi'
      );

      const paymentId = paymentRes.data.data._id;
      const generatedTransactionId = paymentRes.data.data.transactionId;

      // Step 2: Simulate UPI payment gateway redirect
      // In production, open Razorpay Checkout with UPI-only and orderId
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: Confirm payment after gateway/webhook verification
      const confirmRes = await paymentService.confirmPayment(
        paymentId,
        generatedTransactionId
      );

      setTransactionId(generatedTransactionId);
      setSuccess(true);

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess(confirmRes.data.data);
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Payment processing failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ride) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden animate-in fade-in scale-95 duration-300'>
        {/* Header with gradient */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 flex items-center justify-between text-white'>
          <div className='flex items-center gap-3'>
            <div className='bg-white/20 p-2 rounded-xl backdrop-blur-sm'>
              <Smartphone size={24} />
            </div>
            <div>
              <h2 className='text-xl font-bold'>Complete Payment</h2>
              <p className='text-blue-100 text-xs mt-1'>Secure UPI Transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className='text-white/60 hover:text-white disabled:opacity-50 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        {!success ? (
          <form onSubmit={handlePayment} className='p-6 space-y-6'>
            {/* Amount Display */}
            <div className='text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100'>
              <p className='text-slate-600 text-sm mb-2'>Total Amount Due</p>
              <p className='text-4xl font-black text-blue-600'>₹{totalAmount}</p>
              <p className='text-xs text-slate-500 mt-2'>Platform-collected via UPI</p>
            </div>

            {/* Ride Summary */}
            <div className='space-y-3 p-4 bg-slate-50 rounded-2xl'>
              <h3 className='font-bold text-slate-900 text-sm mb-3 flex items-center gap-2'>
                <Shield size={16} className='text-blue-600' /> Ride Details
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Driver</span>
                  <span className='font-semibold text-slate-900'>{ride.driver?.name || 'Unknown'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Route</span>
                  <span className='font-semibold text-slate-900 text-right line-clamp-1'>
                    {ride.startLocation?.address?.split(',')[0]} → {ride.endLocation?.address?.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Notice */}
            <div className='p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3'>
              <CheckCircle size={20} className='text-green-600 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-sm font-bold text-green-900'>Ride Completed ✓</p>
                <p className='text-xs text-green-700'>Both driver & passenger confirmed completion</p>
              </div>
            </div>

            {/* Info Note */}
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3'>
              <Zap size={20} className='text-blue-600 flex-shrink-0 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-sm font-bold text-blue-900'>Quick Payment</p>
                <p className='text-xs text-blue-700 mt-1'>Tap "Pay Now" to open UPI payment gateway. You'll receive a confirmation after successful payment.</p>
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

            {/* Loading State */}
            {loading && (
              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3'>
                <div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-blue-600'></div>
                <p className='text-sm font-semibold text-blue-700'>Processing your payment...</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone size={18} />
                  Pay ₹{totalAmount} via UPI
                </>
              )}
            </button>

            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='w-full mt-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 font-semibold py-2 px-4 rounded-xl transition duration-200'
            >
              Cancel
            </button>

            <p className='text-xs text-slate-500 text-center mt-3'>
              ✓ Secure payment via RazorPay UPI Gateway
            </p>
          </form>
        ) : (
          /* Success State */
          <div className='p-8 text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='bg-green-100 p-4 rounded-full animate-bounce'>
                <CheckCircle size={56} className='text-green-600' />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='text-2xl font-black text-slate-900'>Payment Successful! 🎉</h3>
              <p className='text-slate-600'>Your payment has been confirmed.</p>
            </div>
            <div className='bg-green-50 border border-green-200 rounded-xl p-4 space-y-2'>
              <p className='text-xs text-slate-500 uppercase tracking-widest font-bold'>Transaction ID</p>
              <p className='font-mono text-sm font-bold text-green-700'>{transactionId}</p>
            </div>
            <div className='space-y-1 text-sm text-slate-600'>
              <p>✓ Driver earnings credited to wallet</p>
              <p>✓ Ride marked as completed</p>
            </div>
            <button
              onClick={onClose}
              className='w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200'
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
