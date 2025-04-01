import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FiUser, FiLogOut, FiSettings, FiHelpCircle, FiBarChart } from "react-icons/fi";

const Header = ({ toggleSidebar, userName, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const displayName = userName || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    window.location.href = "/login";
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
      <header className="h-16 bg-slate-100 dark:bg-gray-900 flex items-center px-4 sm:px-6 shadow-sm border-b border-slate-200 dark:border-gray-700">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
              onClick={toggleSidebar}
              className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
          >
            <HomeIcon className="h-6 w-6" />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow mx-4 hidden md:block">
          <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
            <input
                type="text"
                placeholder="Search tools (Ctrl+K)"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
        </div>

        {/* Right Side: User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* User Icon */}
          <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-4">
                  <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">{displayName}</p>
                  </div>
                </div>
                <hr className="border-gray-200 dark:border-gray-600" />

                {/* Menu Items */}
                <ul className="p-2 space-y-2">
                  <li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <FiUser /> <span>View Profile</span>
                  </li>
                  <li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <FiBarChart /> <span>Analytics & Data</span>
                  </li>
                  <li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <FiHelpCircle /> <span>Help Center</span>
                  </li>
                  <li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <FiSettings /> <span>Account Settings</span>
                  </li>
                </ul>

                <hr className="border-gray-200 dark:border-gray-600" />

                {/* Logout/Login */}
                <div className="p-2">
                  {userName ? (
                      <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <FiLogOut /> <span className="ml-2">Log Out</span>
                      </button>
                  ) : (
                      <Link
                          to="/login"
                          className="flex items-center w-full px-4 py-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <FiUser /> <span className="ml-2">Log In</span>
                      </Link>
                  )}
                </div>
              </div>
          )}
        </div>
      </header>
  );
};

export default Header;
