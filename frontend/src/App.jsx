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
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            color: '#1e293b',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            fontWeight: '900',
            fontFamily: 'Poppins',
          },
          success: {
            style: {
              background: '#A8E6CF',
              color: '#1e293b',
            },
          },
          error: {
            style: {
              background: '#FFD3B6',
              color: '#d14343',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
