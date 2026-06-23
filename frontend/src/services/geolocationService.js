/**
 * Geolocation service for tracking user's current location
 */
class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.isTracking = false;
    this.listeners = new Set();
  }

  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Get current position once
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            timestamp: position.timestamp
          };
          resolve(this.currentPosition);
        },
        (error) => {
          reject(this.handleError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Start tracking location
   * Calls callback every time position changes
   */
  startTracking(callback, options = {}) {
    if (!this.isSupported()) {
      callback(null, new Error('Geolocation is not supported'));
      return;
    }

    this.listeners.add(callback);

    // Provide instant feedback if last location is already loaded
    if (this.currentPosition) {
      callback(this.currentPosition, null);
    }

    if (this.watchId !== null) {
      return; // Already listening to GPS hardware
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };

    this.isTracking = true;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          timestamp: position.timestamp
        };
        
        // Notify all active subscribers
        this.listeners.forEach((listener) => {
          try {
            listener(this.currentPosition, null);
          } catch (err) {
            console.error('Error in location listener callback:', err);
          }
        });
      },
      (error) => {
        const parsedError = this.handleError(error);
        this.listeners.forEach((listener) => {
          try {
            listener(null, parsedError);
          } catch (err) {
            console.error('Error in location error callback:', err);
          }
        });
      },
      defaultOptions
    );
  }

  /**
   * Stop tracking location
   */
  stopTracking(callback) {
    if (callback) {
      this.listeners.delete(callback);
    } else {
      this.listeners.clear();
    }

    if (this.listeners.size === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('Stopped tracking location: no active listeners');
    }
  }

  /**
   * Get last known position
   */
  getLastPosition() {
    return this.currentPosition;
  }

  /**
   * Handle geolocation errors
   */
  handleError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location permission denied. Please enable location access in your browser settings.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information is unavailable. Please check your GPS/network connection.');
      case error.TIMEOUT:
        return new Error('Location request timed out. Please try again.');
      default:
        return new Error('An unknown error occurred while getting location.');
    }
  }

  /**
   * Request location permission
   */
  async requestPermission() {
    try {
      const position = await this.getCurrentPosition();
      return { granted: true, position };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * Returns distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

// Singleton instance
const geolocationService = new GeolocationService();

export default geolocationService;
