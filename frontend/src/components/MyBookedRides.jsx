import React from "react";

//all of my prev Booked Rides component
export default function MyBookedRides({ bookings = [] }) {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">My Booked Rides</h2>
      <p className="text-gray-500 mb-6">
        View the rides you’ve booked and their current status.
      </p>

      {bookings.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  RIDE
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  DATE & TIME
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  STATUS
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  DRIVER
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((ride, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {ride.ride}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ride.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        ride.status
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{ride.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 mt-10 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16h8M8 12h8m-5 8h2a9 9 0 100-18h-2a9 9 0 100 18z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">
            No bookings found
          </p>
          <p className="text-gray-500">
            You haven’t booked any rides yet. Start exploring rides to book one!
          </p>
        </div>
      )}
    </div>
  );
}
