import api from './client';

export const chatService = {
  getChats: async () => {
    const response = await api.get('/chat/me');
    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await api.get(`/chat/${chatId}`);
    return response.data;
  },

  sendMessage: async (receiverId, content, chatId = null, rideId = null) => {
    const response = await api.post('/chat', {
      receiverId,
      content,
      chatId,
      rideId,
    });
    return response.data;
  },

  markAsRead: async (messageId) => {
    const response = await api.put(`/chat/${messageId}/read`);
    return response.data;
  },

  deleteChat: async (chatId) => {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/chat/unread');
    return response.data;
  },
};

export default chatService;
