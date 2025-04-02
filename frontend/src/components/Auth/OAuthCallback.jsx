import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        console.log(token);
        if (token) {
            localStorage.setItem("token", token);
            navigate("/"); // Chuyển hướng về trang chính sau khi lưu token
        } else {
            navigate("/"); // Nếu không có token, quay về trang đăng nhập
        }
    }, [navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default OAuthCallback;
