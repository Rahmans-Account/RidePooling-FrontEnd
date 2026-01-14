import React from "react";

export default function MyRidesTable({ rides = [], onCancel }) {
  const canCancel = (ride) =>
    ride.status === "open" && new Date(ride.dateTime).getTime() > Date.now();

  const statusStyle = {
    open: "text-blue-600 bg-blue-100",
    completed: "text-green-600 bg-green-100",
    cancelled: "text-red-600 bg-red-100",
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Rides</h2>

      {rides.length === 0 ? (
        <p className="text-gray-500">No rides created yet.</p>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Route
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Seats
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rides.map((ride) => (
              <tr key={ride._id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {ride.origin.split(",")[0]} → {ride.destination.split(",")[0]}
                </td>
                <td className="px-6 py-4">
                  {new Date(ride.dateTime).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {ride.seatsTotal}/{ride.seatsTotal}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyle[ride.status]
                    }`}
                  >
                    {ride.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {canCancel(ride) ? (
                    <button
                      onClick={() => onCancel(ride._id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
