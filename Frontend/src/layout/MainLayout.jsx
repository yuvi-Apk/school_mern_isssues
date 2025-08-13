import React, { useState } from "react";
import SidebarComponent from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarComponent collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`flex flex-col w-full min-h-screen transition-all duration-300 ${
          collapsed ? "pl-20" : "pl-64"
        }`}
      >
        <Navbar />
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
