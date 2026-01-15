import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { paymentService } from '../api/paymentService';

export default function PaymentCompletionModal({ isOpen, ride, totalAmount, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!upiId.trim()) {
      setError('Please enter your UPI ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create payment record with UPI method
      const paymentRes = await paymentService.createPayment(
        ride._id,
        totalAmount,
        'upi'
      );

      const paymentId = paymentRes.data.data._id;
      const generatedTransactionId = paymentRes.data.data.transactionId;

      // Step 2: Simulate UPI payment processing
      // In production, integrate with Razorpay UPI or similar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: Confirm payment
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
            <Smartphone size={24} className='text-blue-600' />
            Pay via UPI
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        {!success ? (
          <form onSubmit={handlePayment} className='p-6'>
            {/* Ride Summary */}
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Driver:</span>
                <span className='font-semibold text-gray-800'>
                  {ride.driver?.name || 'Unknown'}
                </span>
              </div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Route:</span>
                <span className='font-semibold text-gray-800 text-right text-sm'>
                  {ride.startLocation?.address} → {ride.endLocation?.address}
                </span>
              </div>
              <div className='border-t border-gray-200 mt-2 pt-2 flex justify-between'>
                <span className='font-semibold text-gray-800'>Amount to Pay:</span>
                <span className='font-bold text-lg text-blue-600'>₹{totalAmount}</span>
              </div>
            </div>

            {/* Completion Notice */}
            <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-sm text-green-800'>
                <strong>✓ Ride Completed:</strong> Both you and the driver have confirmed the ride completion.
              </p>
            </div>

            {/* UPI ID Input */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Enter your UPI ID
              </label>
              <input
                type='text'
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder='example@upi'
                disabled={loading}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
                <AlertCircle size={20} className='text-red-600 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-red-700'>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-sm text-blue-700 text-center'>
                  Processing UPI payment...
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading || !upiId.trim()}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200'
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount} via UPI`}
            </button>

            <p className='text-xs text-gray-500 text-center mt-4'>
              Payments are processed securely via UPI gateway
            </p>
          </form>
        ) : (
          /* Success State */
          <div className='p-6 text-center'>
            <CheckCircle size={64} className='text-green-600 mx-auto mb-4' />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Payment Successful!</h3>
            <p className='text-gray-600 mb-2'>Your payment has been processed.</p>
            <p className='text-sm text-gray-500 mb-4'>
              Transaction ID: <span className='font-mono'>{transactionId}</span>
            </p>
            <div className='text-sm text-gray-600'>
              <p>Thank you for using our service!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
