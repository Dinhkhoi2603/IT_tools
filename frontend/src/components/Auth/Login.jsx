import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
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
            setTimeout(() => navigate("/"), 1500);
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

            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-blue-600">
                Đăng Nhập
            </button>
        </form>
    );
};

export default Login;
