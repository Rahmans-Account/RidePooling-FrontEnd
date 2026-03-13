import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-pastel-cream">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 bg-pastel-cream overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
