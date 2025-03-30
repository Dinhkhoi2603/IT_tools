// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // mở sẵn

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    // Giữ relative và flex
    <div className="relative flex h-screen bg-light-gray dark:bg-gray-800 overflow-hidden">
      {/* Sidebar vẫn được truyền isOpen */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* --- Khu vực nội dung chính --- */}
      {/* Thêm transition cho margin-left */}
      {/* Áp dụng margin-left động dựa trên isOpen */}
      <div
        className={`
            flex-1 flex flex-col overflow-hidden
            transition-[margin-left] duration-300 ease-in-out
            ${isSidebarOpen ? `ml-64` : "ml-0"}
          `}
      >
        {/* Header nhận toggleSidebar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F1F5F9] dark:bg-gray-800 p-6">
          
          <Outlet /> {/* Để render các route con */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
