import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-col flex-1">
        <TopBar />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
