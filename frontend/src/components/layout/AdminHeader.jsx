import React, { useEffect, useRef, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { getUserProfile } from '../../services/authService.js';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUsername] = useState(null);
    const dropdownRef = useRef(null); // 👉 Tham chiếu vùng dropdown

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userProfile = await getUserProfile();
            setUsername(userProfile.username);
        };
        fetchUserProfile();
    }, []);

    // 👉 Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-white hover:bg-blue-700 p-2 rounded-full"
                >
                    <div className="w-10 h-10 rounded-full bg-white p-1">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800">
                        <div className="flex items-center space-x-3 p-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="text-gray-900 dark:text-gray-100 font-semibold">{userName}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <FiLogOut /> <span className="ml-2">Log Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
