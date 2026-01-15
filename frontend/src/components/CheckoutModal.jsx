import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { paymentService } from '../api/paymentService';

export default function CheckoutModal({ isOpen, ride, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const seatsToBook = ride?.seatsBooked || 1;
  const pricePerSeat = ride?.pricePerSeat || 0;
  const totalAmount = seatsToBook * pricePerSeat;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Create payment record
      const paymentRes = await paymentService.createPayment(
        ride._id,
        totalAmount,
        paymentMethod
      );

      const paymentId = paymentRes.data.data._id;
      const generatedTransactionId = paymentRes.data.data.transactionId;

      // Step 2: Simulate payment gateway processing
      // In production, integrate with Stripe, Razorpay, or other payment gateway
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
          <h2 className='text-xl font-bold text-gray-800'>Checkout</h2>
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
                <span className='text-gray-600'>Route:</span>
                <span className='font-semibold text-gray-800'>
                  {ride.startLocation?.address || 'Start'} → {ride.endLocation?.address || 'End'}
                </span>
              </div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Seats:</span>
                <span className='font-semibold text-gray-800'>{seatsToBook}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Price per seat:</span>
                <span className='font-semibold text-gray-800'>₹{pricePerSeat}</span>
              </div>
              <div className='border-t border-gray-200 mt-2 pt-2 flex justify-between'>
                <span className='font-semibold text-gray-800'>Total Amount:</span>
                <span className='font-bold text-lg text-blue-600'>₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-800 mb-3'>
                Payment Method
              </label>
              <div className='space-y-2'>
                {['card', 'upi', 'wallet', 'net_banking'].map((method) => (
                  <label key={method} className='flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50'>
                    <input
                      type='radio'
                      name='paymentMethod'
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                      className='w-4 h-4 text-blue-600'
                    />
                    <span className='ml-3 capitalize text-gray-700 font-medium'>
                      {method === 'card'
                        ? 'Credit/Debit Card'
                        : method === 'upi'
                        ? 'UPI'
                        : method === 'wallet'
                        ? 'Digital Wallet'
                        : 'Net Banking'}
                    </span>
                  </label>
                ))}
              </div>
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
                  Processing payment via {paymentMethod.toUpperCase()}...
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200'
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className='p-6 text-center'>
            <CheckCircle size={64} className='text-green-600 mx-auto mb-4' />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Payment Successful!</h3>
            <p className='text-gray-600 mb-2'>Your booking has been confirmed.</p>
            <p className='text-sm text-gray-500 mb-4'>
              Transaction ID: <span className='font-mono'>{transactionId}</span>
            </p>
            <div className='text-sm text-gray-600'>
              <p>Redirecting to your rides...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
