import React from "react";
import MyRides from "../components/MyRides";
import { useState } from "react";

//shows all the past rides of user
export default function MyRidesPage() {
  const [rides, setRides] = useState([
    {
      route: "Downtown LA → Santa Monica",
      date: "Oct 26, 2023, 5:00 PM",
      seats: "2/4",
      status: "Upcoming",
    },
    {
      route: "Hollywood → Burbank",
      date: "Oct 28, 2023, 9:00 AM",
      seats: "4/4",
      status: "Full",
    },
    {
      route: "John Wayne Airport → Irvine",
      date: "Oct 22, 2023, 10:30 AM",
      seats: "3/3",
      status: "Completed",
    },
  ]);
  const handleCancel = (ride) => {
    setRides((prev) =>
      prev.map((r) =>
        r.route === ride.route ? { ...r, status: "Cancelled" } : r
      )
    );
  };
  return (
    <>
      <MyRides rides={rides} onCancel={handleCancel} />
    </>
  );
}
