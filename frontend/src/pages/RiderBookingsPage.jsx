import React, { useEffect, useState } from "react";
import { MapPin, Clock, Users, IndianRupee, Navigation, Check, Loader2, CheckCircle, XCircle, Key } from "lucide-react";
import bookingService from "../api/bookingService";
import LiveTracking from "../components/LiveTracking";

export default function RiderBookingsPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingRide, setTrackingRide] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [pickupCode, setPickupCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getDriverBookings();
      setRides(res?.bookings || res?.data?.bookings || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load rider bookings", err);
      setError(err.response?.data?.message || "Failed to load rider bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const activeRides = rides.filter((r) => r.rideStatus !== "completed");

  const handleDriverComplete = async (rideId) => {
    if (!window.confirm("Mark this ride as completed from your side?")) return;
    setCompletingId(rideId);
    try {
      await bookingService.markCompletedByDriver(rideId);
      alert("Ride marked completed. Waiting for passengers to pay.");
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark ride complete");
    } finally {
      setCompletingId(null);
    }
  };

  const handleAcceptBooking = async (rideId, passengerId) => {
    try {
      const response = await bookingService.acceptBooking(rideId, passengerId);
      await fetchRides();
    } catch (err) {
      console.error("Failed to accept booking", err);
    }
  };

  const handleRejectBooking = async (rideId, passengerId) => {
    if (!window.confirm("Reject this booking request?")) return;
    try {
      await bookingService.rejectBooking(rideId, passengerId);
      await fetchRides();
    } catch (err) {
      console.error("Failed to reject booking", err);
    }
  };

  const handleVerifyPickup = async (rideId) => {
    if (!pickupCode.trim()) {
      alert("Please enter the ride code");
      return;
    }
    setVerifyingId(rideId);
    try {
      await bookingService.verifyPickupCode(rideId, pickupCode);
      setPickupCode("");
      setShowCodeInput(null);
      await fetchRides();
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerifyingId(null);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading rider bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Rider Bookings</h1>
        <p className="text-slate-500">View passengers for your rides, chat, track, and complete rides. Completed rides move to History of Rides.</p>
      </div>

      {activeRides.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-500">
          No rider bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {activeRides.map((ride) => {
            const totalSeatsBooked = (ride.passengers || []).reduce((sum, p) => sum + (p.seats || 0), 0);
            const totalAmount = (ride.pricePerSeat || 0) * totalSeatsBooked;
            return (
              <div key={ride.rideId} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-xs uppercase font-bold text-slate-500">Route</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {ride.startLocation?.address} {"->"} {ride.endLocation?.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-xs uppercase font-bold text-slate-500">Departure</p>
                        <p className="font-semibold text-slate-900">{formatDateTime(ride.departureTime)}</p>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    {ride.vehicleInfo && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-2">
                        <p className="text-xs uppercase font-bold text-blue-700 mb-2">🚗 Vehicle Details</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-slate-600">Model</p>
                            <p className="font-semibold text-slate-900">{ride.vehicleInfo.make} {ride.vehicleInfo.model}</p>
                          </div>
                          {ride.vehicleInfo.licensePlate && (
                            <div>
                              <p className="text-xs text-slate-600">License Plate</p>
                              <p className="font-mono font-bold bg-yellow-300 text-black px-2 py-1 rounded text-xs text-center">{ride.vehicleInfo.licensePlate}</p>
                            </div>
                          )}
                          {ride.vehicleInfo.color && (
                            <div>
                              <p className="text-xs text-slate-600">Color</p>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-slate-300" 
                                  style={{
                                    backgroundColor: ride.vehicleInfo.color.toLowerCase().includes('white') ? '#fff' :
                                      ride.vehicleInfo.color.toLowerCase().includes('black') ? '#000' :
                                      ride.vehicleInfo.color.toLowerCase().includes('red') ? '#ef4444' :
                                      ride.vehicleInfo.color.toLowerCase().includes('blue') ? '#3b82f6' :
                                      ride.vehicleInfo.color.toLowerCase().includes('silver') ? '#d1d5db' :
                                      ride.vehicleInfo.color.toLowerCase().includes('gray') ? '#6b7280' : '#ccc'
                                  }}
                                />
                                <span className="font-semibold text-slate-900">{ride.vehicleInfo.color}</span>
                              </div>
                            </div>
                          )}
                          {ride.vehicleInfo.year && (
                            <div>
                              <p className="text-xs text-slate-600">Year</p>
                              <p className="font-semibold text-slate-900">{ride.vehicleInfo.year}</p>
                            </div>
                          )}
                          {ride.vehicleInfo.fuelType && (
                            <div>
                              <p className="text-xs text-slate-600">Fuel Type</p>
                              <p className="font-semibold text-slate-900 capitalize">{ride.vehicleInfo.fuelType}</p>
                            </div>
                          )}
                          {ride.vehicleInfo.acAvailable && (
                            <div>
                              <p className="text-xs text-slate-600">AC</p>
                              <p className="font-semibold text-green-700">✓ Available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Users size={18} className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-xs uppercase font-bold text-slate-500">Passengers</p>
                        <div className="space-y-1 text-slate-800">
                          {(ride.passengers || []).length === 0 && <p className="text-slate-500 text-sm">No passengers yet</p>}
                          {(ride.passengers || []).map((p) => (
                            <div key={p.userId} className="flex items-center gap-3 text-sm bg-slate-50 px-3 py-2 rounded-xl">
                              <span className="font-semibold flex-1">{p.name || "Passenger"}</span>
                              <span className="text-slate-500">{p.seats || 0} seat(s)</span>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                p.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>{p.status}</span>
                              {p.status === 'pending' && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleAcceptBooking(ride.rideId, p.userId)}
                                    className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                    title="Accept"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectBooking(ride.rideId, p.userId)}
                                    className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pickup Verification Section */}
                    {ride.rideStatus === 'active' && !ride.pickupVerified && ride.passengers.some(p => p.status === 'accepted') && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-yellow-700 uppercase mb-2 flex items-center gap-1">
                          <Key size={14} /> Verify Pickup
                        </p>
                        {showCodeInput === ride.rideId ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={pickupCode}
                              onChange={(e) => setPickupCode(e.target.value)}
                              placeholder="Enter Ride Code"
                              className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerifyPickup(ride.rideId)}
                                disabled={verifyingId === ride.rideId}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                              >
                                {verifyingId === ride.rideId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Verify
                              </button>
                              <button
                                onClick={() => {
                                  setShowCodeInput(null);
                                  setPickupCode("");
                                }}
                                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowCodeInput(ride.rideId)}
                            className="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700"
                          >
                            Enter Ride Code
                          </button>
                        )}
                      </div>
                    )}

                    {ride.pickupVerified && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                        <CheckCircle size={18} className="text-blue-600" />
                        <p className="text-sm font-semibold text-blue-700">Pickup Verified</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 items-end">
                    <span className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600">
                      {ride.rideStatus}
                    </span>
                    <div className="flex items-center gap-1 text-slate-900">
                      <IndianRupee size={18} className="text-slate-400" />
                      <span className="text-xl font-bold">{ride.pricePerSeat}</span>
                      <span className="text-xs text-slate-500">/seat</span>
                    </div>
                    <p className="text-xs text-slate-500">Total seats booked: {totalSeatsBooked} | Est. amount: {totalAmount}</p>

                    <button
                      onClick={() => setTrackingRide({ ...ride, totalAmount })}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Navigation size={16} /> Track Ride
                    </button>

                    {ride.rideStatus === "in_progress" && (
                      <button
                        onClick={() => handleDriverComplete(ride.rideId)}
                        disabled={completingId === ride.rideId}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        {completingId === ride.rideId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {completingId === ride.rideId ? "Marking..." : "Ride Complete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {trackingRide && (
        <LiveTracking
          rideId={trackingRide.rideId}
          isDriver={true}
          pickupLocation={trackingRide.startLocation}
          dropLocation={trackingRide.endLocation}
          rideData={{
            driver: trackingRide.driver,
            totalAmount: trackingRide.totalAmount,
          }}
          onClose={() => setTrackingRide(null)}
        />
      )}
    </div>
  );
}
