import api from '../api/client';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.phone - Phone number
   * @param {string} userData.city - City
   * @param {string} userData.gender - Gender (optional: male, female, other)
   * @returns {Promise<Object>} User data and token
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data.token) {
        // Store token in localStorage
        localStorage.setItem('jwtToken', response.data.data.token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and token
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.data.token) {
        // Store token in localStorage
        localStorage.setItem('jwtToken', response.data.data.token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User data or null
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get JWT token
   * @returns {string|null} JWT token or null
   */
  getToken() {
    return localStorage.getItem('jwtToken');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Get user profile from backend
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success && response.data.data.user) {
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @param {string} updates.name - Name (optional)
   * @param {string} updates.phone - Phone (optional)
   * @param {string} updates.city - City (optional)
   * @param {string} updates.gender - Gender (optional)
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(updates) {
    try {
      const response = await api.put('/auth/profile', updates);
      
      if (response.data.success && response.data.data.user) {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to change password' };
    }
  },

  async uploadKYC(formData) {
    try {
      const response = await api.post('/auth/kyc', formData, {
        // Let the browser set multipart boundary automatically.
        timeout: 120000,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to upload KYC documents' };
    }
  },
};

export default authService;
