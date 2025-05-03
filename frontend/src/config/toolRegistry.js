import React from 'react';

// Định nghĩa Categories và các phần khác
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

// Tìm tất cả các file tool
const toolModules = import.meta.glob('/src/components/tools/*/*.{jsx,tsx}', { eager: true });

async function fetchEnabledToolIds(token) {
    try {
        const res = await fetch('http://localhost:8080/api/tools', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json(); // [{ id, enabled }]
        return data.filter(tool => tool.enabled).map(tool => tool.path); // Lấy danh sách toolId được bật
    } catch (err) {
        console.error('Failed to fetch tool registry:', err);
        return []; // fallback: không có tool nào
    }
}

// Khởi tạo tools ngay khi module được import
export async function buildToolRegistry() {
    const token = localStorage.getItem('token');
    const enabledToolIds = await fetchEnabledToolIds(token);
    const discoveredTools = Object.entries(toolModules).map(([filePath, module]) => {
        const path = module.toolMeta.path;
        if (!enabledToolIds.includes(path))
        {
            console.log(1);
            return null;
        }
        if (module && module.toolMeta && module.default) {

            const expectedCategory = filePath.split('/')[4]; // Lấy tên thư mục category
            if (module.toolMeta.category !== expectedCategory) {
                console.warn(`Tool at ${filePath} has category mismatch: expected '${expectedCategory}', found '${module.toolMeta.category}'.`);
            }

            return {
                ...module.toolMeta,
                component: module.default, // Lấy component từ default export
            };
        }
        console.warn(`Tool file at ${filePath} is missing 'toolMeta' or default export.`);
        return null;
    }).filter(Boolean); // Lọc bỏ những entry null (file không hợp lệ)

    const tools = discoveredTools.sort((a, b) => {
        const orderDiff = (a.order || 0) - (b.order || 0);
        if (orderDiff !== 0) return orderDiff;
        return a.name.localeCompare(b.name);
    });

    const getToolsByCategory = (categoryId) => {
        return tools.filter(tool => tool.category === categoryId);
    };

    const toolRoutes = tools.map(tool => ({
        path: tool.path,
        element: React.createElement(tool.component) // Dùng createElement khi import eager
    }));

    // Trả về các giá trị đã khởi tạo
    return { tools, toolRoutes, getToolsByCategory };
}

