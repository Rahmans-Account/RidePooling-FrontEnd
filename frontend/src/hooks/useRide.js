import { useState } from 'react';
import rideService from '../services/rideService';

/**
 * Custom hook for managing ride operations
 * @returns {Object} Ride state and functions
 */
export const useRide = () => {
  const [rides, setRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Create a new ride
   * @param {Object} rideData - Ride data
   * @returns {Promise<boolean>} Success status
   */
  const createRide = async (rideData) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.createRide(rideData);
      if (response.success) {
        return true;
      }
      setError(response.message || 'Failed to create ride');
      return false;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all rides with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<void>}
   */
  const fetchAllRides = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.getAllRides(filters);
      if (response.success) {
        setRides(response.data.rides);
      } else {
        setError(response.message || 'Failed to fetch rides');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user's rides
   * @returns {Promise<void>}
   */
  const fetchMyRides = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.getMyRides();
      if (response.success) {
        setMyRides(response.data.rides);
      } else {
        setError(response.message || 'Failed to fetch your rides');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get ride by ID
   * @param {string} rideId - Ride ID
   * @returns {Promise<boolean>} Success status
   */
  const getRide = async (rideId) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.getRideById(rideId);
      if (response.success) {
        setCurrentRide(response.data.ride);
        return true;
      }
      setError(response.message || 'Failed to fetch ride');
      return false;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a ride
   * @param {string} rideId - Ride ID
   * @param {Object} updates - Updates
   * @returns {Promise<boolean>} Success status
   */
  const updateRide = async (rideId, updates) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.updateRide(rideId, updates);
      if (response.success) {
        setCurrentRide(response.data.ride);
        return true;
      }
      setError(response.message || 'Failed to update ride');
      return false;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel a ride
   * @param {string} rideId - Ride ID
   * @returns {Promise<boolean>} Success status
   */
  const cancelRide = async (rideId) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.cancelRide(rideId);
      if (response.success) {
        // Remove from myRides
        setMyRides(myRides.filter(ride => ride._id !== rideId));
        return true;
      }
      setError(response.message || 'Failed to cancel ride');
      return false;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search rides
   * @param {Object} filters - Search filters
   * @returns {Promise<void>}
   */
  const searchRides = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await rideService.searchRides(filters);
      if (response.success) {
        setRides(response.data.rides);
      } else {
        setError(response.message || 'Failed to search rides');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    rides,
    myRides,
    currentRide,
    loading,
    error,
    createRide,
    fetchAllRides,
    fetchMyRides,
    getRide,
    updateRide,
    cancelRide,
    searchRides,
  };
};
