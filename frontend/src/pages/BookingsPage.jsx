import React, { useState, useEffect } from "react";
import MyBookedRides from "../components/MyBookedRides";
import bookingService from "../api/bookingService";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        console.log("Bookings fetched:", response);
        setBookings(response.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response?.data?.message || "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (rideId) => {
    try {
      await bookingService.cancelBooking(rideId);
      setBookings(bookings.filter(b => b._id !== rideId));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <MyBookedRides bookings={bookings} onCancelBooking={handleCancelBooking} />
    </div>
  );
}
