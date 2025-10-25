import React, { useState, useEffect } from "react";
import axios from "axios";
import MyRides from "../components/MyRides";

export default function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5003/api/rides", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(response.data.data || []);
      } catch (err) {
        console.error("Error fetching rides:", err);
        setError(err.response?.data?.error?.message || "Failed to load rides");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleCancel = async (rideId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/rides/${rideId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setRides((prev) =>
        prev.map((r) => (r._id === rideId ? { ...r, status: "Cancelled" } : r))
      );
    } catch (err) {
      console.error("Error cancelling ride:", err);
      alert(err.response?.data?.error?.message || "Failed to cancel ride");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading rides...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <MyRides rides={rides} onCancel={handleCancel} />
    </div>
  );
}
