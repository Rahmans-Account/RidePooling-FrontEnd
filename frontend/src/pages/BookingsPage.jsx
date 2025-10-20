import React, { useState } from "react";
import MyBookedRides from "../components/MyBookedRides"; // adjust path if needed
//Shows bookings
export default function BookingsPage() {
  // eslint-disable-next-line no-unused-vars
  const [bookings, setBookings] = useState([
    {
      ride: "Downtown → Airport",
      date: "Oct 26, 2023 at 8:00 AM",
      status: "Confirmed",
      driver: "John Doe",
    },
    {
      ride: "Midtown → Suburbs",
      date: "Oct 22, 2023 at 5:30 PM",
      status: "Completed",
      driver: "Jane Smith",
    },
    {
      ride: "Uptown → Downtown",
      date: "Oct 18, 2023 at 9:00 AM",
      status: "Cancelled",
      driver: "Sam Wilson",
    },
  ]);

  return (
    <>
      <MyBookedRides bookings={bookings} />;
    </>
  );
}
