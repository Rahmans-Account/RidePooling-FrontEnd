import api from './client';
import { notify } from '../utils/notify';

export const bookingService = {
  bookRide: async (rideId, seats = 1) => {
    try {
      const response = await api.post(`/bookings/${rideId}/book`, { seats });
      notify.bookingSuccess();
      return response.data;
    } catch (error) {
      notify.bookingError(error.response?.data?.message);
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/me');
      return response.data;
    } catch (error) {
      notify.error('Failed to load bookings');
      throw error;
    }
  },

  getDriverBookings: async () => {
    try {
      const response = await api.get('/bookings/driver');
      return response.data;
    } catch (error) {
      notify.error('Failed to load driver bookings');
      throw error;
    }
  },

  cancelBooking: async (rideId) => {
    try {
      const response = await api.delete(`/bookings/${rideId}`);
      notify.bookingCancelled();
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to cancel booking');
      throw error;
    }
  },

  markCompletedByDriver: async (rideId) => {
    try {
      const response = await api.post(`/bookings/${rideId}/complete-driver`);
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to mark as completed');
      throw error;
    }
  },

  markCompletedByPassenger: async (rideId) => {
    try {
      const response = await api.post(`/bookings/${rideId}/complete-passenger`);
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to mark as completed');
      throw error;
    }
  },

  acceptBooking: async (rideId, passengerId) => {
    try {
      const response = await api.post(`/bookings/${rideId}/accept/${passengerId}`);
      notify.success('Booking accepted! Ride code generated.');
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to accept booking');
      throw error;
    }
  },

  rejectBooking: async (rideId, passengerId) => {
    try {
      const response = await api.post(`/bookings/${rideId}/reject/${passengerId}`);
      notify.success('Booking rejected');
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to reject booking');
      throw error;
    }
  },

  verifyPickupCode: async (rideId, code) => {
    try {
      const response = await api.post(`/bookings/${rideId}/verify-pickup`, { code });
      notify.success('Pickup verified! Ride started.');
      return response.data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Invalid ride code');
      throw error;
    }
  },
};

export default bookingService;
