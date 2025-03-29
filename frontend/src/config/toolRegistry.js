import React from 'react'; // Cần nếu icon là React component

// 1. Định nghĩa Categories (vẫn cần định nghĩa thủ công để có tên và thứ tự)
// Bạn có thể thêm các thuộc tính khác như 'icon' cho category nếu muốn
export const categories = [
  { id: 'crypto', name: 'Crypto', order: 1 },
  { id: 'converter', name: 'Converter', order: 2 },
  { id: 'web', name: 'Web', order: 3 },
  { id: 'imgvid', name: 'Images & Videos', order: 4 },
  { id: 'dev', name: 'Development', order: 5 },
  { id: 'network', name: 'Network', order: 6 },
  { id: 'math', name: 'Math', order: 7 },
  { id: 'measure', name: 'Measurement', order: 8 },
  { id: 'text', name: 'Text', order: 9 },
  { id: 'data', name: 'Data', order: 10 },
].sort((a, b) => (a.order || 0) - (b.order || 0)); // Sắp xếp theo thứ tự

// 2. Sử dụng import.meta.glob để tìm tất cả các file tool
//    Pattern: Tìm file .jsx hoặc .tsx trong các thư mục con trực tiếp của /src/components/tools/
//    { eager: true } để import ngay lập tức. Bỏ đi nếu muốn lazy loading.
const toolModules = import.meta.glob('/src/components/tools/*/*.{jsx,tsx}', { eager: true });

// 3. Xử lý modules để tạo danh sách tools hoàn chỉnh
const discoveredTools = Object.entries(toolModules).map(([filePath, module]) => {
  if (module && module.toolMeta && module.default) {
    // Kiểm tra xem category trong meta có khớp với thư mục không (tùy chọn nhưng nên làm)
    const expectedCategory = filePath.split('/')[4]; // Lấy tên thư mục category
    if (module.toolMeta.category !== expectedCategory) {
       console.warn(`Tool at ${filePath} has category mismatch: expected '${expectedCategory}', found '${module.toolMeta.category}'.`);
       // return null; // Hoặc bỏ qua tool này nếu muốn chặt chẽ
    }

    return {
      ...module.toolMeta, // Lấy metadata từ toolMeta
      component: module.default, // Lấy component từ default export
    };
  }
  console.warn(`Tool file at ${filePath} is missing 'toolMeta' or default export.`);
  return null;
}).filter(Boolean); // Lọc bỏ những entry null (file không hợp lệ)

// 4. Sắp xếp tools (ví dụ: theo thứ tự trong category nếu có, hoặc theo tên)
export const tools = discoveredTools.sort((a, b) => {
   // Ưu tiên sắp xếp theo order nếu có, sau đó theo tên
   const orderDiff = (a.order || 0) - (b.order || 0);
   if (orderDiff !== 0) return orderDiff;
   return a.name.localeCompare(b.name);
});

// 5. Hàm tiện ích để lấy tools theo category (dùng cho Sidebar)
export const getToolsByCategory = (categoryId) => {
  return tools.filter(tool => tool.category === categoryId);
  // Không cần sắp xếp lại ở đây vì mảng `tools` đã được sắp xếp
};

// 6. Tạo danh sách các route để dùng trong Router
export const toolRoutes = tools.map(tool => ({
  path: tool.path,
  // Sử dụng React.lazy nếu không dùng eager: true ở trên
  // element: <React.Suspense fallback={<div>Loading...</div>}><tool.component /></React.Suspense>
  element: React.createElement(tool.component) // Dùng createElement khi import eager
}));

// Log để kiểm tra (chỉ chạy ở client/browser console)
if (import.meta.env.DEV) {
    console.log("Discovered Categories:", categories);
    console.log("Discovered Tools:", tools);
    console.log("Generated Tool Routes:", toolRoutes);
}