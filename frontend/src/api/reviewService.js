import api from './client';

export const reviewService = {
  createReview: async (rideId, rating, comment) => {
    const response = await api.post('/reviews', { rideId, rating, comment });
    return response.data;
  },

  getReviewsByRide: async (rideId) => {
    const response = await api.get(`/reviews/ride/${rideId}`);
    return response.data;
  },

  getReviewsByDriver: async (driverId) => {
    const response = await api.get(`/reviews/driver/${driverId}`);
    return response.data;
  },

  getDriverAverageRating: async (driverId) => {
    const response = await api.get(`/reviews/driver/${driverId}/rating`);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
