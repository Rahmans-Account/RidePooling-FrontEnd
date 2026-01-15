import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Clock, User, Car, CheckCircle } from 'lucide-react';
import socketService from '../services/socketService';
import geolocationService from '../services/geolocationService';
import authService from '../services/authService';
import bookingService from '../api/bookingService';
import PaymentCompletionModal from './PaymentCompletionModal';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom driver icon
const driverIcon = new L.DivIcon({
  html: `<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-center; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  </div>`,
  className: 'custom-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Custom passenger icon
const passengerIcon = new L.DivIcon({
  html: `<div style="background: #10b981; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  </div>`,
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LiveTracking({ rideId, isDriver, pickupLocation, dropLocation, rideData, onClose }) {
  const navigate = useNavigate();
  const [driverLocation, setDriverLocation] = useState(null);
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [driverCompleted, setDriverCompleted] = useState(false);
  const [passengerCompleted, setPassengerCompleted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [rideFullData, setRideFullData] = useState(rideData || null);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const trackingIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Calculate map center
  const mapCenter = driverLocation 
    ? [driverLocation.latitude, driverLocation.longitude]
    : pickupLocation
    ? [pickupLocation.latitude, pickupLocation.longitude]
    : [28.6139, 77.2090]; // Default: Delhi

  useEffect(() => {
    const token = authService.getToken();
    socketService.connect(token);

    // Join ride room
    socketService.joinRide(rideId, isDriver ? 'driver' : 'passenger');

    // Listen for location updates
    socketService.onLocationUpdate((data) => {
      setDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: data.timestamp
      });
      setDistance(data.distance);
      setEta(data.eta);
      setIsConnected(true);
    });

    // Listen for messages
    socketService.onReceiveMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user join/leave
    socketService.onUserJoined((data) => {
      console.log('User joined:', data);
    });

    socketService.onUserLeft((data) => {
      console.log('User left:', data);
    });

    return () => {
      stopTracking();
      socketService.removeAllListeners();
    };
  }, [rideId, isDriver]);

  // Start location tracking (driver only)
  const startTracking = () => {
    if (!isDriver) return;

    // Request permission
    geolocationService.requestPermission().then(result => {
      if (result.granted) {
        setTrackingEnabled(true);
        setPassengerLocation({
          latitude: result.position.latitude,
          longitude: result.position.longitude
        });

        // Send location every 3 seconds
        trackingIntervalRef.current = setInterval(() => {
          geolocationService.getCurrentPosition().then(position => {
            socketService.updateLocation({
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              heading: position.heading
            });
            setPassengerLocation({
              latitude: position.latitude,
              longitude: position.longitude
            });
          }).catch(error => {
            console.error('Error getting location:', error);
          });
        }, 3000); // Update every 3 seconds
      } else {
        alert(result.error);
      }
    });
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    geolocationService.stopTracking();
    setTrackingEnabled(false);
  };

  // Timer functions
  const startTimer = () => {
    setTimerStarted(true);
    setElapsedTime(0);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerStarted(false);
    setElapsedTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Socket listener for payment completion - moved after functions are defined
  useEffect(() => {
    const handlePaymentComplete = (data) => {
      console.log('🎉 Payment complete handler called with data:', data);
      if (isDriver) {
        console.log('💳 Payment completed for driver - stopping timer');
        setTimerStarted(false); // Stop showing timer
        stopTimer(); // Clear the interval
        alert(`✅ Payment Confirmed!\n₹${data?.amount || 0} received\n\nRedirecting to Payment History...`);
        
        // Close the tracking overlay after a moment
        setTimeout(() => {
          console.log('Closing tracking and navigating...');
          onClose(); // Close the LiveTracking overlay
          navigate('/payment-history');
        }, 1500);
      }
    };

    if (isDriver) {
      console.log('Driver: Setting up payment-completed listener for ride', rideId);
      socketService.onPaymentCompleted(handlePaymentComplete);
    }

    return () => {
      // Cleanup
    };
  }, [isDriver, rideId, navigate, onClose]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socketService.sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // Handle ride completion (driver or passenger)
  const handleCompleteRide = async () => {
    try {
      setCompletionLoading(true);

      const res = isDriver
        ? await bookingService.markCompletedByDriver(rideId)
        : await bookingService.markCompletedByPassenger(rideId);

      console.log('Completion response:', res);

      // Check response structure - handle both data.paymentPending and data.data.paymentPending
      const paymentPending = res?.data?.data?.paymentPending
        || res?.data?.paymentPending
        || res?.paymentPending;

      if (isDriver) {
        setDriverCompleted(true);
      } else {
        setPassengerCompleted(true);
      }

      // Ensure we have full ride data for the payment modal
      const completeRideData = {
        _id: rideId,
        driver: rideData?.driver || {},
        startLocation: pickupLocation || {},
        endLocation: dropLocation || {},
        totalAmount: rideData?.totalAmount || 0,
      };

      setRideFullData(completeRideData);

      // Passenger flow: open modal; if backend hasn’t flipped paymentPending yet, still allow payment UI
      if (!isDriver) {
        console.log('Opening payment modal for passenger with ride data:', completeRideData, 'paymentPending:', paymentPending);
        setShowPaymentModal(true);
      } else if (isDriver && paymentPending) {
        console.log('Driver completed; waiting for all passengers to pay');
        startTimer();
      }
    } catch (error) {
      console.error('Failed to mark completion:', error);
      alert(error?.response?.data?.message || 'Failed to mark as completed');
    } finally {
      setCompletionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Live Tracking</h1>
              <p className="text-sm text-slate-500">
                {isConnected ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Connected
                  </span>
                ) : (
                  'Connecting...'
                )}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {timerStarted && isDriver && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg border-2 border-orange-500">
                <Clock size={20} className="text-orange-600" />
                <div>
                  <p className="text-xs text-orange-700 font-semibold">Waiting for Payment</p>
                  <p className="text-lg font-bold text-orange-600">{formatTime(elapsedTime)}</p>
                </div>
              </div>
            )}
            {distance && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Navigation size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="text-sm font-bold text-slate-900">{distance} km</p>
                </div>
              </div>
            )}
            {eta && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Clock size={20} className="text-green-600" />
                <div>
                  <p className="text-xs text-slate-500">ETA</p>
                  <p className="text-sm font-bold text-slate-900">{eta} mins</p>
                </div>
              </div>
            )}
            {isDriver && (
              <button
                onClick={trackingEnabled ? stopTracking : startTracking}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  trackingEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {trackingEnabled ? 'Stop Sharing' : 'Start Sharing Location'}
              </button>
            )}
            
            {/* Ride Completion Buttons */}
            {!driverCompleted && isDriver && (
              <button
                onClick={handleCompleteRide}
                disabled={completionLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <CheckCircle size={18} />
                {completionLoading ? 'Marking...' : 'I Have Dropped Off'}
              </button>
            )}
            
            {!passengerCompleted && !isDriver && (
              <button
                onClick={handleCompleteRide}
                disabled={completionLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <CheckCircle size={18} />
                {completionLoading ? 'Marking...' : 'Ride Complete'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-20">
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater center={mapCenter} />

          {/* Driver marker */}
          {driverLocation && (
            <Marker
              position={[driverLocation.latitude, driverLocation.longitude]}
              icon={driverIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Driver</p>
                  <p className="text-xs">Speed: {driverLocation.speed?.toFixed(1) || 0} km/h</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pickup location */}
          {pickupLocation && (
            <Marker
              position={[pickupLocation.latitude, pickupLocation.longitude]}
              icon={passengerIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Pickup Point</p>
                  <p className="text-xs">{pickupLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Draw route line */}
          {driverLocation && pickupLocation && (
            <Polyline
              positions={[
                [driverLocation.latitude, driverLocation.longitude],
                [pickupLocation.latitude, pickupLocation.longitude]
              ]}
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Chat panel */}
      <div className="absolute bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-20">
        <div className="bg-slate-900 px-4 py-3">
          <h3 className="text-white font-bold">Chat with {isDriver ? 'Passenger' : 'Driver'}</h3>
        </div>
        <div className="h-64 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-700">{msg.userName}</p>
              <p className="text-sm text-slate-900">{msg.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>

      {/* Payment Completion Modal */}
      <PaymentCompletionModal 
        isOpen={showPaymentModal}
        ride={rideFullData}
        totalAmount={rideFullData?.totalAmount || 0}
        onClose={() => {
          setShowPaymentModal(false);
          onClose(); // Close tracking when payment done
        }}
        onSuccess={() => {
          setShowPaymentModal(false);
          onClose(); // Close tracking when payment done
        }}
      />
    </div>
  );
}
