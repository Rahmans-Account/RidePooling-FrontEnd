import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, Clock, User, Car, CheckCircle } from 'lucide-react';
import socketService from '../services/socketService';
import geolocationService from '../services/geolocationService';
import authService from '../services/authService';
import bookingService from '../api/bookingService';
import PaymentCompletionModal from './PaymentCompletionModal';
import { notify } from '../utils/notify';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
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
  const [distanceToDropKm, setDistanceToDropKm] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minute countdown
  const [sosHoldActive, setSosHoldActive] = useState(false);
  const trackingIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const sosHoldTimeoutRef = useRef(null);
  const timerStartTimeRef = useRef(null); // Ref to track actual start time for accuracy

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

    // Listen for Emergency Alerts
    socketService.onEmergencyAlert((alertData) => {
      console.warn('🚨 EMERGENCY ALERT RECEIVED:', alertData);
      window.alert(`🚨 EMERGENCY ALERT: ${alertData.userName} has triggered an SOS! Location: ${alertData.location.latitude}, ${alertData.location.longitude}`);
      notify.error(`🚨 EMERGENCY: SOS triggered by ${alertData.userName}`);
    });

    // Listen for Ride Status Updates
    socketService.onRideStatusUpdate((data) => {
      console.log('Ride status update:', data);
      notify.info(data.message);
      if (data.status === 'dropped') {
        setDriverCompleted(true);
      } else if (data.status === 'reached') {
        setPassengerCompleted(true);
      }
    });

    return () => {
      if (sosHoldTimeoutRef.current) clearTimeout(sosHoldTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
      stopTracking();
      socketService.removeAllListeners();
    };
  }, [rideId, isDriver]);

  // Start location tracking
  const startTracking = () => {
    // Request permission
    geolocationService.requestPermission().then(result => {
      if (result.granted) {
        setTrackingEnabled(true);

        if (isDriver) {
          // Driver sends location updates
          trackingIntervalRef.current = setInterval(() => {
            geolocationService.getCurrentPosition().then(position => {
              socketService.updateLocation({
                latitude: position.latitude,
                longitude: position.longitude,
                speed: position.speed,
                heading: position.heading
              });
            }).catch(error => {
              console.error('Geolocation error:', error);
              notify.error('Unable to access GPS location. Please enable location services.');
            });
          }, 3000);
        } else {
          // Passenger shares their location
          setPassengerLocation({
            latitude: result.position.latitude,
            longitude: result.position.longitude
          });

          trackingIntervalRef.current = setInterval(() => {
            geolocationService.getCurrentPosition().then(position => {
              const locationData = {
                latitude: position.latitude,
                longitude: position.longitude
              };
              setPassengerLocation(locationData);
              socketService.updatePassengerLocation(locationData);
            }).catch(error => {
              console.error('Geolocation error:', error);
              notify.error('Unable to share your location. Please check GPS permission.');
            });
          }, 5000); // Update every 5 seconds for passenger
        }
      } else {
        notify.error(result.error || 'Location permission denied. Live tracking requires GPS access.');
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

  // Timer functions - using ref for real-time accuracy
  const startTimer = () => {
    console.log('⏱️ Payment Countdown started');
    setTimerStarted(true);
    setRemainingTime(300);
    
    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerStarted(false);
    setRemainingTime(300);
  };

  const canMarkCompletion = distanceToDropKm === null || distanceToDropKm <= 0.5;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Socket listener for payment completion - moved after functions are defined
  useEffect(() => {
    const handlePaymentComplete = (data) => {
      console.log('🎉 Payment complete handler called with data:', data);
      const currentUserId = authService.getCurrentUser()?._id;
      // Driver flow: stop timer and redirect
      if (isDriver) {
        console.log('💳 Payment completed for driver - stopping timer immediately');
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        timerStartTimeRef.current = null;
        setTimerStarted(false);
        stopTracking();
        alert(`✅ Payment Confirmed!\n₹${data?.amount || 0} received\n\nRedirecting to Payment History...`);
        setTimeout(() => {
          console.log('Closing tracking and navigating...');
          onClose();
          navigate('/payment-history');
        }, 1500);
      } else if (data?.passengerId === currentUserId) {
        // Passenger flow: redirect to Payment History after webhook-confirmed success
        alert('✅ Payment successful! Redirecting to Payment History...');
        setTimeout(() => {
          onClose();
          navigate('/payment-history');
        }, 1000);
      }
    };

    console.log('Setting up payment-completed listener for ride', rideId);
    socketService.onPaymentCompleted(handlePaymentComplete);

    return () => {
      if (socketService.getSocket()) {
        console.log('Cleaning up payment-completed listener');
        socketService.getSocket().off('payment-completed', handlePaymentComplete);
      }
    };
  }, [isDriver, rideId, navigate, onClose]);

  // Handle SOS
  const handleSos = () => {
    geolocationService.getCurrentPosition().then(position => {
      const locationData = {
        latitude: position.latitude,
        longitude: position.longitude
      };
      socketService.sendSos(rideId, locationData);
      notify.warn('SOS Alert Sent! Police and emergency contacts are being notified.');
      alert('🚨 SOS triggered! Help is on the way.');
    }).catch(error => {
      console.error('SOS error:', error);
      notify.error('Failed to trigger SOS. Please call local emergency numbers.');
    });
  };

  const startSosHold = () => {
    if (sosHoldTimeoutRef.current) clearTimeout(sosHoldTimeoutRef.current);
    setSosHoldActive(true);
    sosHoldTimeoutRef.current = setTimeout(() => {
      handleSos();
      setSosHoldActive(false);
      sosHoldTimeoutRef.current = null;
    }, 1400);
  };

  const cancelSosHold = () => {
    if (sosHoldTimeoutRef.current) {
      clearTimeout(sosHoldTimeoutRef.current);
      sosHoldTimeoutRef.current = null;
    }
    setSosHoldActive(false);
  };

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
      if (!canMarkCompletion) {
        alert('Completion is allowed only within 500m of the destination.');
        return;
      }

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
        socketService.sendRideDropped(rideId);
      } else {
        setPassengerCompleted(true);
        socketService.sendRideReached(rideId);
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
        // Stop any existing timer first
        stopTimer();
        // Start new timer for payment waiting
        startTimer();
      } else if (isDriver && !paymentPending) {
        console.log('Driver completed; no payment pending, ride complete');
        stopTracking();
        alert('✅ Ride completed successfully!');
        setTimeout(() => {
          onClose();
          navigate('/my-rides');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to mark completion:', error);
      alert(error?.response?.data?.message || 'Failed to mark as completed');
    } finally {
      setCompletionLoading(false);
    }
  };

  useEffect(() => {
    let fenceInterval = null;

    const updateFenceDistance = () => {
      if (!dropLocation?.latitude || !dropLocation?.longitude) {
        setDistanceToDropKm(null);
        return;
      }

      geolocationService.getCurrentPosition()
        .then((position) => {
          const km = geolocationService.calculateDistance(
            Number(position.latitude),
            Number(position.longitude),
            Number(dropLocation.latitude),
            Number(dropLocation.longitude)
          );
          setDistanceToDropKm(km);
        })
        .catch(() => {
          setDistanceToDropKm(null);
        });
    };

    updateFenceDistance();
    fenceInterval = setInterval(updateFenceDistance, 10000);

    return () => {
      if (fenceInterval) clearInterval(fenceInterval);
    };
  }, [dropLocation]);

  return (
    <div className="fixed inset-0 bg-pastel-cream z-50 overflow-hidden font-[Poppins]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 glass-morphism border-white shadow-pastel-shadow z-10 px-3 md:px-8 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                stopTimer();
                stopTracking();
                onClose();
              }}
              aria-label="Close live tracking"
              className="p-3 bg-white/50 hover:bg-white rounded-2xl shadow-sm transition-all text-slate-600 hover:text-slate-900 border border-white"
            >
              <Navigation size={20} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Live Journey</h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-1">
                {isConnected ? (
                  <span className="flex items-center gap-1 text-pastel-mint-dark">
                    <span className="w-2 h-2 bg-pastel-mint-dark rounded-full animate-pulse"></span>
                    Syncing Live
                  </span>
                ) : (
                  <span className="text-slate-400">Connecting...</span>
                )}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {timerStarted && isDriver && (
              <div className="flex items-center gap-3 px-4 py-2 bg-pastel-pink-light/50 rounded-2xl border-2 border-white shadow-sm animate-pulse-slow">
                <Clock size={20} className="text-pastel-pink-dark" />
                <div>
                  <p className="text-[10px] text-pastel-pink-dark font-black uppercase tracking-tighter">Waiting for Pay</p>
                  <p className={`text-lg font-black ${remainingTime < 60 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                    {formatTime(remainingTime)}
                  </p>
                </div>
              </div>
            )}
            {distance && (
              <div className="flex items-center gap-3 px-4 py-2 bg-pastel-mint-light/50 rounded-2xl border-2 border-white shadow-sm">
                <MapPin size={20} className="text-pastel-mint-dark" />
                <div>
                  <p className="text-[10px] text-pastel-mint-dark font-black uppercase tracking-tighter">Distance</p>
                  <p className="text-base font-black text-slate-800">{distance} km</p>
                </div>
              </div>
            )}
            {eta && (
              <div className="flex items-center gap-3 px-4 py-2 bg-pastel-lavender-light/50 rounded-2xl border-2 border-white shadow-sm">
                <Clock size={20} className="text-pastel-lavender-dark" />
                <div>
                  <p className="text-[10px] text-pastel-lavender-dark font-black uppercase tracking-tighter">ETA</p>
                  <p className="text-base font-black text-slate-800">{eta} mins</p>
                </div>
              </div>
            )}
            {isDriver && (
              <button
                onClick={trackingEnabled ? stopTracking : startTracking}
                aria-label={trackingEnabled ? 'Pause live location sharing' : 'Start live location sharing'}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black transition-all transform active:scale-95 shadow-sm ${
                  trackingEnabled
                    ? 'bg-white text-pastel-pink-dark border border-pastel-pink-light'
                    : 'bg-pastel-mint-dark text-white shadow-pastel-mint/20'
                }`}
              >
                {trackingEnabled ? 'Pause Sharing' : 'Go Live!'}
              </button>
            )}
            
            {/* Ride Completion Buttons */}
            {!driverCompleted && isDriver && (
              <button
                onClick={handleCompleteRide}
                disabled={completionLoading || !canMarkCompletion}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pastel-mint to-pastel-mint-dark text-slate-800 rounded-2xl font-black shadow-lg shadow-pastel-mint/30 hover:shadow-pastel-mint/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {completionLoading ? 'Processing...' : 'Drop Passenger'}
              </button>
            )}
            
            {!passengerCompleted && !isDriver && (
              <button
                onClick={handleCompleteRide}
                disabled={completionLoading || !canMarkCompletion}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pastel-lavender to-pastel-lavender-dark text-slate-800 rounded-2xl font-black shadow-lg shadow-pastel-lavender/30 hover:shadow-pastel-lavender/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {completionLoading ? 'Processing...' : 'Confirm Arrival'}
              </button>
            )}

            {distanceToDropKm !== null && !canMarkCompletion && (
              <div className="w-full sm:w-auto px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold">
                Move closer to destination ({distanceToDropKm.toFixed(2)} km away). Completion unlocks within 0.50 km.
              </div>
            )}

            {/* SOS Button */}
            <button
              type="button"
              onMouseDown={startSosHold}
              onMouseUp={cancelSosHold}
              onMouseLeave={cancelSosHold}
              onTouchStart={startSosHold}
              onTouchEnd={cancelSosHold}
              onTouchCancel={cancelSosHold}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (window.confirm('Trigger SOS emergency alert now?')) {
                    handleSos();
                  }
                }
              }}
              aria-label="Hold to trigger SOS emergency alert"
              className={`text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all ${
                sosHoldActive
                  ? 'bg-red-700 shadow-red-600/60 scale-95'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/50 animate-pulse'
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
              {sosHoldActive ? 'Hold...' : 'Hold SOS'}
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-[220px] md:pt-[100px]">
        <MapContainer
          center={mapCenter}
          zoom={15}
          className="h-full w-full z-0 saturate-[.8] contrast-[1.1]"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater center={mapCenter} />

          {/* Markers would benefit from custom pastel styles too */}
          {driverLocation && (
            <Marker
              position={[driverLocation.latitude, driverLocation.longitude]}
              icon={driverIcon}
            >
              <Popup className="pastel-popup">
                <div className="text-center p-2 font-black">
                  <p className="text-pastel-mint-dark">Active Runner</p>
                  <p className="text-[10px] text-slate-400 mt-1">{driverLocation.speed?.toFixed(1) || 0} km/h</p>
                </div>
              </Popup>
            </Marker>
          )}

          {pickupLocation && (
            <Marker
              position={[pickupLocation.latitude, pickupLocation.longitude]}
              icon={passengerIcon}
            >
              <Popup>
                <div className="text-center p-2 font-black">
                  <p className="text-pastel-lavender-dark">Meeting Point</p>
                </div>
              </Popup>
            </Marker>
          )}

          {driverLocation && pickupLocation && (
            <Polyline
              positions={[
                [driverLocation.latitude, driverLocation.longitude],
                [pickupLocation.latitude, pickupLocation.longitude]
              ]}
              color="#A8E6CF"
              weight={6}
              opacity={0.8}
              dashArray="1, 12"
              lineCap="round"
            />
          )}
        </MapContainer>
      </div>

      {/* Chat panel - Floating Glass Container */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 w-[94%] md:w-[420px] glass-morphism rounded-4xl shadow-pastel-shadow overflow-hidden z-20 flex flex-col max-h-[60vh] md:max-h-[650px] border-white ring-1 ring-white/20">
        {/* Vehicle Details Tab */}
        <div className="bg-gradient-to-r from-pastel-mint-dark to-pastel-mint px-6 py-5 text-slate-800">
          <h3 className="font-black mb-4 text-xs flex items-center gap-2 uppercase tracking-widest">
            <Car size={18} />
            Journey Mate Details
          </h3>
          {rideData?.driver?.vehicle || rideFullData?.vehicleInfo ? (
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-5 space-y-3 text-xs border border-white/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Vehicle:</span>
                <span className="font-black text-slate-800">{rideData?.driver?.vehicle || `${rideFullData?.vehicleInfo?.make || ''} ${rideFullData?.vehicleInfo?.model || ''}`}</span>
              </div>
              {rideFullData?.vehicleInfo?.licensePlate && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">Plate ID:</span>
                  <span className="font-mono font-black bg-pastel-yellow text-slate-800 px-3 py-1.5 rounded-xl shadow-inner">{rideFullData.vehicleInfo.licensePlate}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-400/10">
                {rideFullData?.vehicleInfo?.color && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white" 
                      style={{ backgroundColor: rideFullData.vehicleInfo.color.toLowerCase() }}
                    />
                    <span className="font-black text-slate-700 uppercase tracking-tighter">{rideFullData.vehicleInfo.color}</span>
                  </div>
                )}
                {rideFullData?.vehicleInfo?.acAvailable && (
                  <span className="bg-white/50 px-2 py-1 rounded-lg text-pastel-mint-dark font-black tracking-tighter">ICE COLD AC ❄️</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-slate-600 italic">Syncing vehicle details...</p>
          )}
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white/40">
          {/* Chat Header */}
          <div className="bg-white/60 px-6 py-4 border-b border-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pastel-mint-dark to-pastel-mint flex items-center justify-center text-slate-800 font-black text-lg shadow-sm">
                  {isDriver ? 'P' : 'D'}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {isDriver ? 'Passenger' : rideData?.driver?.name || 'Driver'}
                  </h3>
                  <p className="text-[10px] text-pastel-mint-dark font-black flex items-center gap-1 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-pastel-mint-dark rounded-full animate-pulse"></span>
                    Live Now
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-white/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-20 h-20 bg-pastel-cream rounded-full flex items-center justify-center mb-4 border border-white shadow-inner">
                  <User size={40} className="text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 font-black uppercase tracking-widest">Say Hello!</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">Start a cute conversation with {isDriver ? 'your mate' : 'your runner'}</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isCurrentUser = msg.userId === authService.getCurrentUser()?._id;
                return (
                  <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[80%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-3xl px-5 py-3 shadow-md ${
                        isCurrentUser 
                          ? 'bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender text-slate-800 rounded-br-none font-bold' 
                          : 'bg-white border border-white text-slate-700 rounded-bl-none font-medium'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${isCurrentUser ? 'text-slate-600/50' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-5 bg-white/60 backdrop-blur-md border-t border-white/50">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a cute message..."
                  className="w-full pl-6 pr-14 py-4 text-sm bg-white/80 border border-white rounded-3xl focus:outline-none focus:ring-4 focus:ring-pastel-mint-light/50 transition-all placeholder:text-slate-400 font-bold text-slate-800 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-gradient-to-br from-pastel-mint-dark to-pastel-mint hover:scale-105 disabled:grayscale disabled:opacity-50 text-slate-800 rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-pastel-mint/20 group transform active:scale-95"
                >
                  <Navigation size={20} className="rotate-90 group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
                </button>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-3 text-center font-black uppercase tracking-[.2em] opacity-50">
              End-to-End Pastel Encrypted
            </p>
          </form>
        </div>
      </div>

      {/* Payment Completion Modal */}
      <PaymentCompletionModal 
        isOpen={showPaymentModal}
        ride={rideFullData}
        totalAmount={rideFullData?.totalAmount || 0}
        onClose={() => {
          console.log('Payment modal closed by user');
          setShowPaymentModal(false);
        }}
        onSuccess={(paymentData) => {
          console.log('Payment success callback received:', paymentData);
          setShowPaymentModal(false);
          stopTracking();
          // Show success message
          alert('✅ Payment successful! Thank you for your payment.');
          // Redirect to payment history
          setTimeout(() => {
            onClose();
            navigate('/payment-history');
          }, 1500);
        }}
      />
    </div>
  );
}
