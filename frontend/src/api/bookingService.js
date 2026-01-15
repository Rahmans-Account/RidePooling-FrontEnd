import api from './client';
import { notify } from '../utils/notify';

export const bookingService = {
  bookRide: async (rideId) => {
    try {
      const response = await api.post(`/bookings/${rideId}/book`);
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
};

export default bookingService;
