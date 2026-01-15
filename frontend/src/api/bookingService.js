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
};

export default bookingService;
