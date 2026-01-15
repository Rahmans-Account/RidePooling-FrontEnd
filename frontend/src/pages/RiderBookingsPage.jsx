import React, { useEffect, useState } from "react";
import { MapPin, Clock, Users, IndianRupee, Navigation, Check, Loader2 } from "lucide-react";
import bookingService from "../api/bookingService";
import LiveTracking from "../components/LiveTracking";

export default function RiderBookingsPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingRide, setTrackingRide] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getDriverBookings();
      setRides(res?.data?.bookings || []);
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
        <p className="text-slate-500">View passengers for your rides, chat, track, and complete rides.</p>
      </div>

      {rides.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-500">
          No rider bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => {
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
                          {ride.startLocation?.address} -> {ride.endLocation?.address}
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

                    <div className="flex items-start gap-3">
                      <Users size={18} className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-xs uppercase font-bold text-slate-500">Passengers</p>
                        <div className="space-y-1 text-slate-800">
                          {(ride.passengers || []).length === 0 && <p className="text-slate-500 text-sm">No passengers yet</p>}
                          {(ride.passengers || []).map((p) => (
                            <div key={p.userId} className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-xl">
                              <span className="font-semibold">{p.name || "Passenger"}</span>
                              <span className="text-slate-500">{p.seats || 0} seat(s)</span>
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">{p.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
