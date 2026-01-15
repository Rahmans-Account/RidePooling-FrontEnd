import api from './client';
import { notify } from '../utils/notify';

export const chatService = {
  getChats: async () => {
    try {
      const response = await api.get('/chat/me');
      return response.data;
    } catch (error) {
      notify.error('Failed to load chats');
      throw error;
    }
  },

  getMessages: async (chatId) => {
    try {
      const response = await api.get(`/chat/${chatId}`);
      return response.data;
    } catch (error) {
      notify.error('Failed to load messages');
      throw error;
    }
  },

  sendMessage: async (receiverId, content, chatId = null, rideId = null) => {
    try {
      const response = await api.post('/chat', {
        receiverId,
        content,
        chatId,
        rideId,
      });
      notify.messageSent();
      return response.data;
    } catch (error) {
      notify.messageError();
      throw error;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await api.put(`/chat/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      const response = await api.delete(`/chat/${chatId}`);
      notify.success('✓ Chat deleted');
      return response.data;
    } catch (error) {
      notify.error('Failed to delete chat');
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/chat/unread');
      return response.data;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  },
};

export default chatService;
