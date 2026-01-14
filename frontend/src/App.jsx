import React from "react";
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
