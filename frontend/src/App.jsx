// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AuthPage from "./pages/ AuthPage.jsx";
// import LoginPage from './components/Auth/Login.jsx';
// import RegisterPage from './components/Auth/Register.jsx';

import { toolRoutes } from './config/toolRegistry';

// (Tùy chọn) Component trang 404
const NotFoundPage = () => (
    <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
    </div>
);


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes sử dụng MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* ---- Tự động tạo Route cho các tools ---- */}
          {toolRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* ----------------------------------------- */}

          {/* Các trang khác trong MainLayout nếu có */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>

        {/* Routes không sử dụng MainLayout */}
        <Route path="/login" element={<AuthPage />} />

        {/* Route mặc định hoặc trang 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;