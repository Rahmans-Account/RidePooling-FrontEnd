import React, { useState, useEffect } from "react";
import axios from "axios";
import MyBookedRides from "../components/MyBookedRides";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // assuming you store JWT here
        const response = await axios.get("http://localhost:5003/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Bookings fetched:", response.data);
        setBookings(response.data.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response?.data?.error?.message || "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <MyBookedRides bookings={bookings} />
    </div>
  );
}
