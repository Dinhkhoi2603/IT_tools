// src/components/layout/Header.jsx
import React from "react";
// Import Link từ react-router-dom
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Nhận prop toggleSidebar từ MainLayout
const Header = ({ toggleSidebar }) => {
  // Logic khác (theme, language) sẽ thêm sau

  return (
    // Sử dụng bg-slate-100 tương đương #F1F5F9
    <header className="h-16 bg-slate-100 dark:bg-gray-900 flex items-center px-4 sm:px-6 shadow-sm border-b border-slate-200 dark:border-gray-700">
      {/* Left Side: Burger Menu (Mobile) & Home Button (Desktop) */}
      <div className="flex items-center gap-4">
        {/* Burger Menu - Chỉ hiện trên mobile (< lg), gọi toggleSidebar */}
        <button
          onClick={toggleSidebar}
          // !!! Xóa class lg:hidden ở đây !!!
          className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Home Button - Luôn hiển thị, dùng Link */}
        {/* !!! Xóa class hidden và lg:block ở đây !!! */}
        <Link
          to="/"
          className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
        >
          <HomeIcon className="h-6 w-6" />
        </Link>
      </div>

      {/* Center: Search Bar (Fills space) */}
      {/* Thêm flex-grow để thanh search chiếm không gian còn lại */}
      {/* Thêm mx-4 để tạo khoảng cách với các phần tử khác */}
      <div className="flex-grow mx-4 hidden md:block">
        {" "}
        {/* Ẩn trên màn hình rất nhỏ nếu muốn */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {" "}
            {/* Thêm pointer-events-none */}
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search tools (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          />
        </div>
      </div>

      {/* Right Side: Auth Buttons & User Icon */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Nút Đăng nhập */}
        <Link
          to="/login"
          className="text-sm font-medium text-gray-600 hover:text-brand-green dark:text-gray-300 dark:hover:text-green-400 transition-colors px-2 py-1" // Thêm padding nhỏ
        >
          Login
        </Link>

        {/* Nút Đăng ký */}
        <Link
          to="/register"
          className="text-sm font-medium text-[#39906F] bg-brand-green hover:bg-brand-green-dark px-3 py-1.5 rounded-md transition-colors"
        >
          Register
        </Link>

        {/* User Icon (Placeholder) */}
        <button className="text-gray-500 dark:text-gray-400 hidden sm:block">
          {" "}
          {/* Ẩn trên màn hình quá nhỏ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
