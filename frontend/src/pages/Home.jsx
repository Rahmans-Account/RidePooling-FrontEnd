import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FFF8EE]/95 backdrop-blur-sm flex items-center justify-between px-6 sm:px-10 py-4 border-b border-slate-200 transition-shadow shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full">
            C
          </div>
          <span className="font-semibold text-lg text-slate-900">
            Ride Pooling
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* subtle separator under navbar for a smooth partition */}
      <div className="h-3 pointer-events-none -mt-1 bg-gradient-to-b from-[#FFF8EE]/95 to-transparent" />

      {/* Hero */}
      <main className="max-w-5xl mx-auto text-center px-6 pt-24 pb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
          Smart Ridepooling for <br className="hidden sm:block" /> Smarter
          Commutes.
        </h1>

        <p className="mt-6 text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
          A modern, minimal, mobile-first ridepooling web app designed to make
          your daily travel efficient and enjoyable.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-transform"
          >
            Find a Ride
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-transform"
          >
            Offer a Ride
          </Link>
        </div>

        {/* Image card (replace svg with <img src='/hero.jpg'/> if you have image in public/) */}
        <div className="mt-12 flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center">
            <img
              src="/img.png"
              alt="Ridepooling illustration"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          <div className="flex justify-center gap-10 text-sm text-slate-500">
            <a className="hover:text-indigo-600 transition" href="#">
              About
            </a>
            <a className="hover:text-indigo-600 transition" href="#">
              Contact
            </a>
          </div>
          <div className="mt-8 text-slate-400 text-sm">© 2023 CommuteSync</div>
        </div>
      </main>

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow">
          ✋
        </button>
        <button className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
          ↗
        </button>
      </div>
    </div>
  );
}
