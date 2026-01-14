import api from './client';

export const bookingService = {
  bookRide: async (rideId) => {
    const response = await api.post(`/bookings/${rideId}/book`);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  cancelBooking: async (rideId) => {
    const response = await api.delete(`/bookings/${rideId}`);
    return response.data;
  },
};

export default bookingService;
