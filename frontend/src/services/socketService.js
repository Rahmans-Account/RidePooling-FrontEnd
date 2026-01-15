import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

    this.socket = io(SERVER_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket manually disconnected');
    }
  }

  // Join a ride room
  joinRide(rideId, role = 'passenger') {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('join-ride', { rideId, role });
  }

  // Update location (driver only)
  updateLocation(locationData) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('update-location', locationData);
  }

  // Send chat message
  sendMessage(message) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('send-message', { message });
  }

  // Typing indicators
  startTyping() {
    if (!this.socket) return;
    this.socket.emit('typing');
  }

  stopTyping() {
    if (!this.socket) return;
    this.socket.emit('stop-typing');
  }

  // Ride status
  startRide() {
    if (!this.socket) return;
    this.socket.emit('ride-started');
  }

  completeRide() {
    if (!this.socket) return;
    this.socket.emit('ride-completed');
  }

  // Event listeners
  onLocationUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('location-update', callback);
  }

  onReceiveMessage(callback) {
    if (!this.socket) return;
    this.socket.on('receive-message', callback);
  }

  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on('user-left', callback);
  }

  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on('user-typing', callback);
  }

  onUserStopTyping(callback) {
    if (!this.socket) return;
    this.socket.on('user-stop-typing', callback);
  }

  onRideStatusChange(callback) {
    if (!this.socket) return;
    this.socket.on('ride-status-change', callback);
  }

  onPaymentCompleted(callback) {
    if (!this.socket) return;
    console.log('📡 Setting up payment-completed listener');
    this.socket.on('payment-completed', (data) => {
      console.log('✅ Payment-completed event received:', data);
      callback(data);
    });
  }

  offLocationUpdate(callback) {
    if (!this.socket) return;
    this.socket.off('location-update', callback);
  }

  offReceiveMessage(callback) {
    if (!this.socket) return;
    this.socket.off('receive-message', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  getSocket() {
    return this.socket;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
