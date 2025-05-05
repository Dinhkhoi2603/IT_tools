import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            localStorage.setItem("token", data.token);
            alert("Đăng nhập thành công!");

            // 🧩 Giải mã token để lấy role
            const decoded = jwtDecode(data.token);
            const role = decoded?.roles[0]; // tuỳ cấu trúc token của bạn

            console.log("🎯 Vai trò:", role);

            // 🚀 Điều hướng theo role
            if (role === "ROLE_ADMIN") {
                console.log("aaaaaaaaaaaaaaaaaa");
                navigate("/admin");
            } else {
                console.log("bbbbbbbbb");
                navigate("/"); // fallback
            }

        } catch (err) {
            setError("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700">Email or Username</label>
                <input
                    type="text"
                    placeholder="Email or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div>
                <label className="block text-gray-700">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {error && <p className="text-center text-red-500">{error}</p>}

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-800">
                Đăng Nhập
            </button>
        </form>
    );
};

export default Login;
