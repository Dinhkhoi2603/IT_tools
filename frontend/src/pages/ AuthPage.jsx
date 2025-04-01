import { useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import logo from "../assets/logo_it_tools.png";
import { FaGithub } from "react-icons/fa";
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const handleGitHubLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/github"; // 🔹 URL backend GitHub login
    };
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-yellow-100">
            {/* Logo */}
            <img
                src={logo}  // Cập nhật đường dẫn logo
                alt="Logo"
                className="w-16 h-16 mb-4"
            />

            {/* Form Container */}
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isLogin ? "Sign in " : "Create an Account"}
                </h2>

                {isLogin ? <Login /> : <Register />}

                {isLogin && (
                    <div className="flex justify-end mt-4">
                        <a href="#" className="text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                )}

                {/* Chuyển đổi giữa Đăng nhập & Đăng ký */}
                <p className="text-center mt-4">
                    {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                    </button>
                </p>

                {/* Divider */}
                {isLogin && (
                    <div className="flex items-center mt-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-500">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>)

                }

                {/* Nút Sign In / Sign Up */}
                {isLogin && (
                    <button
                        onClick={handleGitHubLogin}
                        className="w-full bg-gray-900 text-white py-2 rounded mt-4 hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                        <FaGithub size={20} /> Sign in with GitHub
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
