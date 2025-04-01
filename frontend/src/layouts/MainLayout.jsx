// src/layouts/MainLayout.jsx
import React, {useEffect, useState} from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import { getUserProfile } from "../services/authService";
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // mở sẵn
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userProfile = await getUserProfile();
            setUser(userProfile); // Cập nhật thông tin người dùng
        };

        fetchUserProfile();
    }, []);
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
        <Header toggleSidebar={toggleSidebar} userName={user}/>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F1F5F9] dark:bg-gray-800 p-6">
          
          <Outlet /> {/* Để render các route con */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
