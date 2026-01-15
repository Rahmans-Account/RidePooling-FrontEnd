import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800'>Confirm Booking</h2>
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
          <form onSubmit={handleBooking} className='p-6'>
            {/* Ride Summary */}
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Route:</span>
                <span className='font-semibold text-gray-800 text-right text-sm'>
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

            {/* Payment Notice */}
            <div className='mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg'>
              <p className='text-sm text-amber-800'>
                <strong>Payment after ride:</strong> You'll pay the driver via UPI after both of you confirm the ride is completed.
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
                  Confirming your booking...
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200'
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className='p-6 text-center'>
            <CheckCircle size={64} className='text-green-600 mx-auto mb-4' />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Booking Confirmed!</h3>
            <p className='text-gray-600 mb-2'>Your ride has been booked successfully.</p>
            <p className='text-sm text-gray-500 mb-4'>
              You'll pay ₹{totalAmount} via UPI after the ride is completed.
            </p>
            <div className='text-sm text-gray-600'>
              <p>Redirecting to your bookings...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
