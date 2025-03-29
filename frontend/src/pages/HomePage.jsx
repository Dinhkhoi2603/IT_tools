// src/pages/HomePage.jsx
import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
// Thay đổi import
import { tools } from '../config/toolRegistry'; // Import danh sách tools đã xử lý

// --- Component ToolCard ---
const ToolCard = ({ tool }) => {
   const IconComponent = tool.icon;
   return (
      <Link to={tool.path} className="group block bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-start mb-3">
            {/* Sử dụng IconComponent từ tool.icon */}
            <div className="text-gray-400 dark:text-gray-500 group-hover:text-brand-green transition-colors">
               {IconComponent ? <IconComponent className="h-6 w-6"/> : <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>}
            </div>
            <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <HeartIcon className="h-5 w-5" />
            </button>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-brand-green transition-colors">{tool.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {tool.description || `Handy tool for various tasks.`}
        </p>
      </Link>
   );
}

// --- Component WelcomeBox & SponsorBox ---
// (Giữ nguyên)
const WelcomeBox = () => { /* ... */ };
const SponsorBox = () => { /* ... */ };


const HomePage = () => {
  // Không cần lọc lại, vì 'tools' từ registry đã là danh sách tool
  // const toolsList = toolsConfig.filter(item => item.type === 'tool');

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WelcomeBox />
        <SponsorBox />
      </div>

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">All the tools</h2>
      {/* Sử dụng trực tiếp mảng 'tools' từ registry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;