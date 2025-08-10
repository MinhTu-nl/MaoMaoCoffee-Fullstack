import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Profile = () => {
    const { token, backendURL, cartItems, products, updateQuantity, currency, navigate } = useContext(ShopContext);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);

    // Hàm chuyển đổi trạng thái sang tiếng Việt
    const getStatusInVietnamese = (status) => {
        const statusMap = {
            'Order Placed': 'Đã đặt hàng',
            'Packing': 'Đang đóng gói',
            'Shipped': 'Đang vận chuyển',
            'Out for delivery': 'Đang giao hàng',
            'Delivered': 'Đã giao hàng',
            'Completed': 'Hoàn thành',
            'Processing': 'Đang xử lý',
            'Cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    // Hàm thay đổi mật khẩu
    const handleChangePassword = async (currentPassword, newPassword) => {
        try {
            setChangePasswordLoading(true);

            const response = await axios.put(`${backendURL}/api/user/change-password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                toast.success('Mật khẩu đã được thay đổi thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setShowChangePasswordModal(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi mật khẩu';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setChangePasswordLoading(false);
        }
    };

    // Lấy thông tin user
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await axios.get(backendURL + `/api/user/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success) {
                    setProfileData(response.data.data);
                    setError(null);
                }
            } catch (error) {
                setError('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [token, backendURL]);

    // Lấy đơn hàng gần đây
    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${backendURL}/api/order/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    // Sắp xếp đơn hàng theo ngày giảm dần (mới nhất trước)
                    const sortedOrders = response.data.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setRecentOrders(sortedOrders.slice(0, 4));
                }
            } catch (error) {
                // ignore
            }
        };
        fetchRecentOrders();
    }, [token, backendURL]);

    // Chuẩn hóa dữ liệu giỏ hàng để render
    const cartData = [];
    for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
            if (cartItems[productId][size] > 0) {
                const product = products.find((p) => p._id === productId);
                if (product) {
                    cartData.push({
                        _id: productId,
                        name: product.name,
                        images: product.images,
                        price: typeof product.price === 'object' ? product.price[size] : product.price,
                        size,
                        quantity: cartItems[productId][size],
                    });
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Thông tin cá nhân & Giỏ hàng hiện có */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Thông tin cá nhân */}
                    <div>
                        <Title text1="THÔNG TIN CÁ NHÂN" />
                        <div className="bg-gray-50 rounded-lg p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-6 mb-6">
                                <img
                                    src={assets.user_icon}
                                    alt="User icon"
                                    className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md"
                                />
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">TÊN NGƯỜI DÙNG</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            readOnly
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">EMAIL</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            readOnly
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Nút thay đổi mật khẩu - thiết kế trung hòa */}
                            <div className="border-t pt-4 mt-auto space-y-3">
                                <button
                                    onClick={() => setShowChangePasswordModal(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Thay Đổi Mật Khẩu
                                </button>

                                {/* Nút xem phản hồi */}
                                <button
                                    onClick={() => navigate('/Feedback')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Xem Phản Hồi
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Giỏ hàng hiện có */}
                    <div>
                        <Title text1="GIỎ HÀNG HIỆN CÓ" />
                        <div className="bg-gray-50 rounded-lg p-6 max-h-60 overflow-y-auto">
                            {cartData.length > 0 ? (
                                cartData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0 border-b pb-3 last:border-0">
                                        <img
                                            src={item.images && item.images.length > 0 ? item.images[0] : assets.parcel_icon}
                                            alt={item.name}
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.price} {currency} | Size: {item.size}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="px-2 py-1 border rounded text-gray-700"
                                                onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                                            >-</button>
                                            <span className="px-2 text-sm">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 border rounded text-gray-700"
                                                onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-8">Giỏ hàng trống</div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Đơn hàng gần đây */}
                <div>
                    <Title text1="ĐƠN HÀNG GẦN ĐÂY" />
                    <div className="bg-gray-50 rounded-lg p-6">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg bg-white mb-4 last:mb-0">
                                    <img
                                        src={order.items[0]?.images?.[0] || assets.parcel_icon}
                                        alt="Order item"
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">{order.items[0]?.name || 'Sản phẩm'}</div>
                                        <div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('vi-VN')}</div>
                                        <div className="text-sm text-gray-600">Trạng thái: {getStatusInVietnamese(order.status)}</div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/order')}
                                        className="px-4 py-2 text-sm text-blue-950 font-medium hover:bg-gray-100 rounded transition-colors"
                                    >Xem Chi Tiết</button>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-8">Chưa có đơn hàng nào</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal thay đổi mật khẩu */}
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSubmit={handleChangePassword}
                loading={changePasswordLoading}
            />
        </div>
    );
};

export default Profile;
