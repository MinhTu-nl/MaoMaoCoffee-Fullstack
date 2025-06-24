import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import axios from 'axios';

const Profile = () => {
    const { token, backendURL, cartItems, products, updateQuantity, currency, navigate } = useContext(ShopContext);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                        <div className="bg-gray-50 rounded-lg p-6 flex items-center gap-6">
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
        </div>
    );
};

export default Profile;
