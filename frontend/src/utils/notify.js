import toast from 'react-hot-toast';

/**
 * Notification utility for consistent toast messages across the app
 * Uses react-hot-toast for beautiful, accessible notifications
 */
export const notify = {
  // Success notifications (green)
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },

  // Error notifications (red)
  error: (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...options,
    });
  },

  // Info notifications (blue)
  info: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      ...options,
    });
  },

  // Loading notifications (spinner)
  loading: (message, options = {}) => {
    return toast.loading(message, {
      duration: Infinity,
      position: 'top-right',
      ...options,
    });
  },

  // Update an existing toast
  update: (toastId, message, type = 'success') => {
    if (type === 'success') {
      toast.success(message, { id: toastId });
    } else if (type === 'error') {
      toast.error(message, { id: toastId });
    } else {
      toast(message, { id: toastId });
    }
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.remove();
  },

  // Dismiss specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Booking notifications
  bookingSuccess: () => {
    notify.success('🎉 Ride booked successfully!');
  },

  bookingError: (error) => {
    notify.error(error || 'Failed to book ride. Try again.');
  },

  bookingCancelled: () => {
    notify.success('✓ Booking cancelled and refunded');
  },

  // Payment notifications
  paymentProcessing: () => {
    return notify.loading('💳 Processing payment...');
  },

  paymentSuccess: () => {
    notify.success('💰 Payment successful! Booking confirmed.');
  },

  paymentError: (error) => {
    notify.error(error || 'Payment failed. Please try again.');
  },

  refundProcessing: () => {
    return notify.loading('Refunding payment...');
  },

  refundSuccess: () => {
    notify.success('✓ Refund processed successfully');
  },

  // Message notifications
  messageSent: () => {
    notify.success('✓ Message sent');
  },

  messageError: () => {
    notify.error('Failed to send message');
  },

  newMessage: (senderName) => {
    notify.info(`💬 New message from ${senderName}`);
  },

  // Ride notifications
  rideCreated: () => {
    notify.success('✓ Ride created! Waiting for passengers.');
  },

  rideStarted: () => {
    notify.info('🚗 Ride is starting!');
  },

  rideCompleted: () => {
    notify.success('✓ Ride completed successfully!');
  },

  rideError: (error) => {
    notify.error(error || 'Error with ride operation');
  },

  // Review notifications
  reviewSubmitted: () => {
    notify.success('⭐ Review submitted successfully');
  },

  reviewError: () => {
    notify.error('Failed to submit review');
  },

  // Profile notifications
  profileUpdated: () => {
    notify.success('✓ Profile updated');
  },

  profileError: () => {
    notify.error('Failed to update profile');
  },

  // Authentication notifications
  loginSuccess: () => {
    notify.success('Welcome back! 👋');
  },

  loginError: (error) => {
    notify.error(error || 'Login failed. Check credentials.');
  },

  logoutSuccess: () => {
    notify.success('Logged out successfully');
  },

  registerSuccess: () => {
    notify.success('✓ Registration successful! Please login.');
  },

  registerError: (error) => {
    notify.error(error || 'Registration failed');
  },

  // General notifications
  saved: () => {
    notify.success('✓ Changes saved');
  },

  deleted: () => {
    notify.success('✓ Deleted successfully');
  },

  copied: () => {
    notify.success('✓ Copied to clipboard');
  },

  warning: (message) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
    });
  },

  // Alias kept for backward compatibility with existing call sites.
  warn: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      ...options,
    });
  },

  networkError: () => {
    notify.error('❌ Network error. Check your connection.');
  },

  sessionExpired: () => {
    notify.error('Session expired. Please login again.');
  },

  unauthorized: () => {
    notify.error('❌ You are not authorized for this action');
  },
};

export default notify;
