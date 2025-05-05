import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/layout/AdminHeader';
import Footer from '../components/layout/AdminFooter';

const AdminPage = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [pendingAction, setPendingAction] = useState(null);

    const token = localStorage.getItem('token');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTool, setNewTool] = useState({
        name: '',
        category: '',
        description: '',
        path: '',
        order: 1,
        enabled: false,
        premium: false,
        _class: 'com.example.it_tools.model.Tool'
    });
    const generatePath = (name, category) => {
        const formattedName = name.toLowerCase().replace(/\s+/g, '-'); // Chuyển name thành chữ thường và thay thế khoảng trắng bằng dấu gạch
        const formattedCategory = category.toLowerCase(); // Chuyển category thành chữ thường
        return `/tools/${formattedCategory}/${formattedName}`;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTool((prevTool) => {
            const updatedTool = { ...prevTool, [name]: value };

            // Cập nhật path khi name hoặc category thay đổi
            if (name === 'name' || name === 'category') {
                updatedTool.path = generatePath(updatedTool.name, updatedTool.category);
            }

            return updatedTool;
        });
    };
    const handleAddTool = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/tools', newTool, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTools(prev => [...prev, res.data]);
            triggerNotification('Thêm tool thành công!');
            setShowAddModal(false);
            setNewTool({ name: '', category: '', enabled: false, premium: false });
        } catch (err) {
            console.error('Add tool failed:', err);
            triggerNotification('Thêm tool thất bại!');
        }
    };
    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/tools', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTools(res.data);
        } catch (err) {
            console.error('Failed to fetch tools:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (toolId, field, value) => {
        const label = field === 'enabled' ? 'kích hoạt' : 'chuyển sang Premium';
        setConfirmMessage(`Bạn có chắc chắn muốn ${label} công cụ này không?`);
        setPendingAction(() => () => confirmToggle(toolId, field, value));
        setShowConfirm(true);
    };

    const confirmToggle = async (toolId, field, value) => {
        try {
            const updatedTool = tools.find(tool => tool.toolId === toolId);
            if (!updatedTool) return;

            const payload = {
                enabled: field === 'enabled' ? value : updatedTool.enabled,
                premium: field === 'premium' ? value : updatedTool.premium,
            };

            await axios.post(
                `http://localhost:8080/api/tools/${toolId}/toggle`,
                {},
                {
                    params: payload,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTools(prev =>
                prev.map(t =>
                    t.toolId === toolId ? { ...t, [field]: value } : t
                )
            );

            triggerNotification('Thay đổi trạng thái thành công!');
        } catch (err) {
            console.error('Update failed:', err);
            triggerNotification('Cập nhật thất bại!');
        }
    };

    const triggerNotification = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    };
    const handleDelete = async (toolId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tools/${toolId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTools(prev => prev.filter(t => t.toolId !== toolId));
            triggerNotification('Xóa công cụ thành công!');
        } catch (err) {
            console.error('Delete failed:', err);
            triggerNotification('Xóa công cụ thất bại!');
        }
    };


    const confirmYes = () => {
        if (pendingAction) pendingAction();
        setShowConfirm(false);
    };

    const confirmNo = () => {
        setShowConfirm(false);
    };

    if (loading) return <div className="p-4">Đang tải...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Tool Management</h2>
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Thêm tool
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Tên Tool</th>
                            <th className="px-4 py-2 border">Category</th> {/* Thêm cột Category */}
                            <th className="px-4 py-2 border">Enabled</th>
                            <th className="px-4 py-2 border">Premium</th>
                            <th className="px-4 py-2 border">Xóa</th>

                        </tr>
                        </thead>
                        <tbody>
                        {tools.map(tool => (
                            <tr key={tool.toolId} className="text-center">
                                <td className="px-4 py-2 border">{tool.name}</td>
                                <td className="px-4 py-2 border">{tool.category}</td> {/* Hiển thị Category */}
                                <td className="px-4 py-2 border">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={tool.enabled}
                                            onChange={(e) =>
                                                handleToggle(tool.toolId, 'enabled', e.target.checked)
                                            }
                                        />
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${tool.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transform transition-transform duration-200 ease-in-out ${tool.enabled ? 'translate-x-full' : ''}`} />
                                        </div>
                                    </label>
                                </td>
                                <td className="px-4 py-2 border">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={tool.premium}
                                            onChange={(e) =>
                                                handleToggle(tool.toolId, 'premium', e.target.checked)
                                            }
                                        />
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${tool.premium ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transform transition-transform duration-200 ease-in-out ${tool.premium ? 'translate-x-full' : ''}`} />
                                        </div>
                                    </label>
                                </td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => {
                                            setConfirmMessage('Bạn có chắc chắn muốn xóa công cụ này không?');
                                            setPendingAction(() => () => handleDelete(tool.toolId));
                                            setShowConfirm(true);
                                        }}
                                        className="text-red-600 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </td>


                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />

            {/* Modal xác nhận */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg px-6 py-5 w-full max-w-md animate-fade-in">
                        <p className="text-gray-800 font-semibold text-base mb-4">{confirmMessage}</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={confirmNo}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmYes}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thông báo */}
            {showNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg animate-fade-in">
                        <p className="text-base font-semibold text-gray-800">{notificationMessage}</p>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg px-6 py-5 w-full max-w-md animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4">Thêm Tool Mới</h3>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tool</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Tên tool"
                                value={newTool.name}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={newTool.category}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTool.description}
                                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newTool.enabled}
                                        onChange={(e) => setNewTool({ ...newTool, enabled: e.target.checked })}
                                    />
                                    Enabled
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newTool.premium}
                                        onChange={(e) => setNewTool({ ...newTool, premium: e.target.checked })}
                                    />
                                    Premium
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddTool}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Tạo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPage;
