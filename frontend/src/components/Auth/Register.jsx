import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({}); // Lưu trạng thái lỗi của các ô nhập liệu
    const navigate = useNavigate();
    const validateForm = () => {
        let newErrors = {};

        if (!username) newErrors.username = "Vui lòng nhập tên đăng nhập";
        if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
        if (!confirmPassword) newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Nếu không có lỗi, form hợp lệ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Nếu có lỗi thì dừng submit

        try {
            await register(username, password);
            setMessage("Đăng ký thành công! Hãy đăng nhập.");
            setErrors({});
            setTimeout(() => navigate("/login"), 1500);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setMessage("Lỗi đăng ký, vui lòng thử lại!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên đăng nhập */}
            <div className="relative">
                <label className="block text-gray-700">Tên đăng nhập</label>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={`w-full p-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded`}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="relative">
                <label className="block text-gray-700">Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full p-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="relative">
                <label className="block text-gray-700">Nhập lại mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full p-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded`}
                />
                {errors.confirmPassword && (
                    <p className="absolute right-0 top-0 text-red-500 text-sm">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            {/* Hiển thị thông báo */}
            {message && (
                <p className={`text-center mt-2 ${password === confirmPassword ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            {/* Nút đăng ký */}
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
                Đăng Ký
            </button>
        </form>
    );
};

export default Register;
