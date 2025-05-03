import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { categories } from "../../config/toolRegistry";
import { buildToolRegistry } from '../../config/toolRegistry';
import { ChevronRightIcon, FolderIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen }) => {
    console.log("Sidebar isOpen:", isOpen);
    const [openCategories, setOpenCategories] = useState({});
    const [toolsByCategory, setToolsByCategory] = useState({});

    const toggleCategory = (categoryId) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    useEffect(() => {
        const initializeTools = async () => {
            const { getToolsByCategory } = await buildToolRegistry();
            const tools = {};

            // Fetch tools for each category and store them in the state
            categories.forEach((category) => {
                tools[category.id] = getToolsByCategory(category.id);
            });

            setToolsByCategory(tools);
        };

        initializeTools();
    }, []);

    const sidebarClasses = `
    w-64 text-gray-700 dark:text-gray-300
    flex flex-col flex-shrink-0
    bg-white dark:bg-gray-800
    shadow-lg border-r border-gray-200 dark:border-gray-700
    fixed inset-y-0 left-0 z-30
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `;

    return (
        <aside className={sidebarClasses}>
            {/* Logo/Header */}
            <div className="h-16 flex items-center justify-center px-4 relative bg-[#39906F]">
                <Link to="/" className="text-2xl font-bold text-white">
                    IT - TOOLS
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {categories.map((category) => {
                    const childTools = toolsByCategory[category.id] || [];
                    const isCategoryOpen = openCategories[category.id] ?? false;
                    if (childTools.length === 0) return null;

                    return (
                        <div key={category.id}>
                            {/* Category Button */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none text-sm font-medium"
                            >
                <span className="flex items-center">
                  {category.icon ? (
                      <category.icon className="h-5 w-5 mr-2 opacity-80" />
                  ) : (
                      <FolderIcon className="h-5 w-5 mr-2 opacity-80" />
                  )}
                    {category.name}
                </span>
                                <span
                                    className={`transform transition-transform duration-150 ${isCategoryOpen ? "rotate-90" : ""}`}
                                >
                  <ChevronRightIcon className="h-4 w-4" />
                </span>
                            </button>

                            {/* Tool List */}
                            {isCategoryOpen && (
                                <div className="ml-4 pl-3 border-l border-gray-300 dark:border-gray-600 mt-1 space-y-1">
                                    {childTools.map((tool) => {
                                        const IconComponent = tool.icon;
                                        return (
                                            <NavLink
                                                key={tool.id}
                                                to={tool.path}
                                                className={({ isActive }) =>
                                                    `flex items-center px-3 py-1.5 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${
                                                        isActive
                                                            ? "bg-[#E7F5EE] text-green-800 dark:bg-gray-700 dark:text-white font-semibold"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }`
                                                }
                                            >
                                                {IconComponent && (
                                                    <IconComponent className="h-4 w-4 mr-2 opacity-70 flex-shrink-0" />
                                                )}
                                                {tool.name}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <p>IT-Tools v2024...</p>
                <p>© 2025 Corentin Thomasset</p>
            </div>
        </aside>
    );
};

export default Sidebar;
