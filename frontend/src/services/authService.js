import axios from "axios";

const API_URL = "http://localhost:8080/auth";

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
            role: "USER" // Thêm role mặc định
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

