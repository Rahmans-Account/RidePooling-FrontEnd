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
import { AuthProvider } from "./context/AuthContext";

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
    element: (
      <Layout>
        <OfferRide />
      </Layout>
    ),
  },
  {
    path: "/find-ride",
    element: (
      <Layout>
        <FindRide />
      </Layout>
    ),
  },
  {
    path: "/ride/:id",
    element: (
      <Layout>
        <RideDetailsPage />
      </Layout>
    ),
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
    <AuthProvider>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            color: '#1E1A34',
            borderRadius: '28px',
            boxShadow: '0 12px 36px rgba(30, 26, 52, 0.08)',
            border: '1px solid rgba(30, 26, 52, 0.08)',
            fontSize: '14px',
            fontWeight: '800',
            fontFamily: 'Poppins',
          },
          success: {
            style: {
              background: '#D0F2E5',
              color: '#1E1A34',
            },
          },
          error: {
            style: {
              background: '#FCE1E4',
              color: '#1E1A34',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
