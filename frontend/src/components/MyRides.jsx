import React from "react";

//All of my previous Rides component
export default function MyRides({ rides = [], onCancel }) {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "text-blue-600 bg-blue-100";
      case "full":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleCancel = (ride) => {
    if (
      window.confirm(`Are you sure you want to cancel the ride: ${ride.route}?`)
    ) {
      onCancel?.(ride);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">My Rides</h2>
      <p className="text-gray-500 mb-6">
        Manage your created rides and view passenger details.
      </p>

      {rides.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  ROUTE
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  DATE & TIME
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  SEATS
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  STATUS
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {ride.route}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ride.date}</td>
                  <td className="px-6 py-4 text-gray-600">{ride.seats}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        ride.status
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ride.status.toLowerCase() === "upcoming" && (
                      <button
                        onClick={() => handleCancel(ride)}
                        className="px-4 py-1.5 text-sm font-medium text-red-600 border border-red-500 rounded-full hover:bg-red-600 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
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
              d="M16 17a4 4 0 11-8 0m8 0a4 4 0 11-8 0m8 0H8m0 0v-3m8 3v-3m-4-4h.01M12 4.5A7.5 7.5 0 104.5 12 7.5 7.5 0 0012 4.5z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">
            No rides created yet
          </p>
          <p className="text-gray-500 mb-4">
            Get started by offering your first ride to the community.
          </p>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">
            + Offer a Ride
          </button>
        </div>
      )}
    </div>
  );
}
