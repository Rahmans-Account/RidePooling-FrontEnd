import React from "react";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import MyRidesPage from "./pages/MyRidesPage";
import OfferRide from "./pages/OfferRide";
import FindRide from "./FindingARide/FindRide";
import RideDetailsPage from "./FindingARide/RideDetailsPage";
import UserProfile from "./pages/UserProfile";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import RiderBookingsPage from "./pages/RiderBookingsPage";
import RideHistoryPage from "./pages/RideHistoryPage";
import Layout from "./components/Layout";
import "leaflet/dist/leaflet.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: "/bookings",
    element: (
      <Layout>
        <BookingsPage />
      </Layout>
    ),
  },
  {
    path: "/rider-bookings",
    element: (
      <Layout>
        <RiderBookingsPage />
      </Layout>
    ),
  },
  {
    path: "/my-rides",
    element: (
      <Layout>
        <MyRidesPage />
      </Layout>
    ),
  },
  {
    path: "/offer-ride",
    element: <OfferRide />,
  },
  {
    path: "/find-ride",
    element: <FindRide />,
  },
  {
    path: "/ride/:id",
    element: <RideDetailsPage />,
  },
  {
    path: "/user-profile",
    element: (
      <Layout>
        <UserProfile />
      </Layout>
    ),
  },
  {
    path: "/payment-history",
    element: (
      <Layout>
        <PaymentHistoryPage />
      </Layout>
    ),
  },
  {
    path: "/history",
    element: (
      <Layout>
        <RideHistoryPage />
      </Layout>
    ),
  },
]);

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
