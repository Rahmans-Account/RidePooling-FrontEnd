import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookingsPage from "./pages/BookingsPage";
import MyRidesPage from "./pages/MyRidesPage";
import OfferRide from "./pages/OfferRide";
import FindRide from "./FindingARide/FindRide";
import RideDetailsPage from "./FindingARide/RideDetailsPage";
import UserProfile from "./pages/UserProfile";
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
    path: "/profile",
    element: (
      <Layout>
        <Profile />
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
