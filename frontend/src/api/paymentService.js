import client from './client';
import { notify } from '../utils/notify';

export const paymentService = {
  // Cashfree: create order (UPI only)
  createCashfreeOrder: async (rideId) => {
    try {
      const res = await client.post('/payments/create-order', { rideId });
      return res;
    } catch (error) {
      console.error('createCashfreeOrder error:', error);
      // Re-throw without notify to preserve error details
      throw error;
    }
  },
  // Smart UPI: Get direct intent link
  getUpiIntent: async (rideId) => {
    try {
      const res = await client.post('/payments/upi-intent', { rideId });
      return res;
    } catch (error) {
      console.error('getUpiIntent error:', error);
      throw error;
    }
  },
  // Create a new payment (when booking)
  createPayment: async (rideId, amount, paymentMethod = 'card') => {
    try {
      const response = await client.post('/payments', {
        rideId,
        amount,
        paymentMethod,
      });
      return response;
    } catch (error) {
      notify.paymentError(error.response?.data?.message);
      throw error;
    }
  },

  // Confirm payment after payment gateway verifies it
  confirmPayment: async (paymentId, transactionId) => {
    try {
      const response = await client.put(`/payments/confirm`, {
        paymentId,
        transactionId,
      });
      notify.paymentSuccess();
      return response;
    } catch (error) {
      notify.paymentError(error.response?.data?.message);
      throw error;
    }
  },

  // Refund a completed payment
  refundPayment: async (paymentId, reason = 'Booking cancelled') => {
    try {
      const response = await client.post(`/payments/refund`, {
        paymentId,
        reason,
      });
      notify.refundSuccess();
      return response;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Refund failed');
      throw error;
    }
  },

  // Get payment history (passenger bookings or driver earnings)
  getPaymentHistory: async (type = 'passenger') => {
    try {
      return await client.get(`/payments/history?type=${type}`);
    } catch (error) {
      notify.error('Payment history is temporarily unavailable');
      return {
        data: {
          success: true,
          data: [],
          summary: {
            totalTransactions: 0,
            completed: 0,
            pending: 0,
            refunded: 0,
            totalAmount: 0,
          },
        },
      };
    }
  },

  // Get payment statistics (earnings for drivers or spending for passengers)
  getPaymentStats: async () => {
    try {
      return await client.get('/payments/stats');
    } catch (error) {
      notify.error('Failed to load statistics');
      throw error;
    }
  },

  // Get details of a specific payment
  getPaymentDetails: async (paymentId) => {
    try {
      return await client.get(`/payments/${paymentId}`);
    } catch (error) {
      notify.error('Failed to load payment details');
      throw error;
    }
  },
};
