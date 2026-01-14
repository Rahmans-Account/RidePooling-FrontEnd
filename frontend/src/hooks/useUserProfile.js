import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Custom hook for managing user profile state and operations
 * @returns {Object} User profile state and functions
 */
export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetch current user profile
   */
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data.user);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<boolean>} True if successful
   */
  const updateProfile = async (updates) => {
    setError('');
    try {
      const response = await authService.updateProfile(updates);
      if (response.success) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
      return false;
    }
  };

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if successful
   */
  const changePassword = async (currentPassword, newPassword) => {
    setError('');
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to change password');
        return false;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while changing password');
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    logout,
  };
};
