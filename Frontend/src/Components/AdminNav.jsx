import React, { useState } from "react";
import {
  FaSearch,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNav = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "branch",
      label: "Branch",
      icon: <FaUserGraduate className="mr-1" />,
      options: [
        { label: "Admission", path: "/Admission" },
        { label: "Create-Fees-Heading", path: "/Create-Fees-Heading" },
        { label: "Fees-Receipt", path: "/Fees-Receipt" },
        { label: "fees_Register", path: "/fees_Register" },
        { label: "create", path: "/create" },
       
        { label: "ConfigueFee", path: "/ConfigueFee" },
        { label: "FeesHeadWiseCollection", path: "/FeesHeadWiseCollection" },
      ],
    },
    {
      id: "student",
      label: "Student System",
      icon: <FaUserGraduate className="mr-1" />,
      options: [
        { label: "Std-Attendance", path: "/Std-Attendance" },
        
        { label: "accounts", path: "/accounts" },
        { label: "Create-Fees-Heading", path: "/Create-Fees-Heading" },
        { label: "Create-Account", path: "/Create-Account" },
        { label: "routes", path: "/routes" },
        { label: "apply-Routes", path: "/apply-Routes" },
        { label: "section-manager", path: "/section-manager" },
        { label: "searchStudent", path: "/searchStudent" },
        { label: "students/:id", path: "/students/:id" },
        { label: "class-manager", path: "/class-manager" },
        { label: "attendance-criteria", path: "/attendance-criteria" },
        { label: "PaymentDetailsTable", path: "/PaymentDetailsTable" },
        { label: "Vehicle", path: "/attendance" },
        { label: "Assign Vehicle", path: "/add-student" },
        { label: "Assign Hostel", path: "/view-students" },
        { label: "Room Type", path: "/student-reports" },
        { label: "Design Student Certificate", path: "/attendance" },
        { label: "Design Students ID Card", path: "/attendance" },
      ],
    },
    {
      id: "exam",
      label: "Examination",
      icon: <FaClipboardList className="mr-1" />,
      options: [
        { label: "Create Exam", path: "/create-exam" },
        { label: "Exam Schedule", path: "/exam-schedule" },
        { label: "Results", path: "/results" },
        { label: "Gradebook", path: "/gradebook" },
      ],
    },
    {
      id: "settings",
      label: "System Settings",
      icon: <FaCog className="mr-1" />,
      options: [
        { label: "General Setting", path: "/user-management" },
        { label: "Session Setting", path: "/system-config" },
        { label: "Notification Setting", path: "/backup" },
        { label: "SMS Setting", path: "/preferences" },
        { label: "Email Setting", path: "/user-management" },
        { label: "Payment Methods", path: "/system-config" },
        { label: "Print Header Footer", path: "/backup" },
        { label: "From CMS Setting", path: "/preferences" },
        { label: "Role Permission", path: "/user-management" },
        { label: "Language", path: "/system-config" },
        { label: "Users", path: "/backup" },
        { label: "Modules", path: "/preferences" },
        { label: "Custom Fields", path: "/backup" },
        { label: "Captcha Setting", path: "/preferences" },
        { label: "System Field", path: "/user-management" },
        { label: "Online Admission", path: "/system-config" },
        { label: "File types", path: "/backup" },
      ],
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <nav className="bg-white text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="ml-2 text-xl rounded-sm text-white font-bold font-sans bg-blue-600 px-2 py-1 select-none">
              SchoolSys
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none select-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search student by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </form>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          <div className="hidden md:flex space-x-2">
            {menuItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`px-2 py-1 rounded-md text-sm font-medium flex items-center bg-blue-600 text-white hover:bg-blue-900`}
                >
                  {item.icon}
                  {item.label}
                </button>

                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-blue-400 ring-opacity-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="py-1 select-none">
                    {item.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(option.path)}
                        className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-gray-100 select-none"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search student by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 select-none"
              />
            </form>
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`select-none w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
                    activeMenu === item.id
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                  <svg
                    className={`h-5 w-5 transform ${
                      activeMenu === item.id ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {activeMenu === item.id && (
                  <div className="py-1 select-none">
                    {item.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate(option.path);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 select-none"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
