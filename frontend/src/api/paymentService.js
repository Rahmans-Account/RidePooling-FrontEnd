import client from './client';

export const paymentService = {
  // Create a new payment (when booking)
  createPayment: (rideId, amount, paymentMethod = 'card') => {
    return client.post('/payments', {
      rideId,
      amount,
      paymentMethod,
    });
  },

  // Confirm payment after payment gateway verifies it
  confirmPayment: (paymentId, transactionId) => {
    return client.put(`/payments/confirm`, {
      paymentId,
      transactionId,
    });
  },

  // Refund a completed payment
  refundPayment: (paymentId, reason = 'Booking cancelled') => {
    return client.post(`/payments/refund`, {
      paymentId,
      reason,
    });
  },

  // Get payment history (passenger bookings or driver earnings)
  getPaymentHistory: (type = 'passenger') => {
    return client.get(`/payments/history?type=${type}`);
  },

  // Get payment statistics (earnings for drivers or spending for passengers)
  getPaymentStats: () => {
    return client.get('/payments/stats');
  },

  // Get details of a specific payment
  getPaymentDetails: (paymentId) => {
    return client.get(`/payments/${paymentId}`);
  },
};
