import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost:8080/auth";
const USER_API_URL = "http://localhost:8080/user";
export const login = async (username, password) => {
    try {
        const requestData = JSON.stringify({ username, password });
        console.log("🔵 Login Request Data:", requestData); // Log dữ liệu gửi đi

        const response = await axios.post(`${API_URL}/login`, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("🟢 Login Response:", response.data); // Log dữ liệu trả về từ server
        return response.data;
    } catch (error) {
        console.error("🔴 Login Error:", error.response ? error.response.data : error);
        throw error.response ? error.response.data : error;
    }
};

export const register = async (username, password) => {
    try {
        const requestData = JSON.stringify({
            username,
            password,
            role: "USER",
            isPremium:"false"
        });

        console.log("🔵 Register Request Data:", requestData); // Log dữ liệu gửi đi

        const response = await axios.post(`${API_URL}/register`, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("🟢 Register Response:", response.data); // Log dữ liệu trả về từ server
        return response.data;
    } catch (error) {
        console.error("🔴 Register Error:", error.response ? error.response.data : error);
        throw error.response ? error.response.data : error;
    }
};
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return null; // Không có token, trả về null
        }

        const response = await axios.get(`${USER_API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Trả về thông tin người dùng
    } catch (error) {
        console.error("🔴 Get User Profile Error:", error.response ? error.response.data : error);
        return null;
    }
};
export const upgradeToPremium = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Token không tồn tại.");
            return null; // Nếu không có token, không thể thực hiện nâng cấp
        }

        // Gửi yêu cầu PUT để nâng cấp lên Premium
        const response = await axios.put(`${USER_API_URL}/upgrade-to-premium`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("🟢 Upgrade to Premium Response:", response.data); // Log dữ liệu trả về từ server
        return response.data; // Trả về dữ liệu người dùng đã được cập nhật
    } catch (error) {
        console.error("🔴 Upgrade to Premium Error:", error.response ? error.response.data : error);
        throw error.response ? error.response.data : error;
    }
};

/**
 * Đăng xuất người dùng (Xóa token khỏi localStorage)
 */
export const logout = () => {
    localStorage.removeItem("token");
};
export const extractRoleFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.role || decoded.roles || null; // tùy vào cấu trúc token trả về
    } catch (err) {
        console.error("❌ Lỗi giải mã token:", err);
        return null;
    }
};


