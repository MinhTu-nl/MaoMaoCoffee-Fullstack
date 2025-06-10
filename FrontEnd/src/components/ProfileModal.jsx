import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import axios from 'axios';
import { assets } from '../assets/assets';

const ProfileModal = ({ show, handleClose }) => {
    const { token, backendURL, currency } = useContext(ShopContext);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && token) {
            // Fetch user profile data
            const fetchProfileData = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(backendURL + `/api/user/get`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.data.success) {
                        setProfileData(response.data.data);
                        setError(null);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setError('Không thể tải thông tin người dùng');
                } finally {
                    setLoading(false);
                }
            };

            // Fetch recent orders
            const fetchRecentOrders = async () => {
                try {
                    const response = await axios.get(`${backendURL}/api/order/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        // Get the 3 most recent orders
                        const orders = response.data.data.orders.slice(0, 3);
                        setRecentOrders(orders);
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };

            fetchProfileData();
            fetchRecentOrders();
        }
    }, [show, token, backendURL]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0d1321] p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Thông Tin Cá Nhân</h2>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">{error}</div>
                    ) : (
                        <>
                            {/* Profile Info */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <div className="flex items-center space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <img
                                                src={assets.user_icon}
                                                alt="User icon"
                                                className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Tên người dùng
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-[#0d1321] focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-[#0d1321] focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn Hàng Gần Đây</h3>
                                <div className="space-y-4">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <img
                                                    src={order.items[0]?.images?.[0] || null}
                                                    alt="Order item"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{order.items[0]?.name || 'Sản phẩm'}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.date).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => window.location.href = '/order'}
                                                    className="px-4 py-2 text-sm text-[#0d1321] font-medium"
                                                >
                                                    Xem Chi Tiết
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-[#0d1321] text-white"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal; 