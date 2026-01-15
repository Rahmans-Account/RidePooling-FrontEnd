import api from './client';
import { notify } from '../utils/notify';

export const reviewService = {
  createReview: async (rideId, rating, comment) => {
    try {
      const response = await api.post('/reviews', { rideId, rating, comment });
      notify.reviewSubmitted();
      return response.data;
    } catch (error) {
      notify.reviewError();
      throw error;
    }
  },

  getReviewsByRide: async (rideId) => {
    try {
      const response = await api.get(`/reviews/ride/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to load reviews:', error);
      throw error;
    }
  },

  getReviewsByDriver: async (driverId) => {
    try {
      const response = await api.get(`/reviews/driver/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to load driver reviews:', error);
      throw error;
    }
  },

  getDriverAverageRating: async (driverId) => {
    try {
      const response = await api.get(`/reviews/driver/${driverId}/rating`);
      return response.data;
    } catch (error) {
      console.error('Failed to load driver rating:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      notify.success('✓ Review deleted');
      return response.data;
    } catch (error) {
      notify.error('Failed to delete review');
      throw error;
    }
  },
};

export default reviewService;
