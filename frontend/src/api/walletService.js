import api from './client';

export const walletService = {
  getWallet: async () => {
    try {
      const response = await api.get('/wallet');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBalance: async () => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactionHistory: async (params = {}) => {
    try {
      const response = await api.get('/wallet/transactions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processPayment: async (rideId) => {
    try {
      const response = await api.post(`/wallet/pay/${rideId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addFunds: async (amount) => {
    try {
      const response = await api.post('/wallet/add-funds', { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default walletService;
