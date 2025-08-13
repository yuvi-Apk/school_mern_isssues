import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiFileText,
  FiDownload,
  FiAward,
  FiSettings,
  FiClock,
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const SidebarComponent = ({ collapsed, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#fff"
        width="100%"
        rootStyles={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRight: "none",
        }}
      >
        {/* Logo + Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                EduManage
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <IoIosArrowForward
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Menu */}
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  color: active ? "#3B82F6" : "#4B5563",
                  backgroundColor: active ? "#EFF6FF" : "transparent",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                };
            },
          }}
        >
          <MenuItem icon={<FiHome className="text-lg" />}>Dashboard</MenuItem>
          <SubMenu label="Academic" icon={<FiBook className="text-lg" />}>
            <MenuItem>Current Session</MenuItem>
            <MenuItem>Lesson Plan</MenuItem>
            <MenuItem>Class Management</MenuItem>
          </SubMenu>
          <SubMenu label="Finance" icon={<FiDollarSign className="text-lg" />}>
            <MenuItem>Collect Fee</MenuItem>
            <MenuItem>Demand Bill</MenuItem>
          </SubMenu>
          <MenuItem icon={<FiUsers />}>Student Management</MenuItem>
          <MenuItem icon={<FiFileText />}>Certificates</MenuItem>
          <MenuItem icon={<FiDownload />}>Downloads</MenuItem>
          <MenuItem icon={<FiAward />}>Staff Management</MenuItem>
          <MenuItem icon={<FiClock />}>User Log</MenuItem>
          <MenuItem icon={<FiSettings />}>Settings</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
