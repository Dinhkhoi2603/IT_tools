
import React from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';

// Component chính của Tool
const TokenGenerator = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Token Generator</h2>
      {/* Nội dung của tool sẽ ở đây */}
      <p className="text-gray-600 dark:text-gray-400">Tool content goes here...</p>
    </div>
  );
};

// Metadata của Tool
export const toolMeta = {
  id: 'token-gen',                  // ID duy nhất cho tool
  name: 'Token Generator',          // Tên hiển thị trên sidebar và card
  description: 'Generate random strings, tokens, or passwords.', // Mô tả ngắn
  category: 'crypto',               // ID của category (phải khớp tên thư mục cha)
  path: '/tools/token-generator',   // Đường dẫn URL cho tool này
  icon: KeyIcon,                    // Component Icon (hoặc KeySvg nếu dùng SVG)
  // order: 1,                      // (Tùy chọn) Thứ tự hiển thị trong category
};

export default TokenGenerator; // Export component chính