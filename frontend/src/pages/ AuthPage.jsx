import { useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import logo from "../assets/logo_it_tools.png";
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

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

                {/* Stay signed in & Forgot password */}
                {isLogin && (
                    <div className="flex justify-between items-center mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Stay signed in
                        </label>
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
                <div className="flex items-center mt-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-500">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Nút Sign In / Sign Up */}
                <button className="w-full bg-orange-500 text-white py-2 rounded mt-4 hover:bg-orange-600">
                    {isLogin ? "Sign In" : "Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
