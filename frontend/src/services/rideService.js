import api from '../api/client';

const rideService = {
  /**
   * Create a new ride (offer a ride)
   * @param {Object} rideData - Ride information
   * @returns {Promise<Object>} Created ride data
   */
  async createRide(rideData) {
    try {
      const response = await api.post('/rides', rideData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create ride' };
    }
  },

  /**
   * Get all available rides with optional filters
   * @param {Object} filters - Filter parameters
   * @param {string} filters.startLocation - Start location city
   * @param {string} filters.endLocation - End location city
   * @param {string} filters.departureDate - Departure date (YYYY-MM-DD)
   * @param {number} filters.minSeats - Minimum available seats
   * @param {number} filters.maxPrice - Maximum price per seat
   * @returns {Promise<Object>} List of rides
   */
  async getAllRides(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startLocation) params.append('startLocation', filters.startLocation);
      if (filters.endLocation) params.append('endLocation', filters.endLocation);
      if (filters.departureDate) params.append('departureDate', filters.departureDate);
      if (filters.minSeats) params.append('minSeats', filters.minSeats);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.latitude) params.append('latitude', filters.latitude);
      if (filters.longitude) params.append('longitude', filters.longitude);
      if (filters.maxDistanceKm) params.append('maxDistanceKm', filters.maxDistanceKm);
      params.append('status', 'active');

      const response = await api.get(`/rides?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch rides' };
    }
  },

  /**
   * Get ride by ID
   * @param {string} rideId - Ride ID
   * @returns {Promise<Object>} Ride details
   */
  async getRideById(rideId) {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch ride' };
    }
  },

  /**
   * Get user's rides (as driver)
   * @returns {Promise<Object>} User's rides
   */
  async getMyRides() {
    try {
      const response = await api.get('/rides/my-rides');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch your rides' };
    }
  },

  /**
   * Update a ride (driver only)
   * @param {string} rideId - Ride ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated ride
   */
  async updateRide(rideId, updates) {
    try {
      const response = await api.put(`/rides/${rideId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update ride' };
    }
  },

  /**
   * Cancel a ride (driver only)
   * @param {string} rideId - Ride ID
   * @returns {Promise<Object>} Success message
   */
  async cancelRide(rideId) {
    try {
      const response = await api.delete(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to cancel ride' };
    }
  },

  /**
   * Search rides with filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Object>} Matching rides
   */
  async searchRides(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startCity) params.append('startCity', filters.startCity);
      if (filters.endCity) params.append('endCity', filters.endCity);
      if (filters.departureDate) params.append('departureDate', filters.departureDate);
      if (filters.minSeats) params.append('minSeats', filters.minSeats);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.latitude) params.append('latitude', filters.latitude);
      if (filters.longitude) params.append('longitude', filters.longitude);
      if (filters.maxDistanceKm) params.append('maxDistanceKm', filters.maxDistanceKm);

      const response = await api.get(`/rides/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to search rides' };
    }
  },
};

export default rideService;
