import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FiUser, FiLogOut, FiSettings, FiHelpCircle, FiBarChart } from "react-icons/fi";
import { buildToolRegistry } from "../../config/toolRegistry";
import {FaCrown} from "react-icons/fa"; // Import tools directly from registry
import { upgradeToPremium } from "../../services/authService.js";
import { toast } from "react-toastify";
const Header = ({ toggleSidebar, userName, isPremium, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [tools, setTools] = useState([]);
  const displayName = userName || "User";
  const token = localStorage.getItem('token');
  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Perform the search using the tools from toolRegistry
    setIsSearching(true);
    performSearch(query);
  };

  // Perform search against tools
  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();
    
    // Filter tools based on search query
    const results = tools.filter(tool => {
      return (
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        (tool.description && tool.description.toLowerCase().includes(lowercaseQuery)) ||
        (tool.category && tool.category.toLowerCase().includes(lowercaseQuery))
      );
    });
    
    setSearchResults(results);
    setSelectedResultIndex(-1); // Reset selection when results change
  };
  useEffect(() => {
    const initializeTools = async () => {
      const { tools} = await buildToolRegistry();
      setTools(tools);
    };

    initializeTools();
  }, []);
  // Handle click outside of search results to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearching(false);
      }
    }
    if (isSearching) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearching]);

  // Keyboard shortcut (Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Command+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current.focus();
        setIsSearching(true);
      }
      
      // Handle escape key to close search
      if (e.key === 'Escape' && isSearching) {
        setIsSearching(false);
        searchInputRef.current.blur();
      }
      
      // Handle arrow keys for navigation in search results
      if (isSearching && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedResultIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
        } else if (e.key === 'Enter' && selectedResultIndex >= 0) {
          e.preventDefault();
          navigateToTool(searchResults[selectedResultIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearching, searchResults, selectedResultIndex]);

  // Navigate to a tool
  const navigateToTool = (tool) => {
    setIsSearching(false);
    setSearchQuery("");
    navigate(tool.path);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearching(true);
    if (searchQuery.trim() !== "") {
      performSearch(searchQuery);
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    window.location.href = "/login";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get the category name for a tool
  // const getCategoryName = (categoryId) => {
  //   const category = categories.find(cat => cat.id === categoryId);
  //   return category ? category.name : categoryId;
  // };
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };
  const handleUpgradePremium = async () => {
    try {
      // Gọi hàm nâng cấp lên Premium
      const upgradedUser = await upgradeToPremium();
      if (upgradedUser) {
        console.log("Người dùng đã nâng cấp lên Premium thành công:", upgradedUser);
        setShowUpgradeModal(false);
        toast.success("🎉 Bạn đã nâng cấp lên Premium thành công!");
        window.location.reload();// Đóng modal sau khi nâng cấp thành công
        // Cập nhật UI nếu cần (ví dụ: thay đổi trạng thái người dùng, hiển thị thông báo, ...)
      }
    } catch (error) {
      console.error("Lỗi khi nâng cấp lên Premium:", error);
    }
  };
  return (
    <header className="h-16 bg-slate-100 dark:bg-gray-900 flex items-center px-4 sm:px-6 shadow-sm border-b border-slate-200 dark:border-gray-700">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <Link
          to="/"
          className="text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-green-400 transition-colors"
        >
          <HomeIcon className="h-6 w-6" />
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-grow mx-4 hidden md:block relative">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tools (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearching && (
          <div 
            ref={searchResultsRef}
            className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-[60vh] overflow-y-auto"
          >
            {searchResults.length > 0 ? (
              <ul className="py-2">
                {searchResults.map((tool, index) => (
                  <li 
                    key={tool.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      index === selectedResultIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => navigateToTool(tool)}
                    onMouseEnter={() => setSelectedResultIndex(index)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-gray-400">
                        {/* If icon is available, we could render it here */}
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tool.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {tool.description}
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          Category: {tool.category}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchQuery ? "No tools found matching your search" : "Type to search for tools"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side: User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* User Icon */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{displayName}</p>
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />

            {/* Menu Items */}
            <ul className="p-2 space-y-2">
              {/*<li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">*/}
              {/*  <FiUser /> <span>View Profile</span>*/}
              {/*</li>*/}
              {/*<li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">*/}
              {/*  <FiBarChart /> <span>Analytics & Data</span>*/}
              {/*</li>*/}
              {/*<li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">*/}
              {/*  <FiHelpCircle /> <span>Help Center</span>*/}
              {/*</li>*/}
              {/*<li className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">*/}
              {/*  <FiSettings /> <span>Account Settings</span>*/}
              {/*</li>*/}

              {/* Premium Section */}
              {token && (
              <li className="flex items-center space-x-3 px-4 py-2 rounded-lg">
                {isPremium ? (
                    <div className="flex items-center text-yellow-500 font-semibold">
                      <FaCrown className="mr-2" />
                      <span>Premium</span>
                    </div>
                ) : (
                    <button
                        onClick={handleUpgradeClick}
                        className="text-blue-600 hover:underline"
                    >
                      Nâng cấp lên Premium
                    </button>
                )}
              </li>
              )}
            </ul>
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        onClick={() => setShowUpgradeModal(false)}
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Nâng cấp Premium</h2>
                    <p className="mb-4">Hãy nâng cấp tài khoản của bạn để truy cập tính năng cao cấp.</p>
                  <button
                      onClick={handleUpgradePremium}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Nâng cấp ngay
                  </button>
                  </div>
                </div>
            )}
            <hr className="border-gray-200 dark:border-gray-600" />

            {/* Logout/Login */}
            <div className="p-2">
              {userName ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiLogOut /> <span className="ml-2">Log Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center w-full px-4 py-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiUser /> <span className="ml-2">Log In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;